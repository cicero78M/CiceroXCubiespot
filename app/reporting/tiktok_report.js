import { newListValueData } from '../database/new_query/data_list_query.js';
import { client } from '../../app.js';
import { decrypted } from '../../json_data_file/crypto.js';
import { readUser } from '../../json_data_file/user_data/read_data_from_dir.js';
import { readdirSync, readFileSync } from 'fs';
  
export async function newReportTiktok(clientValue) {

    return new Promise(
        async (
            resolve, reject
        ) => {
        
            try {

                console.log("Execute Report Tiktok");
                client.sendMessage(
                    '6281235114745@c.us', 
                    "Execute Report Tiktok"
                );
            
                //Date Time
                let d = new Date();
                let localDate = d.toLocaleDateString("en-US", {timeZone: "Asia/Jakarta"});
                let hours = d.toLocaleTimeString("en-US", {timeZone: "Asia/Jakarta"}); 

                let userAll = 0;
                let userCounter = 0;
                let divisiCounter = 0;

                let userRows;
                let responseData;
                let name;
                let nameUpper;
                let tiktokSudah;

                let shortcodeListString = '';
                let userByDivisi = '';
                let dataTiktok = '';

                let divisiList = [];
                let shortcodeList = [];
                let userCommentData = [];
                let notCommentList = [];
                let userNotComment = [];

                const clientName = decrypted(clientValue.CLIENT_ID);
                const tiktokAccount = decrypted(clientValue.TIKTOK);

                if (decrypted(clientValue.STATUS) === 'TRUE') {
                    
                    await newListValueData(
                        clientName, 
                        'DIVISI'
                    ).then(
                        response => divisiList = response
                    )

                    await readUser(
                        clientName
                    ).then( 
                        response => {    
                            userRows = response;                           
                    
                            for (let i = 0; i < response.length; i++) {
                                if (response[i].STATUS === 'TRUE' ){
                                    userAll++;
                                }
                            } 
                        }
                    );


                    
                    let tiktokContentDir = readdirSync(`json_data_file/tiktok_data/tiktok_content/${clientName}`);

                    for (let i = 0; i < tiktokContentDir.length; i++) {

                        let contentItems = JSON.parse(readFileSync(`json_data_file/tiktok_data/tiktok_content/${clientName}/${tiktokContentDir[i]}`));
                        console.log(contentItems);

                        let itemDate = new Date(Number(decrypted(contentItems.TIMESTAMP)) * 1000);
                        let dateNow = itemDate.toLocaleDateString("en-US", {timeZone: "Asia/Jakarta"});

                        // console.log(itemDate.toLocaleDateString("en-US", {timeZone: "Asia/Jakarta"}));
                        // console.log(localDate);


                        if ( dateNow === localDate) {
                            
                            if (!shortcodeList.includes(decrypted(contentItems.SHORTCODE))) {

                                shortcodeList.push(decrypted(contentItems.SHORTCODE));
                                shortcodeListString = shortcodeListString.concat('\nhttps://tiktok.com/' + tiktokAccount + '/video/' + decrypted(contentItems.SHORTCODE));

                            }
                        }
                    }
        
                    if (shortcodeList.length >= 1) {   

                        for (let i = 0; i < shortcodeList.length; i++) {

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
                
                                console.log("Null Data Exist");
                                userNotComment.push(userRows[i].ID_KEY);
                                notLikesList.push(userRows[i]);
                
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

                                    if (decrypted(clientValue.TYPE) === "RES") {
                                        userByDivisi = userByDivisi.concat('\n' + notCommentList[iv].TITLE + ' ' + notCommentList[iv].NAMA 
                                            + ' - ' + notCommentList[iv].TIKTOK);
                                        divisiCounter++;
                                        userCounter++;
                                    } else if (decrypted(clientValue.TYPE)  === "COM") {
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
                        
                        if (decrypted(clientValue.TYPE)  === "RES") {
                            responseData = {
                                data: "Mohon Ijin Komandan,\n\nMelaporkan Rekap Pelaksanaan Komentar dan Likes Pada " + shortcodeList.length + " Konten dari akun Resmi Tik Tok *POLRES " 
                                    + clientName + "* dengan Link konten sbb ::\n" + shortcodeListString + "\n\nWaktu Rekap : " + localDate + "\nJam : " 
                                    + hours + "\n\nDengan Rincian Data sbb:\n\n_Jumlah User : "+ userAll + "_\n_Jumlah User Sudah melaksanakan: " + tiktokSudah 
                                    + "_\n_Jumlah User Belum melaksanakan : "+ userCounter + "_\n\nRincian Data Username Tiktok :" + dataTiktok + "\n\n_System Administrator Cicero_",
                                state: true,
                                code: 200
                            };
                        } else if (decrypted(clientValue.TYPE)  === "COM") {
                            responseData = {
                                data: "*" + clientName + "*\n\nRekap Pelaksanaan Komentar dan Likes Pada " + shortcodeList.length + " Konten dari akun Resmi Tik Tok " 
                                    + clientName+ " dengan Link konten sbb :\n" + shortcodeListString + "\n\nWaktu Rekap : " + localDate + "\nJam : " 
                                    + hours + "\n\nDengan Rincian Data sbb:\n\n_Jumlah User : "+ userAll + "_\n_Jumlah User Sudah melaksanakan: " 
                                    + tiktokSudah + "_\n_Jumlah User Belum melaksanakan : "+ userCounter + "_\n\nRincian Data Username Tiktok :" 
                                    + dataTiktok + "\n\n_System Administrator Cicero_",
                                state: true,
                                code: 200
                            };
                        }
                        console.log('Return Success');
                        resolve (responseData);
                    } else {
                        let responseData = {
                            data: 'Tidak ada Konten Data untuk di Olah',
                            state: true,
                            code: 201
                        };
                        console.log(responseData.data);
                        reject (responseData);
                    }
                } else {   
                    let responseData = {
                        data: 'Your Client ID has Expired, Contacts Developers for more Informations',
                        state: true,
                        code: 201
                    };
                    console.log(responseData.data);               
                    reject (responseData);
                }
            } catch (error) {
                let responseData = {
                    data: error,
                    state: false,
                    code: 303
                };
                console.log(responseData.data);
                reject (responseData);
            }
        }
    );
}