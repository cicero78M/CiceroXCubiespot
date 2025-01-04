//Google Spreadsheet
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { tiktokPostAPI } from '../socialMediaAPI/tiktokAPI.js';
import { client } from '../../app.js';
import { ciceroKey, googleAuth } from '../database/new_query/sheet_query.js';


export async function getTiktokPost(clientValue) {
    //Date Time
    let d = new Date();
    let localDate = d.toLocaleDateString("en-US", {timeZone: "Asia/Jakarta"});   
    return new Promise(async (resolve, reject) => {

        try {

            let cursor = 0;
            let shortcodeUpdateCounter = 0;
            let shortcodeNewCounter = 0;
    
            let items = [];
            let itemByDay = [];
            let todayItems = [];
            let shortcodeList = [];
            
            let hasContent = false;
            let hasShortcode = false;
    
            const clientName = clientValue.get('CLIENT_ID');
            const secUid = clientValue.get('SECUID');
            console.log(`${clientName} Collect Tiktok Post Data`);
            client.sendMessage('6281235114745@c.us', `${clientName} Collect Tiktok Post Data`);
    
            if (clientValue.get('STATUS') === 'TRUE') {

                await tiktokPostAPI(secUid, cursor).then( response =>{
                    items =  response.data.data.itemList;

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

                        const tiktokOfficialDoc = new GoogleSpreadsheet(ciceroKey.dbKey.tiktokOfficialID, googleAuth); //Google Authentication for InstaOfficial DB
                        tiktokOfficialDoc.loadInfo(); // loads document properties and worksheets    
                        const officialTiktokSheet = tiktokOfficialDoc.sheetsByTitle[clientName];
                        officialTiktokSheet.getRows().then(response =>{

                            for (let i = 0; i < response.length; i++) {
                                if (!shortcodeList.includes(response[i].get('SHORTCODE'))) {
                                    shortcodeList.push(response[i].get('SHORTCODE'));
                                }
                            }

                            for (let i = 0; i < itemByDay.length; i++) {
                                if (shortcodeList.includes(itemByDay[i].video.id)) {
                                    hasShortcode = true;
                                }
                            }

                            if (hasShortcode) {
                                for (let i = 0; i < itemByDay.length; i++) {
                                    for (let ii = 0; ii < response.length; ii++) {
                                        if (response[ii].get('SHORTCODE') === itemByDay[i].video.id) {
                                            response[ii].assign({
                                                TIMESTAMP: itemByDay[i].createTime, USER_ACCOUNT: itemByDay[i].author.uniqueId,
                                                SHORTCODE: itemByDay[i].video.id, ID: itemByDay[i].id, CAPTION: itemByDay[i].desc, COMMENT_COUNT: itemByDay[i].statsV2.commentCount,
                                                LIKE_COUNT: itemByDay[i].statsV2.diggCount, PLAY_COUNT: itemByDay[i].statsV2.playCount, COLLECT_COUNT: itemByDay[i].statsV2.collectCount,
                                                SHARE_COUNT: itemByDay[i].statsV2.shareCount, REPOST_COUNT: itemByDay[i].statsV2.repostCount
                                            }); // Jabatan Divisi Value
                                            response[ii].save(); //save update
                                            shortcodeUpdateCounter++;
                                        } else if (!shortcodeList.includes(itemByDay[i].video.id)) {
                                            shortcodeList.push(itemByDay[i].video.id);   
                                            officialTiktokSheet.addRow({
                                                TIMESTAMP: itemByDay[i].createTime, USER_ACCOUNT: itemByDay[i].author.uniqueId,
                                                SHORTCODE: itemByDay[i].video.id, ID: itemByDay[i].id, CAPTION: itemByDay[i].desc, COMMENT_COUNT: itemByDay[i].statsV2.commentCount,
                                                LIKE_COUNT: itemByDay[i].statsV2.diggCount, PLAY_COUNT: itemByDay[i].statsV2.playCount, COLLECT_COUNT: itemByDay[i].statsV2.collectCount,
                                                SHARE_COUNT: itemByDay[i].statsV2.shareCount, REPOST_COUNT: itemByDay[i].statsV2.repostCount
                                            });
                                            shortcodeNewCounter++;
                                        }
                                    }
                                }

                            } else {
                                //Push New Shortcode Content to Database
                                for (let i = 0; i < itemByDay.length; i++) {
                                    officialTiktokSheet.addRow({
                                        TIMESTAMP: itemByDay[i].createTime, USER_ACCOUNT: itemByDay[i].author.uniqueId,
                                        SHORTCODE: itemByDay[i].video.id, ID: itemByDay[i].id, CAPTION: itemByDay[i].desc, COMMENT_COUNT: itemByDay[i].statsV2.commentCount,
                                        LIKE_COUNT: itemByDay[i].statsV2.diggCount, PLAY_COUNT: itemByDay[i].statsV2.playCount, COLLECT_COUNT: itemByDay[i].statsV2.collectCount,
                                        SHARE_COUNT: itemByDay[i].statsV2.shareCount, REPOST_COUNT: itemByDay[i].statsV2.repostCount
                                    });
                                    shortcodeNewCounter++;
                                }
                            }

                                
                            let data = {
                                data:todayItems,
                                state: true,
                                code: 200
                            }

                            resolve (data);
                            
                        }).catch(
                            response =>{
                                let data = {
                                    data: response,
                                    state: true,
                                    code: 303
                                };
                                reject (data);

                            }

                        );

                
                    } else {
                        let data = {
                                data: ' Tiktok Account Has No Content',
                                state: true,
                                code: 201
                        };
                        reject (data);
                    }
                    
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