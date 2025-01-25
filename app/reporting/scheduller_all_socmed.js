import { client } from "../../app.js";
import { clientData } from "../../json_data_file/client_data/read_client_data_from_json.js";
import { decrypted } from "../../json_data_file/crypto.js";
import { logsResponse, sendResponseData } from "../responselogs/response_view.js";
import { getInstaLikes } from "../scrapping/insta_scrapping/generate_insta_likes.js";
import { getInstaPost } from "../scrapping/insta_scrapping/generate_insta_post.js";
import { getTiktokPost } from "../scrapping/tiktok_scrapping/generate_tiktok_post.js";
import { tiktokItemsBridges } from "../scrapping/tiktok_scrapping/tiktok_items_bridge.js";
import { sendClientResponse, sendResponse } from "../view/sendWA.js";
import { newReportInsta } from "./insta_report.js";

export async function schedullerAllSocmed(timeSwitch) {

    try {
        //Commit if schedule Working
        sendResponseData(`Generate All Socmed Data Starting...`);
        await clientData().then( 
            async clientData =>{
                for (let i = 0; i < clientData.length; i++){
            
                    //This Procces Tiktok Report
                    if (decrypted(clientData[i].STATUS) === "TRUE" 
                    && decrypted(clientData[i].TIKTOK_STATE) === "TRUE" 
                    && decrypted(clientData[i].TYPE) === process.env.APP_CLIENT_TYPE) {
                        sendResponseData(`${decrypted(clientData[i].CLIENT_ID)} START LOAD TIKTOK DATA`);
            
                        await getTiktokPost(
                            clientData[i]
                        ).then(
                            async data => {
                                switch (data.code){
                                    case 200: 

                                        await tiktokItemsBridges(
                                            clientData[i], 
                                            data.data
                                        ).then(
                                            async data =>{
                                                switch (timeSwitch){
                                                    case 'report':
                                    
                                                        sendClientResponse(
                                                            decrypted(clientData[i].CLIENT_ID), 
                                                            decrypted(clientData[i].SUPERVISOR),
                                                            decrypted(clientData[i].OPERATOR),
                                                            decrypted(clientData[i].GROUP), 
                                                            data, 
                                                            'REPORT TIKTOK'
                                                        );                                            
                                    
                                                        break;
                                
                                                    case 'routine':
                                                        sendResponse(
                                                            '6281235114745@c.us', 
                                                            data, 
                                                            'ERROR GET TIKTOK BRIDGES'
                                                        );                                                    
                                                        break;
                                
                                                    default:
                                                        break;
                                                }                   
                                                sendResponseData(`Report TIKTOK SUCCESS!!!`);
                                            }
                                        ).catch(
                                            error => logsResponse(error)
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
                                                    data, 
                                                    'REPORT TIKTOK'
                                                );                                            
                                                break;
                                            case 'routine':
                                                sendResponse(
                                                    '6281235114745@c.us', 
                                                    data, 
                                                    ' ERROR GET TIKTOK BRIDGES'
                                                );
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
                            error => logsResponse(error)
                        );
                    }         

                    //This process Insta Report
                    if (decrypted(clientData[i].STATUS) === "TRUE" 
                    && decrypted(clientData[i].INSTA_STATE) === "TRUE" 
                    && decrypted(clientData[i].TYPE) === process.env.APP_CLIENT_TYPE) {
                        logsResponse(`${decrypted(clientData[i].CLIENT_ID)} START LOAD INSTA DATA`);
            
                        await client.sendMessage(
                            '6281235114745@c.us', 
                            `${decrypted(clientData[i].CLIENT_ID)} START LOAD INSTA DATA`
                        );
                        
                        await getInstaPost(
                            clientData[i]
                        ).then(
                            async instaPostData =>{
                                switch (instaPostData.code){
                                    case 201:
                                        sendClientResponse(
                                            decrypted(clientData[i].CLIENT_ID), 
                                            decrypted(clientData[i].SUPERVISOR),
                                            decrypted(clientData[i].OPERATOR),
                                            decrypted(clientData[i].GROUP), 
                                            instaPostData, 
                                            'REPORT INSTA'
                                        );    
                                        break; 

                                    default:
                                        await getInstaLikes(
                                            instaPostData.data, 
                                            clientData[i]
                                        ).then(
                                            async instaLikesData => {                                              
                                                sendResponseData(instaLikesData.data); 
                                                await newReportInsta(
                                                    clientData[i]
                                                ).then(
                                                    async data => {
        
                                                        switch (timeSwitch){
                                                            case 'report':
                                                                sendClientResponse(
                                                                    decrypted(clientData[i].CLIENT_ID), 
                                                                    decrypted(clientData[i].SUPERVISOR),
                                                                    decrypted(clientData[i].OPERATOR),
                                                                    decrypted(clientData[i].GROUP), 
                                                                    data, 
                                                                    'REPORT INSTA'
                                                                );            
                                                                break;

                                                            case 'routine':
                                                                sendResponse(
                                                                    '6281235114745@c.us', 
                                                                    data, 
                                                                    ' ERROR REPORT INSTA'
                                                                );
                                                                break;
                                                        }

                                                        sendResponseData("Report Insta SUCCESS!!!");
                                                    }

                                                ).catch(
                                                    error => logsResponse(error)
                                                );
                                            }
                                        ).catch(
                                            error => logsResponse(error)
                                        );
                                        break;
                                }
                            }
                        ).catch(
                            error => logsResponse(error)
                        );   
                    }  
                }
            }
        ). catch (
            error => logsResponse(error)
        );  

    //If Something Error
    } catch (error) {
        logsResponse(error)
    }
}