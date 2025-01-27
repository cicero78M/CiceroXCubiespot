import { decrypted } from '../../json_data_file/crypto.js';
import { readUser } from '../../json_data_file/user_data/read_data_from_dir.js';
import { readdirSync, readFileSync } from "fs";
import { logsSave, logsSend } from '../responselogs/logs_modif.js';
import { notifView } from '../view/notif_view.js';
  
export async function warningReportTiktok(clientValue) {
    
    return new Promise(
        async (
            resolve, reject
        ) => {
            try {
                logsSend("Execute Warning Report Tiktok");
            
                //Date Time
                let d = new Date();
                let localDate = d.toLocaleDateString("en-US", {timeZone: "Asia/Jakarta"});

                let userAll = 0;
                let userRows;
                let data;

                let shortcodeListString = '';

                let shortcodeList = [];
                let userCommentData = [];
                let userNotComment = [];
                let notCommentList = [];

                const clientName = decrypted(clientValue.CLIENT_ID);
                const tiktokAccount = decrypted(clientValue.TIKTOK);

                if (decrypted(clientValue.STATUS)) {
                    
                    await readUser(
                        clientName
                    ).then( 
                        response => {    
                            userRows = response.data;                           
                    
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
                
                                logsSave("Null Data Exist");
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

                        notifView(notCommentList, shortcodeListString).then(
                        response => resolve(response)
                        ).catch(
                        error => reject (error)
                        );    

                    } else {
                        data = {
                            data: 'Tidak ada Konten Data untuk di Olah',
                            state: true,
                            code: 201
                        };
                        
                        reject (data);                
                    }
                } else {   
                    data = {
                        data: 'Your Client ID has Expired, Contacts Developers for more Informations',
                        state: true,
                        code: 201
                    };
                    reject (data);
                }
            } catch (error) {
                data = {
                    data: error,
                    message:"Error On User Warning Tiktok",
                    state: false,
                    code: 303
                };
                reject (responseData);
            }
        }
    );
}