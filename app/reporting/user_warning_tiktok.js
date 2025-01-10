import { ciceroKey, newRowsData } from '../database/new_query/sheet_query.js';
import { client } from '../../app.js';
  
export async function warningReportTiktok(clientValue) {

    return new Promise(
        async (
            resolve, reject
        ) => {
        
            try {

                console.log("Execute Warning Report Tiktok");
                client.sendMessage(
                    '6281235114745@c.us', 
                    "Execute Warning Report Tiktok"
                );
            
                //Date Time
                let d = new Date();
                let localDate = d.toLocaleDateString("en-US", {timeZone: "Asia/Jakarta"});

                let userAll = 0;

                let userRows;

                let shortcodeListString = '';

                let fromRows = [];
                let shortcodeList = [];
                let userCommentData = [];
                let userNotComment = [];
                let notCommentList = [];

                const clientName = clientValue.get('CLIENT_ID');
                const tiktokAccount = clientValue.get('TIKTOK');

                if (clientValue.get('STATUS') === 'TRUE') {
                    
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
                                
                                for (let i = 0; i<notCommentList.length; i++){
                                    if(notCommentList[i].get('WHATSAPP') != ""){
                                        setTimeout(async () => {
                
                                            console.log(`Send Warning Tiktok messages to ${notCommentList[i].get('TITLE')} ${notCommentList[i].get('NAMA')} `);  
                                            await client.sendMessage(
                                                `${notCommentList[i].get('WHATSAPP')}@c.us`,
                                                `Selamat Siang, Bpk/Ibu ${notCommentList[i].get('TITLE')} ${notCommentList[i].get('NAMA')}\n\nSistem kami membaca bahwa Anda belum melaksanakan Likes dan Komentar pada Konten dari Akun Official  berikut :\n\n${shortcodeListString}\n\nSilahkan segera melaksanakan Likes dan Komentar Pada Kesempatan Pertama, Terimakasih.\n\n_Anda Menerima Pesan Otomatis ini karena nomor ini terdaftar sesuai dengan Nama User Tercantum, silahkan Save No WA Bot Pegiat Medsos ini_\n\n_Cicero System_`
                                            );
                                        }, 2000);
                                    }
                                }         
                            }
                        );

                        data = {
                            data: "Send warning Done",
                            state: true,
                            code: 200
                          };
                          resolve (data);       
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