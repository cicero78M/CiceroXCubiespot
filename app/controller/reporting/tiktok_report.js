import { newListValueData } from '../../module/data_list_query.js';
import { decrypted } from '../../module/crypto.js';
import { readdirSync, readFileSync } from 'fs';
import { logsSave } from '../../view/logs_whatsapp.js';
import { readUser } from '../read_data/read_data_from_dir.js';
  
export async function newReportTiktok(clientValue) {

    return new Promise(
        async (resolve, reject) => {
        
            try {
                logsSave("Execute Report Tiktok")            
                //Date Time
                let d = new Date();
                let localDate = d.toLocaleDateString("en-US", {timeZone: "Asia/Jakarta"});
                let hours = d.toLocaleTimeString("en-US", {timeZone: "Asia/Jakarta"}); 

                let userAll = 0;
                let userCounter = 0;
                let divisiCounter = 0;

                let responseData;
                let name;
                let nameUpper;
                let tiktokSudah;

                let shortcodeListString = '';
                let userByDivisi = '';
                let dataTiktok = '';

                let userRows = new Array();
                let divisiList = new Array();
                let shortcodeList = new Array();
                let userCommentData = new Array();
                let notCommentList = new Array();
                let userNotComment = new Array();

                const clientName = decrypted(clientValue.CLIENT_ID);
                const tiktokAccount = decrypted(clientValue.TIKTOK);

                if (decrypted(clientValue.STATUS) === 'TRUE') {

                    console.log("This Value State OK")
                    
                    await newListValueData(
                        clientName, 
                        'DIVISI'
                    ).then(
                        response => {divisiList = response.data;}
                    ).catch(
                        error => {
                            console.log(error);

                            reject(error);
                        }
                    )

                    await readUser(
                        clientName
                    ).then( 
                        response => {    

                            userRows = response.data;                           

                            for (let i = 0; i < userRows.length; i++) {
                                if (userRows[i].STATUS === 'TRUE' ){
                                    userAll++;
                                }
                            } 
                        }
                    ).catch( error => {
                        console.log(error);
                        reject(error);
                    })
                    
                    let tiktokContentDir = readdirSync(`json_data_file/tiktok_data/tiktok_content/${clientName}`);

                    for (let i = 0; i < tiktokContentDir.length; i++) {

                        console.log("This Tiktok Content OK")
                        let contentItems = JSON.parse(readFileSync(`json_data_file/tiktok_data/tiktok_content/${clientName}/${tiktokContentDir[i]}`));

                        let itemDate = new Date(Number(decrypted(contentItems.TIMESTAMP)) * 1000);
                        let dateNow = itemDate.toLocaleDateString("en-US", {timeZone: "Asia/Jakarta"});

                        if ( dateNow === localDate) {

                            if (!shortcodeList.includes(decrypted(contentItems.SHORTCODE))) {

                                shortcodeList.push(decrypted(contentItems.SHORTCODE));
                                shortcodeListString = shortcodeListString.concat('\nhttps://tiktok.com/' + tiktokAccount + '/video/' + decrypted(contentItems.SHORTCODE));

                            }
                        }
                    }
        
                    if (shortcodeList.length >= 1) {   

                        for (let i = 0; i < shortcodeList.length; i++) {

                            console.log("This getting tiktok shortcode OK");

                            let commentItems = JSON.parse(readFileSync(`json_data_file/tiktok_data/tiktok_engagement/tiktok_comments/${clientName}/${shortcodeList[i]}.json`));
                                        
                            for (let ii = 0; ii < commentItems.length; ii++) {
                              if (!userCommentData.includes(decrypted(commentItems[ii]))) {
                                userCommentData.push(decrypted(commentItems[ii]));
                              }
                            }
                        }
                        
                        for (let i = 0; i < userRows.length; i++) {     

                            if (userRows[i].TIKTOK === undefined
                            || userRows[i].TIKTOK === null 
                            || userRows[i].TIKTOK === ""){
                
                                userNotComment.push(userRows[i].ID_KEY);
                                notCommentList.push(userRows[i]);
                
                            } else {
                                if (!userCommentData.includes((userRows[i].TIKTOK).replace('@',''))) {
                                    if (!userNotComment.includes(userRows[i].ID_KEY)) {
                                        if (userRows[i].STATUS === 'TRUE' ){
                                            if (userRows[i].EXCEPTION === "FALSE"){
                                                
                                                userNotComment.push(userRows[i].ID_KEY);
                                                notCommentList.push(userRows[i]);
                                            }                
                                        }
                                    }
                                } 
                            }
                        }

                        for (let iii = 0; iii < divisiList.length; iii++) {

                            divisiCounter = 0;
                            userByDivisi = '';
                            
                            for (let iv = 0; iv < notCommentList.length; iv++) {
                                if (divisiList[iii] === notCommentList[iv].DIVISI) {

                                    if (process.env.APP_CLIENT_TYPE === "RES") {
                                        userByDivisi = userByDivisi.concat('\n' + notCommentList[iv].TITLE + ' ' + notCommentList[iv].NAMA 
                                            + ' - ' + notCommentList[iv].TIKTOK);
                                        divisiCounter++;
                                        userCounter++;
                                    } else if (process.env.APP_CLIENT_TYPE  === "COM") {
                                        name = notCommentList[iv].get('NAMA');
                                        nameUpper = name.toUpperCase();
                                        userByDivisi = userByDivisi.concat('\n' + nameUpper + ' - ' + notCommentList[iv].TIKTOK);
                                        divisiCounter++;
                                        userCounter++;
                                    }
                                }
                            }

                            if (divisiCounter != 0) {
                                dataTiktok = dataTiktok.concat('\n\n*' + divisiList[iii] + '* : ' + divisiCounter + ' User\n' + userByDivisi);
                            }
                        }

                        tiktokSudah = userAll - notCommentList.length;
                        
                        if (process.env.APP_CLIENT_TYPE  === "RES") {
                            responseData = {
                                data: "Mohon Ijin Komandan,\n\nMelaporkan Rekap Pelaksanaan Komentar dan Likes Pada " + shortcodeList.length + " Konten dari akun Resmi Tik Tok *POLRES " 
                                    + clientName + "* dengan Link konten sbb :\n" + shortcodeListString + "\n\nWaktu Rekap : " + localDate + "\nJam : " 
                                    + hours + "\n\nDengan Rincian Data sbb:\n\n_Jumlah User : "+ userAll + "_\n_Jumlah User Sudah melaksanakan: " + tiktokSudah 
                                    + "_\n_Jumlah User Belum melaksanakan : "+ userCounter + "_\n\nRincian Data Username Tiktok :" + dataTiktok + "\n\n_System Administrator Cicero_",
                                state: true,
                                code: 200
                            };
                        } else if (process.env.APP_CLIENT_TYPE  === "COM") {
                            responseData = {
                                data: "*" + clientName + "*\n\nRekap Pelaksanaan Komentar dan Likes Pada " + shortcodeList.length + " Konten dari akun Resmi Tik Tok " 
                                    + clientName+ " dengan Link konten sbb : \n" + shortcodeListString + "\n\nWaktu Rekap : " + localDate + "\nJam : " 
                                    + hours + "\n\nDengan Rincian Data sbb:\n\n_Jumlah User : "+ userAll + "_\n_Jumlah User Sudah melaksanakan: " 
                                    + tiktokSudah + "_\n_Jumlah User Belum melaksanakan : "+ userCounter + "_\n\nRincian Data Username Tiktok :" 
                                    + dataTiktok + "\n\n_System Administrator Cicero_",
                                state: true,
                                code: 200
                            };
                        }
                        resolve (responseData);
                    } else {
                        let responseData = {
                            data: 'Tidak ada Konten Data untuk di Olah',
                            state: true,
                            code: 201
                        };
                        reject (responseData);
                    }
                } else {   
                    let responseData = {
                        data: 'Your Client ID has Expired, Contacts Developers for more Informations',
                        state: true,
                        code: 201
                    };
                    reject (responseData);
                }
            } catch (error) {

                console.log(error)
                let responseData = {
                    data: error,
                    state: false,
                    code: 303
                };
                reject (responseData);
            }
        }
    );
}