//Google Spreadsheet
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { tiktokPostAPI } from '../socialMediaAPI/tiktokAPI.js';
import { client } from '../../app.js';
import { ciceroKey, googleAuth } from '../database_query/sheetDoc.js';


export async function getTiktokPost(clientValue) {
    //Date Time
    let d = new Date();
    let localDate = d.toLocaleDateString("en-US", {
        timeZone: "Asia/Jakarta"
    });   

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

            
        const clientName = await clientValue.get('CLIENT_ID');
        const secUid = await clientValue.get('SECUID');

        console.log(`${clientName} Collect Tiktok Post Data`);
        await client.sendMessage('6281235114745@c.us', `${clientName} Collect Tiktok Post Data`);

        if (clientValue.get('STATUS') === 'TRUE') {
            tiktokPostAPI(secUid, cursor).then(async  response =>{
                items = await response.data.data.itemList;
                if (Array.isArray(items)) {
                    for (let i = 0; i < items.length; i++) {
                        let itemDate = new Date(items[i].createTime * 1000);
                        if (itemDate.toLocaleDateString("en-US", {timeZone: "Asia/Jakarta"}) === localDate) {
                            hasContent = true;
                            itemByDay.push(items[i]);
                            todayItems.push(items[i].video.id);
                        }
                                    
                        if (hasContent) {

                            const tiktokOfficialDoc = new GoogleSpreadsheet(ciceroKey.dbKey.tiktokOfficialID, googleAuth); //Google Authentication for InstaOfficial DB
                            await tiktokOfficialDoc.loadInfo(); // loads document properties and worksheets    
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

                                
                
                            });  

                        } else {

                            let responseData = {
                                    data: clientName + ' Tiktok Account Has No Content',
                                    state: true,
                                    code: 201
                            };

                            console.log(responseData.data);
                            await client.sendMessage('6281235114745@c.us', responseData.data);
                            return responseData;
                        
                        }
                    }
                }
 
            });
                    

        
        } else {
 
            let responseData = {
                    data: 'Your Client ID has Expired, Contacts Developers for more Informations',
                    state: true,
                    code: 201
                };
            console.log(responseData.data);

            await client.sendMessage('6281235114745@c.us', responseData.data);

            return responseData;
        }
       
    } catch (error) {
        console.log(error);   
    }
}