//Google Spreadsheet
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

import { readFileSync } from 'fs';

import { tiktokUserInfoAPI, tiktokPostAPI, tiktokCommentAPI } from '../../SocialMediaAPI/tiktokAPI.js';
import { sheetDoc as _sheetDoc } from '../../queryData/sheetDoc.js';

const ciceroKey = JSON.parse (readFileSync('ciceroKey.json'));

const googleAuth = new JWT({
  // env var values here are copied from service account credentials generated by google
  // see "Authentication" section in docs for more info
  email: ciceroKey.client_email,
  key: ciceroKey.private_key,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

export async function collectTiktokComments(clientName) {

  const d = new Date();
  const localDate = d.toLocaleDateString('id');

  const tiktokOfficialDoc = new GoogleSpreadsheet(ciceroKey.dbKey.tiktokOfficialID, googleAuth); //Google Authentication for InstaOfficial DB
  await tiktokOfficialDoc.loadInfo(); // loads document properties and worksheets

  const tiktokCommentsUsernameDoc = new GoogleSpreadsheet(ciceroKey.dbKey.tiktokCommentUsernameID, googleAuth); //Google Authentication for instaLikes Username DB
  await tiktokCommentsUsernameDoc.loadInfo(); // loads document properties and worksheets


  //Check Client_ID. then get async data
  let isClientID = false;
  let tiktokOfficial;
  let isStatus;

  let response = await _sheetDoc(ciceroKey.dbKey.clientDataID, 'ClientData');

  if (response.state) {
    let clientRows = response.data;
    for (let i = 0; i < clientRows.length; i++) {
      if (clientRows[i].get('CLIENT_ID') === clientName) {
        isClientID = true;
        tiktokOfficial = clientRows[i].get('TIKTOK');
        isStatus = clientRows[i].get('STATUS');
      }
    }
  }

  // If Client_ID exist. then get official content
  if (isClientID && isStatus) {
    try {
      //Collect Content Shortcode from Official Account
      let responseInfo = await tiktokUserInfoAPI(tiktokOfficial.replaceAll('@', ''));
      const secUid = responseInfo.data.userInfo.user.secUid;

      let cursor = 0;

      let responseContent = await tiktokPostAPI(secUid, cursor);
      let items = [];

      try {
        items = await responseContent.data.data.itemList;
      } catch (e) {
        items = await responseContent.data.itemList;
      }

      let hasContent = false;
      let itemByDay = [];
      let todayItems = [];

      if (Array.isArray(items)) {
        for (let i = 0; i < items.length; i++) {
          let itemDate = new Date(items[i].createTime * 1000);
          if (itemDate.toLocaleDateString('id') === localDate) {
            hasContent = true;
            itemByDay.push(items[i]);
            todayItems.push(items[i].video.id);
          }
        }
      }

      if (hasContent) {

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

        await tiktokCommentsUsernameDoc.loadInfo();
        // loads document properties and worksheets
        let tiktokCommentsUsernameSheet = tiktokCommentsUsernameDoc.sheetsByTitle[clientName];
        let tiktokCommentsUsernameData = await tiktokCommentsUsernameSheet.getRows();

        var newData = 0;
        var updateData = 0;

        for (let i = 0; i < todayItems.length; i++) {

          let hasShortcode = false;


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

              let cursorNumber = 0;
              let total = 0;

              do {

                let responseComments = await tiktokCommentAPI(todayItems[i], cursorNumber);


                let commentItems = responseComments.data.comments;

                for (let iii = 0; iii < commentItems.length; iii++) {
                  if (commentItems[iii].user.unique_id != undefined || commentItems[iii].user.unique_id != null || commentItems[iii].user.unique_id != "") {
                    if (!newDataUsers.includes(commentItems[iii].user.unique_id)) {
                      newDataUsers.push(commentItems[iii].user.unique_id);
                    }
                  }
                }

                setTimeout(() => {
                  console.log("Update Data " + cursorNumber + " < " + total);
                }, 2200);

                cursorNumber;
                total;

                total = responseComments.data.total + 50;
                cursorNumber = responseComments.data.cursor;

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


              let commentItems = responseComments.data.comments;

              for (let iii = 0; iii < commentItems.length; iii++) {
                newDataUsers.push(commentItems[iii].user.unique_id);
              }

              setTimeout(() => {
                console.log(cursorNumber + " < " + total);
              }, 2200);

              cursorNumber;
              total;

              total = responseComments.data.total + 50;

              cursorNumber = responseComments.data.cursor;

            } while (cursorNumber < total);

            let dataCleaning = [];

            for (let iv = 0; iv < newDataUsers.length; iv++) {
              if (newDataUsers[iv] != '' || newDataUsers[iv] != null || newDataUsers[iv] != undefined) {
                if (!dataCleaning.includes(newDataUsers[iv])) {
                  dataCleaning.push(newDataUsers[iv]);
                }
              }
            }

            console.log(clientName + ' Insert new data');
            await tiktokCommentsUsernameSheet.addRow(dataCleaning);

            newData++;
          }
        }

        let responseData = {
          data: clientName + ' Succes Reload Comments Data : ' + todayItems.length + '\n\nNew Content : ' + newData + '\nUpdate Content : ' + updateData,
          state: true,
          code: 200
        };

        tiktokOfficialDoc.delete;
        tiktokCommentsUsernameDoc.delete;

        return responseData;
      } else {
        let responseData = {
          data: clientName + ' Tiktok Account Has No Content',
          state: true,
          code: 200
        };
        tiktokOfficialDoc.delete;
        tiktokCommentsUsernameDoc.delete;
        return responseData;
      }

    } catch (error) {

      let responseData = {
        data: error,
        state: false,
        code: 303
      };
      tiktokOfficialDoc.delete;
      tiktokCommentsUsernameDoc.delete;
      return responseData;
    }
  } else {

    let responseData = {
      data: 'Your Client ID has Expired, Contacts Developers for more Informations',
      state: true,
      code: 200
    };

    tiktokOfficialDoc.delete;
    tiktokCommentsUsernameDoc.delete;

    return responseData;

  }
}