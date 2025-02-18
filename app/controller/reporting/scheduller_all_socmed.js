import { decrypted } from "../../module/crypto.js";
import { logsError, logsSave, logsSend } from "../../view/logs_whatsapp.js";
import { clientData } from "../read_data/read_client_data_from_json.js";
import { getInstaLikes } from "../scrapping_insta/generate_insta_likes.js";
import { getInstaPost } from "../scrapping_insta/generate_insta_post.js";
import { getTiktokPost } from "../scrapping_tiktok/generate_tiktok_post.js";
import { tiktokItemsBridges } from "../scrapping_tiktok/tiktok_items_bridge.js";
import { sendClientResponse } from "../../view/send_whatsapp.js";
import { newReportInsta } from "./insta_report.js";
import { newReportTiktok } from "./tiktok_report.js";

export async function schedullerAllSocmed(timeSwitch) {

    try {
        //Commit if schedule Working
        logsSend(`Generate All Socmed Data Starting...`);
        await clientData().then( 
            async response =>{

                let clientRows = response.data;

                let i = 0;

                (async function loop() {

                    if (++i < clientRows.length) {

                        // //This Procces Tiktok Report
                        // if (decrypted(clientRows[i].STATUS) === "TRUE" 
                        // && decrypted(clientRows[i].TIKTOK_STATE) === "TRUE" 
                        // && decrypted(clientRows[i].TYPE) === process.env.APP_CLIENT_TYPE) {

                        //     logsSave(`${decrypted(clientRows[i].CLIENT_ID)} START LOAD TIKTOK DATA`);
                
                        //     await getTiktokPost(
                        //         clientRows[i]
                        //     ).then(
                        //         async response => {
                        //             switch (response.code){
                        //                 case 200: 
                        //                     await tiktokItemsBridges(
                        //                         clientRows[i], 
                        //                         response.data
                        //                     ).then(
                        //                         async response =>{
                        //                             switch (timeSwitch){
                        //                                 case 'report':                       
                        //                                     await sendClientResponse(
                        //                                         decrypted(clientRows[i].CLIENT_ID), 
                        //                                         decrypted(clientRows[i].SUPERVISOR),
                        //                                         decrypted(clientRows[i].OPERATOR),
                        //                                         decrypted(clientRows[i].GROUP), 
                        //                                         response, 
                        //                                         'REPORT TIKTOK'
                        //                                     );                                            
                        //                                     break;
                                    
                        //                                 case 'routine':
                        //                                     logsSend(response.data)                                         
                        //                                     break;
                                    
                        //                                 default:
                        //                                     break;
                        //                             }           
                        //                         }
                        //                     ).catch(
                        //                         error => {
                        //                             console.log(error);
                        //                             newReportTiktok(clientRows[i]).then(
                        //                                 async response =>{
                        //                                     switch (timeSwitch){
                        //                                         case 'report':                       
                        //                                             await sendClientResponse(
                        //                                                 decrypted(clientRows[i].CLIENT_ID), 
                        //                                                 decrypted(clientRows[i].SUPERVISOR),
                        //                                                 decrypted(clientRows[i].OPERATOR),
                        //                                                 decrypted(clientRows[i].GROUP), 
                        //                                                 response, 
                        //                                                 'REPORT TIKTOK'
                        //                                             );                                            
                        //                                             break;
                                            
                        //                                         case 'routine':
                        //                                             logsSend(response.data)                                         
                        //                                             break;
                                            
                        //                                         default:
                        //                                             break;
                        //                                     }           
                                                        
                        //                             }).catch(                
                        //                                 error => {
                        //                                     reject (error)
                        //                             });                            
                        //                         }
                        //                     );
                                            
                        //                     break;
                                    
                        //                 case 201:   
                        //                     switch (timeSwitch){
                        //                         case 'report':
                        //                         sendClientResponse(
                        //                                 decrypted(clientRows[i].CLIENT_ID), 
                        //                                 decrypted(clientRows[i].SUPERVISOR),
                        //                                 decrypted(clientRows[i].OPERATOR),
                        //                                 decrypted(clientRows[i].GROUP), 
                        //                                 response, 
                        //                                 'REPORT TIKTOK'
                        //                             );                                            
                        //                             break;
                        //                         case 'routine':
                        //                             logsSend(response.data);
                        //                             break;
                        //                         default:
                        //                             break;
                        //                     }
                                    
                        //                 default:

                        //                     break;
                        //             }
                        //         }
                        
                        //     ).catch(
                        //         error => {
                        //             console.log(error)
                        //             newReportTiktok(clientRows[i]).then(
                        //                 async response =>{
                        //                     switch (timeSwitch){
                        //                         case 'report':                       
                        //                             await sendClientResponse(
                        //                                 decrypted(clientRows[i].CLIENT_ID), 
                        //                                 decrypted(clientRows[i].SUPERVISOR),
                        //                                 decrypted(clientRows[i].OPERATOR),
                        //                                 decrypted(clientRows[i].GROUP), 
                        //                                 response, 
                        //                                 'REPORT TIKTOK'
                        //                             );                                            
                        //                             break;
                            
                        //                         case 'routine':
                        //                             logsSend(response.data)                                         
                        //                             break;
                            
                        //                         default:
                        //                             break;
                        //                     }           
                                        
                        //             }).catch(                
                        //                 error => {
                        //                     reject (error)
                        //             });                            
                        //         }
                        //     );
                        // }         

                        //This process Insta Report
                        if (decrypted(clientRows[i].STATUS) === "TRUE" 
                        && decrypted(clientRows[i].INSTA_STATE) === "TRUE" 
                        && decrypted(clientRows[i].TYPE) === process.env.APP_CLIENT_TYPE) {
                            logsSend(`${decrypted(clientRows[i].CLIENT_ID)} START LOAD INSTA DATA`);
                                        
                            await getInstaPost(clientRows[i], "official").then(
                                async response =>{
                                    let todayItems;
                                    switch (response.code){
                                        case 201:
                                            await sendClientResponse(
                                                decrypted(clientRows[i].CLIENT_ID), 
                                                decrypted(clientRows[i].SUPERVISOR),
                                                decrypted(clientRows[i].OPERATOR),
                                                decrypted(clientRows[i].GROUP), 
                                                response, 
                                                'REPORT INSTA'
                                            );    
                                            break; 

                                        default:
                                            logsSave(response.data)
                                            todayItems = response.data;
                                            await getInstaLikes(
                                                response.data, 
                                                clientRows[i]
                                            ).then(
                                                async response => {                                              
                                                    
                                                    logsSave(response.data); 

                                                    await newReportInsta(
                                                        clientRows[i], todayItems, "official"
                                                    ).then(
                                                        async response => {
            
                                                            switch (timeSwitch){
                                                                case 'report':
                                                                    sendClientResponse(
                                                                        decrypted(clientRows[i].CLIENT_ID), 
                                                                        decrypted(clientRows[i].SUPERVISOR),
                                                                        decrypted(clientRows[i].OPERATOR),
                                                                        decrypted(clientRows[i].GROUP), 
                                                                        response, 
                                                                        'REPORT INSTA'
                                                                    );            
                                                                    break;

                                                                case 'routine':
                                                                    logsSend(response.data)
                                                                    break;
                                                            }
                                                        }

                                                    ).catch(
                                                        error => logsError(error)
                                                    );
                                                }
                                            ).catch(
                                                error => logsError(error)
                                            );
                                            break;
                                    }
                                }
                            ).catch(
                                error => logsError(error)
                            );   
                        }  

                        // //This process Insta Report
                        // if (decrypted(clientRows[i].STATUS) === "TRUE" 
                        // && decrypted(clientRows[i].INSTA_2_STATE) === "TRUE" 
                        // && decrypted(clientRows[i].TYPE) === process.env.APP_CLIENT_TYPE) {
                        //     logsSend(`${decrypted(clientRows[i].CLIENT_ID)} START LOAD INSTA DATA`);
                                        
                        //     await getInstaPost(
                        //         clientRows[i], "secondary"
                        //     ).then(
                        //         async response =>{
                        //             let todayItems;

                        //             switch (response.code){
                        //                 case 201:
                        //                     await sendClientResponse(
                        //                         decrypted(clientRows[i].CLIENT_ID), 
                        //                         decrypted(clientRows[i].SUPERVISOR),
                        //                         decrypted(clientRows[i].OPERATOR),
                        //                         decrypted(clientRows[i].GROUP), 
                        //                         response, 
                        //                         'REPORT INSTA'
                        //                     );    
                        //                     break; 

                        //                 default:
                        //                     logsSave(response.data)
                        //                     todayItems = response.data;
                        //                     await getInstaLikes(
                        //                         response.data, 
                        //                         clientRows[i]
                        //                     ).then(
                        //                         async response => {                                              
                                                    
                        //                             logsSave(response.data); 

                        //                             await newReportInsta(
                        //                                 clientRows[i], todayItems, "secondary"
                        //                             ).then(
                        //                                 async response => {
            
                        //                                     switch (timeSwitch){
                        //                                         case 'report':
                        //                                             sendClientResponse(
                        //                                                 decrypted(clientRows[i].CLIENT_ID), 
                        //                                                 decrypted(clientRows[i].SUPERVISOR),
                        //                                                 decrypted(clientRows[i].OPERATOR),
                        //                                                 decrypted(clientRows[i].GROUP), 
                        //                                                 response, 
                        //                                                 'REPORT INSTA'
                        //                                             );            
                        //                                             break;

                        //                                         case 'routine':
                        //                                             logsSend(response.data)
                        //                                             break;
                        //                                     }
                        //                                 }

                        //                             ).catch(
                        //                                 error => logsError(error)
                        //                             );
                        //                         }
                        //                     ).catch(
                        //                         error => logsError(error)
                        //                     );
                        //                     break;
                        //             }
                        //         }
                        //     ).catch(
                        //         error => logsError(error)
                        //     );   
                        // } 

                        setTimeout(loop, 1000);  
                    } else {
                        console.log("Generate All Socmed Done");
                    }
                })();
            }
        ). catch (
            error => logsError(error)
        );  
    //If Something Error
    } catch (error) {
        logsError(error)
    }
}