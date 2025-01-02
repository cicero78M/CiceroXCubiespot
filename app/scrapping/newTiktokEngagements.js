//Google Spreadsheet
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { tiktokPostAPI, tiktokCommentAPI } from '../socialMediaAPI/tiktokAPI.js';
import { client } from '../../app.js';
import { ciceroKey, googleAuth } from '../database_query/sheetDoc.js';

export async function newCollectTiktokComments(clientValue) {
  //Date Time
  let d = new Date();
  let localDate = d.toLocaleDateString("en-US", { timeZone: "Asia/Jakarta" });   
  try {    

    const clientName = clientValue.get('CLIENT_ID');
    const secUid = await clientValue.get('SECUID');

    
    console.log(`${clientName} Collect Tiktok Data`);
    await client.sendMessage('6281235114745@c.us', `${clientName} Collect Tiktok Data`);
    
    let cursor = 0;
    let shortcodeUpdateCounter = 0;
    let shortcodeNewCounter = 0;
    var newData = 0;
    var updateData = 0;
    let cursorNumber = 0;
    let total = 0;

    let items = [];
    let itemByDay = [];
    let todayItems = [];
    let shortcodeList = [];
    let hasContent = false;
    let hasShortcode = false;

    if (clientValue.get('STATUS') === 'TRUE') {

      await tiktokPostAPI(secUid, cursor).then (responseContent =>{
        items = responseContent.data.data.itemList;
        if (Array.isArray(items)) {
            for (let i = 0; i < items.length; i++) {
              let itemDate = new Date(items[i].createTime * 1000);
              if (itemDate.toLocaleDateString("en-US", {timeZone: "Asia/Jakarta"}) === localDate) {
                hasContent = true;
                itemByDay.push(items[i]);
                todayItems.push(items[i].video.id);
              }
            }
          }
      });                

      if (hasContent) {

        //Google Authentication for InstaOfficial DB
        const tiktokOfficialDoc = new GoogleSpreadsheet(ciceroKey.dbKey.tiktokOfficialID, googleAuth); 
        await tiktokOfficialDoc.loadInfo(); // loads document properties and worksheets    
        const officialTiktokSheet = tiktokOfficialDoc.sheetsByTitle[clientName];
        await officialTiktokSheet.getRows().then(async  officialTiktokData => {
            for (let i = 0; i < officialTiktokData.length; i++) {
                if (!shortcodeList.includes(officialTiktokData[i].get('SHORTCODE'))) {
                shortcodeList.push(officialTiktokData[i].get('SHORTCODE'));
                }
            }

            //Check if Database Contains Shortcode Items        
            for (let i = 0; i < itemByDay.length; i++) {
                if (shortcodeList.includes(itemByDay[i].video.id)) {
                    hasShortcode = true;
                }
            }

            //If Database Contains Shortcode 
            if (hasShortcode) {
                for (let i = 0; i < itemByDay.length; i++) {
                    for (let ii = 0; ii < officialTiktokData.length; ii++) {
                        if (officialTiktokData[ii].get('SHORTCODE') === itemByDay[i].video.id) {
                            //Update Existing Content Database                
                            officialTiktokData[ii].assign({
                            TIMESTAMP: itemByDay[i].createTime, USER_ACCOUNT: itemByDay[i].author.uniqueId,
                            SHORTCODE: itemByDay[i].video.id, ID: itemByDay[i].id, CAPTION: itemByDay[i].desc, COMMENT_COUNT: itemByDay[i].statsV2.commentCount,
                            LIKE_COUNT: itemByDay[i].statsV2.diggCount, PLAY_COUNT: itemByDay[i].statsV2.playCount, COLLECT_COUNT: itemByDay[i].statsV2.collectCount,
                            SHARE_COUNT: itemByDay[i].statsV2.shareCount, REPOST_COUNT: itemByDay[i].statsV2.repostCount
                            }); // Jabatan Divisi Value
                            await officialTiktokData[ii].save(); //save update
                            shortcodeUpdateCounter++;
                        } else if (!shortcodeList.includes(itemByDay[i].video.id)) {
                            //Push New Content to Database  
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

        }).catch(response => {
            console.log(response);
        });
        

        const tiktokCommentsUsernameDoc = new GoogleSpreadsheet(ciceroKey.dbKey.tiktokCommentUsernameID, googleAuth); //Google Authentication for instaLikes Username DB
        await tiktokCommentsUsernameDoc.loadInfo(); // loads document properties and worksheets            // loads document properties and worksheets
        let tiktokCommentsUsernameSheet = tiktokCommentsUsernameDoc.sheetsByTitle[clientName];
        await tiktokCommentsUsernameSheet.getRows().then (async tiktokCommentsUsernameData =>{

            for (let i = 0; i < todayItems.length; i++) {
                //code on the go
                for (let ii = 0; ii < tiktokCommentsUsernameData.length; ii++) {
      
                  if (tiktokCommentsUsernameData[ii].get('SHORTCODE') === todayItems[i]) {

                    let newDataUsers = [];
                    hasShortcode = true;
                    
                    const fromRows = Object.values(tiktokCommentsUsernameData[ii].toObject());
      
                    for (let iii = 0; iii < fromRows.length; iii++) {
                      if (fromRows[iii] !== undefined || fromRows[iii] !== null || fromRows[iii] !== "") {
                        if (!newDataUsers.includes(fromRows[iii])) {
                          newDataUsers.push(fromRows[iii]);
                        }
                      }
                    }
      
                    do {
      
                      setTimeout(async () => {
                        await tiktokCommentAPI(todayItems[i], cursorNumber).then (async responseComments =>{

                            let commentItems = await responseComments.data.comments;
                            for (let iii = 0; iii < commentItems.length; iii++) {
                              if (commentItems[iii].user.unique_id != undefined || commentItems[iii].user.unique_id != null || commentItems[iii].user.unique_id != "") {
                                if (!newDataUsers.includes(commentItems[iii].user.unique_id)) {
                                  newDataUsers.push(commentItems[iii].user.unique_id);
                                }
                              }
                            }
                            total;
                            cursorNumber;
                            
                            total = await responseComments.data.total + 50;
                            cursorNumber = await responseComments.data.cursor;

                            console.log("Update Data " + cursorNumber + " < " + total);
                            client.sendMessage('6281235114745@c.us', "Update Data " + cursorNumber + " < " + total);
                        });
            
                      }, 2000);
      
                    } while (cursorNumber < total);
      
                    let dataCleaning = [];
      
                    for (let iv = 0; iv < newDataUsers.length; iv++) {
                      if (newDataUsers[iv] != '' || newDataUsers[iv] != null || newDataUsers[iv] != undefined) {
                        if (!dataCleaning.includes(newDataUsers[iv])) {
                          dataCleaning.push(newDataUsers[iv]);
                        }
                      }
                    }
      
                    console.log(clientName + ' Update Data');
                    
                    cursorNumber = 0;
                    total = 0;
      
                    await tiktokCommentsUsernameData[ii].delete();
                    await tiktokCommentsUsernameSheet.addRow(dataCleaning);
      
                    updateData++;
      
                  }
                }
                //Final Code
                if (!hasShortcode) {
                  //If Shortcode doesn't exist push new data
                  let cursorNumber = 0;
                  let newDataUsers = [todayItems[i]];
                  let total = 0;
      
                  do {
      
                    let responseComments = await tiktokCommentAPI(todayItems[i], cursorNumber);
                    let commentItems = await responseComments.data.comments;
      
                    for (let iii = 0; iii < commentItems.length; iii++) {
                      newDataUsers.push(commentItems[iii].user.unique_id);
                    }
      
                    setTimeout(() => {
                      console.log(cursorNumber + " < " + total);
                      client.sendMessage('6281235114745@c.us', cursorNumber + " < " + total);
                    }, 2000);
      
                    cursorNumber;
                    total;
                    total = await responseComments.data.total + 50;
                    cursorNumber = await responseComments.data.cursor;
                  } while (cursorNumber < total);
      
                  let dataCleaning = [];
      
                  for (let iv = 0; iv < newDataUsers.length; iv++) {
                    if (newDataUsers[iv] != '' || newDataUsers[iv] != null || newDataUsers[iv] != undefined) {
                      if (!dataCleaning.includes(newDataUsers[iv])) {
                        dataCleaning.push(newDataUsers[iv]);
                      }
                    }
                  }
                  console.log(clientName + ' Insert New Content Data');
                  await client.sendMessage('6281235114745@c.us', `${clientName} Inserting New Content Data`);
                  await tiktokCommentsUsernameSheet.addRow(dataCleaning);
                  newData++;
                }
            }

        }).catch(response => console.log(response));

        let responseData = {
          data: clientName + ' Succes Reload Comments Data : ' + todayItems.length + '\n\nNew Content : ' + newData + '\nUpdate Content : ' + updateData,
          state: true,
          code: 200
        };

        console.log(responseData.data);
        await client.sendMessage('6281235114745@c.us', responseData.data);
        tiktokOfficialDoc.delete;
        tiktokCommentsUsernameDoc.delete;
        return responseData;
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
    
    let responseData = {
      data: error,
      state: false,
      code: 303
    };
    
    console.log(responseData.data);
    await client.sendMessage('6281235114745@c.us', responseData.data);
    return responseData;
  }

}