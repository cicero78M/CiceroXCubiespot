import { tiktokPostAPI } from '../../socialMediaAPI/tiktok_API.js';
import { client } from '../../../app.js';
import { decrypted, encrypted } from '../../../json_data_file/crypto.js';
import { readdirSync } from "fs";


export async function getTiktokPost(clientValue) {

    const clientName = decrypted(clientValue.CLIENT_ID);
    const secUid = decrypted(clientValue.SECUID);
        
    console.log(`${clientName} Execute Tiktok Post Data`);
    client.sendMessage('6281235114745@c.us', "Execute Tiktok Post Data");

    //Date Time
    let d = new Date();
    let localDate = d.toLocaleDateString("en-US", {timeZone: "Asia/Jakarta"});   
    
    return new Promise(async (resolve, reject) => {
        try {

            let cursor = 0;
    
            let items = [];
            let itemByDay = [];
            let todayItems = [];
            
            let hasContent = false;
        
            if (decrypted(clientValue.STATUS) === 'TRUE') {

                await tiktokPostAPI(secUid, cursor).then( async response =>{
                    console.log(response);
                    items =  await response.data.data.itemList;
                    for (let i = 0; i < items.length; i++) {
                        let itemDate = new Date(items[i].createTime * 1000);
                        if (itemDate.toLocaleDateString("en-US", {timeZone: "Asia/Jakarta"}) === localDate) {
                            console.log(items[i].video.id);
                            hasContent = true;
                            itemByDay.push(items[i]);
                            todayItems.push(items[i].video.id);
                        }
                    }

                    if (hasContent) {

                        console.log(`${clientName} Official Account Has Post Data...`);
                        await client.sendMessage('6281235114745@c.us', `${clientName} Official Account Has Post Data...`);
                        
                        let hasShortcode = false;
                        
                        let shortcodeData = readdirSync(`json_data_file/tiktok_data/tiktok_content/${clientName}`);
            
                        for (let ix = 0; ix < shortcodeData.length; ix++){
                          
                          if (todayItems.includes(shortcodeData[ix].replaceAll('.json', ''))){
                            hasShortcode = true;
                          }
                        }

                        for (let i = 0; i < itemByDay.length; i++) {

                            let dataObject = new Object();                                            
                            
                            dataObject.TIMESTAMP = encrypted((itemByDay[i].createTime).toString());
                            dataObject.USER_ACCOUNT = encrypted(itemByDay[i].author.uniqueId);
                            dataObject.SHORTCODE = encrypted(itemByDay[i].video.id);
                            dataObject.ID = encrypted(itemByDay[i].id);
                            dataObject.CAPTION = encrypted(itemByDay[i].desc); 
                            dataObject.COMMENT_COUNT = encrypted(((itemByDay[i].statsV2.commentCount).toString()));
                            dataObject.LIKE_COUNT = encrypted((itemByDay[i].statsV2.diggCount).toString());
                            dataObject.PLAY_COUNT = encrypted((itemByDay[i].statsV2.playCount).toString());
                            dataObject.COLLECT_COUNT = encrypted((itemByDay[i].statsV2.collectCount).toString());
                            dataObject.SHARE_COUNT = encrypted((itemByDay[i].statsV2.shareCount).toString());
                            dataObject.REPOST_COUNT = encrypted((itemByDay[i].statsV2.repostCount).toString());

                            try {
    
                                writeFileSync(`json_data_file/tiktok_data/tiktok_content/${clientName}/${itemByDay[i].video.id}.json`, JSON.stringify(dataObject));
                            
                            } catch (error) {
                    
                                mkdirSync(`json_data_file/tiktok_data/tiktok_content/${clientName}`);
                                writeFileSync(`json_data_file/tiktok_data/tiktok_content/${clientName}/${itemByDay[i].video.id}.json`, JSON.stringify(dataObject));
                        
                            }   
            
                        }

                        let data = {
                                data:todayItems,
                                state: true,
                                code: 200
                            }
                        resolve (data);
            
                    } else {
                        let data = {
                                data: ' Tiktok Official Account Has No Content',
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