import { client } from "../../app.js";
import { decrypted } from "../../json_data_file/crypto.js";
import { ciceroKey, newRowsData } from "../database/new_query/sheet_query.js";
import { getInstaLikes } from "../scrapping/insta_scrapping/generate_insta_likes.js";
import { getInstaPost } from "../scrapping/insta_scrapping/generate_insta_post.js";
import { getTiktokPost } from "../scrapping/tiktok_scrapping/generate_tiktok_post.js";
import { tiktokItemsBridges } from "../scrapping/tiktok_scrapping/tiktok_items_bridge.js";
import { sendClientResponse, sendResponse } from "../view/sendWA.js";
import { newReportInsta } from "./insta_report.js";

export async function schedullerAllSocmed(
    timeSwitch) {
    let d = new Date();
    let localDate = d.toLocaleDateString("en-US", {timeZone: "Asia/Jakarta"});
    let hours = d.toLocaleTimeString("en-US", {timeZone: "Asia/Jakarta"});     
    let time = localDate+" >> "+hours;
    try {
        //Commit if schedule Working
        await client.sendMessage(
            '6281235114745@c.us', 
            'Generate All Socmed Data Starting...'
        );            
        console.log(time+' Generate All Socmed Data Starting');

        await newRowsData(
            ciceroKey.dbKey.clientDataID, 
            'ClientData_Enc'
        ).then( 
            async clientData =>{

                for (let i = 0; i < clientData.length; i++){
            
                    //This Procces Tiktok Report
                    if (decrypted(clientData[i].get('STATUS')) === "TRUE" 
                    && decrypted(clientData[i].get('TIKTOK_STATE')) === "TRUE" 
                    && decrypted(clientData[i].get('TYPE')) === ciceroKey.ciceroClientType) {
                        console.log(`${time} ${decrypted(clientData[i].get('CLIENT_ID'))} START LOAD TIKTOK DATA`);
            
                        await client.sendMessage(
                            '6281235114745@c.us', 
                            ` ${decrypted(clientData[i].get('CLIENT_ID'))} START LOAD TIKTOK DATA`
                        );
                        
                        await getTiktokPost(
                            clientData[i]
                        ).then(
                            async data => {
                                switch (data.code){
                                    case 201:
                                                  
                                        switch (timeSwitch){
                                            case 'report':
                         
                                               sendClientResponse(
                                                    decrypted(clientData[i].get('CLIENT_ID')), 
                                                    decrypted(clientData[i].get('SUPERVISOR')),
                                                    decrypted(clientData[i].get('OPERATOR')),
                                                    decrypted(clientData[i].get('GROUP')), 
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
                                            sendResponse(
                                                '6281235114745@c.us', 
                                                data, 
                                                ' ERROR GET TIKTOK BRIDGES'
                                            );
                                                break;
                                        }
                                        break;
                                
                                    default: 

                                        await tiktokItemsBridges(
                                            clientData[i], 
                                            data.data
                                        ).then(
                                            async data =>{
                                                switch (timeSwitch){
                                                    case 'report':
                                    
                                                        sendClientResponse(
                                                            decrypted(clientData[i].get('CLIENT_ID')), 
                                                            decrypted(clientData[i].get('SUPERVISOR')),
                                                            decrypted(clientData[i].get('OPERATOR')),
                                                            decrypted(clientData[i].get('GROUP')), 
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
                                        
                                                    sendResponse(
                                                            '6281235114745@c.us', 
                                                            data, 
                                                            ' ERROR GET TIKTOK BRIDGES'
                                                        );
                                                        break;
                                                }                   
                                                console.log("Report TIKTOK SUCCESS!!!");
                                            }
                                        ).catch(
                                            data =>{
                                                sendResponse(
                                                    '6281235114745@c.us', 
                                                    data, 
                                                    ' ERROR TIKTOK BRIDGES'  
                                                );
                                            }
                                        );
                                        break;
                                }
                        
                            }
                    
                        ).catch(
                            data => {
                                sendResponse(
                                    '6281235114745@c.us', 
                                    data, 
                                    ' ERROR GET TIKTOK POST'
                                );
                            }
                        );
                    }         

                    //This process Insta Report
                    if (decrypted(clientData[i].get('STATUS')) === "TRUE" 
                    && decrypted(clientData[i].get('INSTA_STATE')) === "TRUE" 
                    && decrypted(clientData[i].get('TYPE')) === ciceroKey.ciceroClientType) {
                        console.log(`${time} ${decrypted(clientData[i].get('CLIENT_ID'))} START LOAD INSTA DATA`);
            
                        await client.sendMessage(
                            '6281235114745@c.us', 
                            `${decrypted(clientData[i].get('CLIENT_ID'))} START LOAD INSTA DATA`
                        );
                        
                        await getInstaPost(
                            clientData[i]
                        ).then(
                            async instaPostData =>{
                                switch (instaPostData.code){
                                    case 201:
                                        sendClientResponse(
                                            decrypted(clientData[i].get('CLIENT_ID')), 
                                            decrypted(clientData[i].get('SUPERVISOR')),
                                            decrypted(clientData[i].get('OPERATOR')),
                                            decrypted(clientData[i].get('GROUP')), 
                                            instaPostData, 
                                            'REPORT INSTA'
                                        );    
                                        break; 

                                    default:
                                        console.log(instaPostData);
                                        await getInstaLikes(
                                            instaPostData.data, 
                                            clientData[i]
                                        ).then(
                                            async instaLikesData => {
                                                    
                                                console.log(instaLikesData.data);
                                                
                                                await client.sendMessage(
                                                    '6281235114745@c.us', 
                                                    instaLikesData.data
                                                ); 

                                                await newReportInsta(
                                                    clientData[i]
                                                ).then(
                                                    async data => {
        
                                                        switch (timeSwitch){
        
                                                            case 'report':
                                                                sendClientResponse(
                                                                    decrypted(clientData[i].get('CLIENT_ID')), 
                                                                    decrypted(clientData[i].get('SUPERVISOR')),
                                                                    decrypted(clientData[i].get('OPERATOR')),
                                                                    decrypted(clientData[i].get('GROUP')), 
                                                                    data, 
                                                                    'REPORT TIKTOK'
                                                                );            
                                                                break;

                                                            default:
                                                                
                                                                sendResponse(
                                                                    '6281235114745@c.us', 
                                                                    data, 
                                                                    ' ERROR GET TIKTOK BRIDGES'
                                                                );
                                                                break;
                                                        }
                                                        console.log("Report Insta SUCCESS!!!");
                                                    }

                                                ).catch(
                                                    async data => {
                                                        sendResponse(
                                                            '6281235114745@c.us', 
                                                            data, 
                                                            ' ERROR GET INSTA REPORT'
                                                        );
                                                    }
                                                );
                                            }
                                        ).catch(
                                            async data => {
                                                sendResponse(
                                                    '6281235114745@c.us', 
                                                    data, 
                                                    ' ERROR GET INSTA LIKES'
                                                );
                                            }
                                        ); 
                                        break;
                                }
                            }

                        ).catch(
                            async data => {

                                sendResponse(
                                    '6281235114745@c.us', 
                                    data, 
                                    ' ERROR GET INSTA POST'
                                );

                                schedullerAllSocmed(timeSwitch);

                            }
                        );   
                    }  
                }
            }
        ). catch (
            error =>{
                setTimeout(() => {
                    console.error(error);
                    console.log ("Re-Try");
                }, 10000);
                
                schedullerAllSocmed(timeSwitch);
            }
        );  

    //If Something Error
    } catch (error) {
        console.log(error)
        await client.sendMessage('6281235114745@c.us', 
            'Cron Job Hourly Error '
        );
    }
}