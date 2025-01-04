//Google Spreadsheet
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { tiktokPostAPI } from '../socialMediaAPI/tiktokAPI.js';
import { client } from '../../app.js';
import { ciceroKey, googleAuth } from '../database_query/sheetDoc.js';
import { getTiktokComments } from '../tiktok_scrapping/getTiktokComments.js';

export async function newCollectTiktokComments(clientValue) {
  //Date Time
  let d = new Date();
  let localDate = d.toLocaleDateString("en-US", {
      timeZone: "Asia/Jakarta"
  });   
  try {    

    const clientName = clientValue.get('CLIENT_ID');
    console.log(`${clientName} Collect Tiktok Data`);
    await client.sendMessage('6281235114745@c.us', `${clientName} Collect Tiktok Data`);

    if (clientValue.get('STATUS') === 'TRUE') {

      const secUid = await clientValue.get('SECUID');

      let cursor = 0;
      let responseContent = await tiktokPostAPI(secUid, cursor);
                
      let items = [];

      items = await responseContent.data.data.itemList;

      let hasContent = false;
      let itemByDay = [];
      let todayItems = [];

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

      if (hasContent) {

        const tiktokOfficialDoc = new GoogleSpreadsheet(ciceroKey.dbKey.tiktokOfficialID, googleAuth); //Google Authentication for InstaOfficial DB
        await tiktokOfficialDoc.loadInfo(); // loads document properties and worksheets    
        const officialTiktokSheet = tiktokOfficialDoc.sheetsByTitle[clientName];
        const officialTiktokData = await officialTiktokSheet.getRows();

        let shortcodeList = [];

        for (let i = 0; i < officialTiktokData.length; i++) {
          if (!shortcodeList.includes(officialTiktokData[i].get('SHORTCODE'))) {
            shortcodeList.push(officialTiktokData[i].get('SHORTCODE'));
          }
        }

        //Check if Database Contains Shortcode Items        
        let hasShortcode = false;
        for (let i = 0; i < itemByDay.length; i++) {
          if (shortcodeList.includes(itemByDay[i].video.id)) {
            hasShortcode = true;
          }
        }

        let shortcodeUpdateCounter = 0;
        let shortcodeNewCounter = 0;

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
        for (let i = 0; i < todayItems.length; i++) {

          await getTiktokComments(todayItems[i])

          .then (response =>{
            console.log(response);
          })
          
          .catch(response =>{
            console.error(response)
          });
        
        }
        

        officialTiktokSheet.delete;


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