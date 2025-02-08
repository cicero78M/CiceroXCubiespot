import { decrypted } from "../../module/crypto.js";
import { logsError, logsSave, logsSend } from "../../view/logs_whatsapp.js";
import { clientData } from "../read_data/read_client_data_from_json.js";
import { getInstaLikes } from "../scrapping_insta/generate_insta_likes.js";
import { getInstaPost } from "../scrapping_insta/generate_insta_post.js";
import { getTiktokPost } from "../scrapping_tiktok/generate_tiktok_post.js";
import { tiktokItemsBridges } from "../scrapping_tiktok/tiktok_items_bridge.js";
import { sendClientResponse } from "../../view/send_whatsapp.js";
import { newReportInsta } from "./insta_report.js";

export async function schedullerAllSocmed(timeSwitch) {

    try {
        //Commit if schedule Working
        logsSend(`Generate All Socmed Data Starting...`);
        await clientData().then( 
            async response =>{
                let clientData = response.data;
                for (let i = 0; i < clientData.length; i++){
            
                    //This Procces Tiktok Report
                    if (decrypted(clientData[i].STATUS) === "TRUE" 
                    && decrypted(clientData[i].TIKTOK_STATE) === "TRUE" 
                    && decrypted(clientData[i].TYPE) === process.env.APP_CLIENT_TYPE) {

                        logsSave(`${decrypted(clientData[i].CLIENT_ID)} START LOAD TIKTOK DATA`);
            
                        await getTiktokPost(
                            clientData[i]
                        ).then(
                            async response => {
                                switch (response.code){
                                    case 200: 
                                        await tiktokItemsBridges(
                                            clientData[i], 
                                            response.data
                                        ).then(
                                            async response =>{
                                                switch (timeSwitch){
                                                    case 'report':                       
                                                        await sendClientResponse(
                                                            decrypted(clientData[i].CLIENT_ID), 
                                                            decrypted(clientData[i].SUPERVISOR),
                                                            decrypted(clientData[i].OPERATOR),
                                                            decrypted(clientData[i].GROUP), 
                                                            response, 
                                                            'REPORT TIKTOK'
                                                        );                                            
                                                        break;
                                
                                                    case 'routine':
                                                        logsSend(response.data)                                         
                                                        break;
                                
                                                    default:
                                                        break;
                                                }           
                                            }
                                        ).catch(
                                            error => {
                                                newReportTiktok(clientData[i]).then(
                                                    async response =>{
                                                        switch (timeSwitch){
                                                            case 'report':                       
                                                                await sendClientResponse(
                                                                    decrypted(clientData[i].CLIENT_ID), 
                                                                    decrypted(clientData[i].SUPERVISOR),
                                                                    decrypted(clientData[i].OPERATOR),
                                                                    decrypted(clientData[i].GROUP), 
                                                                    response, 
                                                                    'REPORT TIKTOK'
                                                                );                                            
                                                                break;
                                        
                                                            case 'routine':
                                                                logsSend(response.data)                                         
                                                                break;
                                        
                                                            default:
                                                                break;
                                                        }           
                                                    
                                                }).catch(                
                                                    error => {
                                                        reject (error)
                                                });                            
                                            }

                                        );
                                        
                                        break;
                                
                                    case 201:   
                                        switch (timeSwitch){
                                            case 'report':
                                               sendClientResponse(
                                                    decrypted(clientData[i].CLIENT_ID), 
                                                    decrypted(clientData[i].SUPERVISOR),
                                                    decrypted(clientData[i].OPERATOR),
                                                    decrypted(clientData[i].GROUP), 
                                                    response, 
                                                    'REPORT TIKTOK'
                                                );                                            
                                                break;
                                            case 'routine':
                                                logsSend(response.data);
                                                break;
                                            default:
                                                break;
                                        }

                                        break;
                                
                                    default:
                                        break;
                                }
                            }
                    
                        ).catch(
                            error => {
                                newReportTiktok(clientData[i]).then(
                                    async response =>{
                                        switch (timeSwitch){
                                            case 'report':                       
                                                await sendClientResponse(
                                                    decrypted(clientData[i].CLIENT_ID), 
                                                    decrypted(clientData[i].SUPERVISOR),
                                                    decrypted(clientData[i].OPERATOR),
                                                    decrypted(clientData[i].GROUP), 
                                                    response, 
                                                    'REPORT TIKTOK'
                                                );                                            
                                                break;
                        
                                            case 'routine':
                                                logsSend(response.data)                                         
                                                break;
                        
                                            default:
                                                break;
                                        }           
                                    
                                }).catch(                
                                    error => {
                                        reject (error)
                                });                            
                            }
                        );
                    }         

                    //This process Insta Report
                    if (decrypted(clientData[i].STATUS) === "TRUE" 
                    && decrypted(clientData[i].INSTA_STATE) === "TRUE" 
                    && decrypted(clientData[i].TYPE) === process.env.APP_CLIENT_TYPE) {
                        logsSend(`${decrypted(clientData[i].CLIENT_ID)} START LOAD INSTA DATA`);
                                    
                                                await getInstaPost(
                                                    clientData[i], "official"
                                                ).then(
                                                    async response =>{
                                                        
                                                        let instaPostData = response.data;
                                                        
                                                        logsSave(instaPostData);
                                                        
                                                        await getInstaLikes(
                                                            instaPostData, 
                                                            clientData[i]
                                                        ).then(
                                                            async instaLikesData =>{

                                                                logsSave(instaLikesData.data);
                                                                
                                                                await client.sendMessage(
                                                                    msg.from, 
                                                                    instaLikesData.data
                                                                );
    
                                                                await newReportInsta(
                                                                    clientData[i], instaPostData, "official"                                                                ).then(
                                                                    async data => {
                                                                        logsSave("Report Success!!!");
                                                                        await client.sendMessage(
                                                                            msg.from, 
                                                                            data.data
                                                                        );
                                                                }).catch(                
                                                                    async data => {
                                                                        switch (data.code) {
    
                                                                            case 303:
                                                                                logsSave(data.data);
                                                                                await client.sendMessage(
                                                                                    '6281235114745@c.us', 
                                                                                    decrypted(clientData[i].CLIENT_ID)+' ERROR REPORT INSTA POST'
                                                                                );
                                                                                break;
    
                                                                            default:
                                                                                await client.sendMessage(
                                                                                    '6281235114745@c.us', 
                                                                                    decrypted(clientData[i].CLIENT_ID)+' '+data.data
                                                                                );
                                                                                break;
                                                                        }
                                                                });
                                                            }
                                                        ).catch(
                                                            async data => {
                                                                switch (data.code) {
                                                                    
                                                                    case 303:
                                                                        logsSave(data.data);
                                                                        await client.sendMessage(
                                                                            '6281235114745@c.us', 
                                                                            decrypted(clientData[i].CLIENT_ID)+' ERROR GET INSTA LIKES'
                                                                        );
                                                                        break;
                                                                    
                                                                    default:
                                                                        logsSave(data);
                                                                        await client.sendMessage(
                                                                            '6281235114745@c.us', 
                                                                            decrypted(clientData[i].CLIENT_ID)+' '+data.data
                                                                        );
                                                                        break;
                                                                }
                                                            }
                                                        ); 
                                                    }
                                                ).catch(
                                                    async data => {
                                                        switch (data.code) {
    
                                                            case 303:
                                                                logsSave(data.data);
                                                                await client.sendMessage(
                                                                    '6281235114745@c.us', 
                                                                    decrypted(clientData[i].CLIENT_ID)+' ERROR GET INSTA POST'
                                                                );
                                                                break;
    
                                                            default:
                                                                logsSave(data);
                                                                await client.sendMessage(
                                                                    '6281235114745@c.us', 
                                                                    decrypted(clientData[i].CLIENT_ID)+' '+data.data
                                                                );
                                                                break;
                                                        }
                                                    }
                                                )
                    }  

                    //This process Insta Report
                    if (decrypted(clientData[i].STATUS) === "TRUE" 
                    && decrypted(clientData[i].INSTA_2_STATE) === "TRUE" 
                    && decrypted(clientData[i].TYPE) === process.env.APP_CLIENT_TYPE) {
                        logsSend(`${decrypted(clientData[i].CLIENT_ID)} START LOAD INSTA DATA`);
                                    
                        await getInstaPost(
                            clientData[i], "secondary"
                        ).then(
                            async response =>{
                                let todayItems;

                                switch (response.code){
                                    case 201:
                                        await sendClientResponse(
                                            decrypted(clientData[i].CLIENT_ID), 
                                            decrypted(clientData[i].SUPERVISOR),
                                            decrypted(clientData[i].OPERATOR),
                                            decrypted(clientData[i].GROUP), 
                                            response, 
                                            'REPORT INSTA'
                                        );    
                                        break; 

                                    default:
                                        logsSave(response.data)
                                        todayItems = response.data;
                                        await getInstaLikes(
                                            response.data, 
                                            clientData[i]
                                        ).then(
                                            async response => {                                              
                                                
                                                logsSave(response.data); 

                                                await newReportInsta(
                                                    clientData[i], todayItems, "secondary"
                                                ).then(
                                                    async response => {
        
                                                        switch (timeSwitch){
                                                            case 'report':
                                                                sendClientResponse(
                                                                    decrypted(clientData[i].CLIENT_ID), 
                                                                    decrypted(clientData[i].SUPERVISOR),
                                                                    decrypted(clientData[i].OPERATOR),
                                                                    decrypted(clientData[i].GROUP), 
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
                }
            }
        ). catch (
            error => logsError(error)
        );  
    //If Something Error
    } catch (error) {
        logsError(error)
    }
}