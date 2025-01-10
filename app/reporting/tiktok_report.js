import { newListValueData } from '../database/new_query/data_list_query.js';
import { ciceroKey, newRowsData } from '../database/new_query/sheet_query.js';
import { client } from '../../app.js';
  
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
                let fromRows = [];
                let shortcodeList = [];
                let userCommentData = [];
                let userNotComment = [];
                let notCommentList = [];

                const clientName = clientValue.get('CLIENT_ID');
                const tiktokAccount = clientValue.get('TIKTOK');

                if (clientValue.get('STATUS') === 'TRUE') {
                    
                    await newListValueData(
                        clientName, 
                        'DIVISI'
                    ).then(
                        response => divisiList = response
                    )

                    await newRowsData(
                        ciceroKey.dbKey.userDataID, 
                        clientName
                    ).then( 
                        response => {    
                    
                            userRows = response;                           
                    
                            for (let i = 0; i < response.length; i++) {
                                if (response[i].get('STATUS') === 'TRUE' ){
                                    userAll++;
                                }
                            } 
                        }
                    );

                    await newRowsData(
                        ciceroKey.dbKey.tiktokOfficialID, 
                        clientName
                    ).then( 
                        response => {            
                            for (let i = 0; i < response.length; i++) {
                                let itemDate = new Date(response[i].get('TIMESTAMP') * 1000);
                                if (itemDate.toLocaleDateString("en-US", {timeZone: "Asia/Jakarta"}) === localDate) {
                                    if (!shortcodeList.includes(response[i].get('SHORTCODE'))) {
                                        shortcodeList.push(response[i].get('SHORTCODE'));
                                        shortcodeListString = shortcodeListString.concat('\nhttps://tiktok.com/' + tiktokAccount + '/video/' + response[i].get('SHORTCODE'));
                                    }
                                }
                            }
                            
                    });
        
                    if (shortcodeList.length >= 1) {   

                        await newRowsData(
                            ciceroKey.dbKey.tiktokCommentUsernameID, 
                            clientName
                        ).then( 
                            response => {  
                                for (let i = 0; i < shortcodeList.length; i++) {
                                    for (let ii = 0; ii < response.length; ii++) {
                                        if (response[ii].get('SHORTCODE') === shortcodeList[i]) {
                                            fromRows = Object.values(response[ii].toObject());
                                            for (let iii = 0; iii < fromRows.length; iii++) {
                                                if (fromRows[iii] != undefined || fromRows[iii] != null || fromRows[iii] != "") {
                                                    if (!userCommentData.includes(fromRows[iii])) {
                                                        userCommentData.push(fromRows[iii]);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }

                                for (let iii = 0; iii < userRows.length; iii++) {
                                    if (!userCommentData.includes(userRows[iii].get('TIKTOK').replaceAll('@', ''))) {
                                        if (!userNotComment.includes(userRows[iii].get('ID_KEY'))) {
                                            if (userRows[iii].get('STATUS') === 'TRUE' ){
                                                if (userRows[iii].get('EXCEPTION') === "FALSE"){                   
                                                    userNotComment.push(userRows[iii].get('ID_KEY'));
                                                    notCommentList.push(userRows[iii]);
                                                }
                                            }
                                        }
                                    }
                                }
                                
                            }
                        );

                        for (let iii = 0; iii < divisiList.length; iii++) {

                            divisiCounter = 0;
                            userByDivisi = '';
                            
                            for (let iv = 0; iv < notCommentList.length; iv++) {
                                if (divisiList[iii] === notCommentList[iv].get('DIVISI')) {

                                    if (clientValue.get('TYPE') === "RES") {
                                        userByDivisi = userByDivisi.concat('\n' + notCommentList[iv].get('TITLE') + ' ' + notCommentList[iv].get('NAMA') + ' - ' + notCommentList[iv].get('TIKTOK'));
                                        divisiCounter++;
                                        userCounter++;
                                    } else if (clientValue.get('TYPE')  === "COM") {
                                        name = notCommentList[iv].get('NAMA');
                                        nameUpper = name.toUpperCase();
                                        userByDivisi = userByDivisi.concat('\n' + nameUpper + ' - ' + notCommentList[iv].get('TIKTOK'));
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
                        
                        if (clientValue.get('TYPE')  === "RES") {
                            responseData = {
                                data: "Mohon Ijin Komandan,\n\nMelaporkan Rekap Pelaksanaan Komentar dan Likes Pada " + shortcodeList.length + " Konten dari akun Resmi Tik Tok *POLRES " 
                                    + clientName + "* dengan Link konten sbb ::\n" + shortcodeListString + "\n\nWaktu Rekap : " + localDate + "\nJam : " 
                                    + hours + "\n\nDengan Rincian Data sbb:\n\n_Jumlah User : "+ userAll + "_\n_Jumlah User Sudah melaksanakan: " + tiktokSudah 
                                    + "_\n_Jumlah User Belum melaksanakan : "+ userCounter + "_\n\nRincian Data Username Tiktok :" + dataTiktok + "\n\n_System Administrator Cicero_",
                                state: true,
                                code: 200
                            };
                        } else if (clientValue.get('TYPE')  === "COM") {
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