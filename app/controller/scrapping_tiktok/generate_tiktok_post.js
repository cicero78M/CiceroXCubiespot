import { tiktokPostAPI } from '../../module/tiktok_API.js';
import { client } from '../../../app.js';
import { decrypted, encrypted } from '../../module/crypto.js';
import { mkdirSync, writeFileSync } from "fs";
import { logsSave, logsSend } from '../../view/logs_whatsapp.js';

export async function getTiktokPost(clientValue) {

    const clientName = decrypted(clientValue.CLIENT_ID);
    const secUid = decrypted(clientValue.SECUID);
        
    logsSend(`${clientName} Execute Tiktok Post Data`);

    //Date Time
    let d = new Date();
    let localDate = d.toLocaleDateString("en-US", {timeZone: "Asia/Jakarta"});   
    
    return new Promise(async (resolve, reject) => {
        try {

            let cursor = 0;
    
            let items = new Array();
            let itemByDay = new Array();
            let todayItems = new Array();
            
            let hasContent = false;
        
            if (decrypted(clientValue.STATUS) === 'TRUE') {
                await tiktokPostAPI(secUid, cursor).then( async response =>{
                    
                    items =  await response.data.data.itemList;

                    items.forEach(element => {

                        let itemDate = new Date(element.createTime * 1000);
                        if (itemDate.toLocaleDateString("en-US", {timeZone: "Asia/Jakarta"}) === localDate) {
                            logsSave(element.video.id);
                            hasContent = true;
                            itemByDay.push(element);
                            todayItems.push(element.video.id);
                        }
                        
                    });


                    if (hasContent) {

                        logsSave(`${clientName} Official Account Has Post Data...`);
                        await client.sendMessage('6281235114745@c.us', `${clientName} Official Account Has Post Data...`);

                        itemByDay.forEach(element => {

                            let dataObject = new Object();                                            
                            
                            dataObject.TIMESTAMP = encrypted((element.createTime).toString());
                            dataObject.USER_ACCOUNT = encrypted(element.author.uniqueId);
                            dataObject.SHORTCODE = encrypted(element.video.id);
                            dataObject.ID = encrypted(element.id);
                            dataObject.CAPTION = encrypted(element.desc); 
                            dataObject.COMMENT_COUNT = encrypted(((element.statsV2.commentCount).toString()));
                            dataObject.LIKE_COUNT = encrypted((element.statsV2.diggCount).toString());
                            dataObject.PLAY_COUNT = encrypted((element.statsV2.playCount).toString());
                            dataObject.COLLECT_COUNT = encrypted((element.statsV2.collectCount).toString());
                            dataObject.SHARE_COUNT = encrypted((element.statsV2.shareCount).toString());
                            dataObject.REPOST_COUNT = encrypted((element.statsV2.repostCount).toString());

                            try {
    
                                writeFileSync(`json_data_file/tiktok_data/tiktok_content/${clientName}/${element.video.id}.json`, JSON.stringify(dataObject));
                            
                            } catch (error) {
                    
                                mkdirSync(`json_data_file/tiktok_data/tiktok_content/${clientName}`);
                                writeFileSync(`json_data_file/tiktok_data/tiktok_content/${clientName}/${element.video.id}.json`, JSON.stringify(dataObject));
                        
                            }
                            
                        });

                        let data = {
                                data:todayItems,
                                state: true,
                                code: 200
                            }
                            
                        resolve (data);
            
                    } else {
                        let data = {
                                data: 'Tiktok Official Account Has No Content',
                                state: true,
                                code: 201
                        };
                        resolve (data);
                    }

                }).catch(error => {
                    let data = {
                        data: error,
                        state: false,
                        code: 303
                    };
                    reject(data);   
                });

            } else {
                let data = {
                        data: 'Your Client ID has Expired, Contacts Developers for more Informations',
                        state: true,
                        code: 201
                    };
                reject (data);
            }

        } catch (error) {
            let data = {
                data: error,
                state: false,
                code: 303
            };
            reject(data);        
        }
    });
}