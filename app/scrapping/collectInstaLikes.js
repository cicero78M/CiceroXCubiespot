//Google Spreadsheet
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

import { readFileSync } from 'fs';
const ciceroKey = JSON.parse (readFileSync('ciceroKey.json'));

import { instaPostAPI, instaLikesAPI } from '../socialMediaAPI/instaAPI.js';
import { clientData } from '../database_query/clientData.js';


const d = new Date();
const localDate = d.toLocaleDateString('id');

const googleAuth = new JWT({
  // env var values here are copied from service account credentials generated by google
  // see "Authentication" section in docs for more info
  email: ciceroKey.client_email,
  key: ciceroKey.private_key,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

export const collectInstaLikes = async function colectInstaLikes(clientName) {
  console.log(clientName + " Collecting Insta Likes Starting...");

  try {

    const instaOfficialDoc = new GoogleSpreadsheet(ciceroKey.dbKey.instaOfficialID, googleAuth); //Google Authentication for InstaOfficial DB
    const instaLikesUsernameDoc = new GoogleSpreadsheet(ciceroKey.dbKey.instaLikesUsernameID, googleAuth); //Google Authentication for instaLikes Username DB

    clientData(clientName).then(async (responseClient) => {
      if (responseClient.data.isClientID && responseClient.data.isStatus === 'TRUE') {
      
        console.log(clientName+' Insta Post Loaded...');
        
        //Collect Content Shortcode from Official Account
        let hasContent = false;
        let itemByDay = [];
        let todayItems = [];
        let postItems = [];
        
        instaPostAPI(responseClient.data.instaAccount).then(async (instaPostAPIResponse) => {

          
          if (instaPostAPIResponse.state) {
    
            postItems = await instaPostAPIResponse.data.data.items;
    
            for (let i = 0; i < postItems.length; i++) {
              console.log(postItems[i]);
              let itemDate = new Date(postItems[i].taken_at * 1000);
    
              if (itemDate.toLocaleDateString('id') === localDate) {
                hasContent = true;
                itemByDay.push(postItems[i]);
                todayItems.push(postItems[i].code);
              }
            }
    
            if (hasContent) {
    
              console.log(clientName + " Insta Official Account Has Content");
    
              await instaOfficialDoc.loadInfo(); // loads document properties and worksheets
              const officialInstaSheet = instaOfficialDoc.sheetsByTitle[clientName];
              const officialInstaData = await officialInstaSheet.getRows();
    
              let shortcodeList = [];
    
              for (let i = 0; i < officialInstaData.length; i++) {
                if (!shortcodeList.includes(officialInstaData[i].get('SHORTCODE'))) {
                  shortcodeList.push(officialInstaData[i].get('SHORTCODE'));
                }
              }
    
              //Check if Database Contains Shortcode Items        
              let hasShortcode = false;
              for (let i = 0; i < itemByDay.length; i++) {
                if (shortcodeList.includes(itemByDay[i].code)) {
                  hasShortcode = true;
                }
              }
    
              let shortcodeUpdateCounter = 0;
              let shortcodeNewCounter = 0;
    
              //If Database Contains Shortcode 
              if (hasShortcode) {
    
                for (let i = 0; i < itemByDay.length; i++) {
                  for (let ii = 0; ii < officialInstaData.length; ii++) {
                    if (officialInstaData[ii].get('SHORTCODE') === itemByDay[i].code) {
                      //Update Existing Content Database                
                      officialInstaData[ii].assign({
                        TIMESTAMP: itemByDay[i].taken_at, USER_ACCOUNT: itemByDay[i].user.username, SHORTCODE: itemByDay[i].code, ID: itemByDay[i].id,
                        TYPE: itemByDay[i].media_name, CAPTION: itemByDay[i].caption.text, COMMENT_COUNT: itemByDay[i].comment_count, LIKE_COUNT: itemByDay[i].like_count,
                        PLAY_COUNT: itemByDay[i].play_count
                      }); // Jabatan Divisi Value
                      await officialInstaData[ii].save(); //save update
                      shortcodeUpdateCounter++;
                    } else if (!shortcodeList.includes(itemByDay[i].code)) {
                      //Push New Content to Database  
                      shortcodeList.push(itemByDay[i].code);
                      officialInstaSheet.addRow({
                        TIMESTAMP: itemByDay[i].taken_at, USER_ACCOUNT: itemByDay[i].user.username, SHORTCODE: itemByDay[i].code, ID: itemByDay[i].id, TYPE: itemByDay[i].media_name,
                        CAPTION: itemByDay[i].caption.text, COMMENT_COUNT: itemByDay[i].comment_count, LIKE_COUNT: itemByDay[i].like_count, PLAY_COUNT: itemByDay[i].play_count
                      });
                      shortcodeNewCounter++;
                    }
                  }
                }
              } else {
                //Push New Shortcode Content to Database
                for (let i = 0; i < itemByDay.length; i++) {
                  officialInstaSheet.addRow({
                    TIMESTAMP: itemByDay[i].taken_at, USER_ACCOUNT: itemByDay[i].user.username, SHORTCODE: itemByDay[i].code, ID: itemByDay[i].id, TYPE: itemByDay[i].media_name,
                    CAPTION: itemByDay[i].caption.text, COMMENT_COUNT: itemByDay[i].comment_count, LIKE_COUNT: itemByDay[i].like_count, PLAY_COUNT: itemByDay[i].play_count,
                    THUMBNAIL: itemByDay[i].thumbnail_url, VIDEO_URL: itemByDay[i].video_url
                  });
                  shortcodeNewCounter++;
                }
              }
    
              await instaLikesUsernameDoc.loadInfo(); // loads document properties and worksheets
    
              let instaLikesUsernameSheet = instaLikesUsernameDoc.sheetsByTitle[clientName];
              let instaLikesUsernameData = await instaLikesUsernameSheet.getRows();
    
              var newData = 0;
              var updateData = 0;
    
              for (let i = 0; i < todayItems.length; i++) {
                let hasShortcode = false;
                //code on the go
                for (let ii = 0; ii < instaLikesUsernameData.length; ii++) {
                  if (instaLikesUsernameData[ii].get('SHORTCODE') === todayItems[i]) {
                    hasShortcode = true;
    
                    const fromRows = Object.values(instaLikesUsernameData[ii].toObject());
    
                    const responseLikes = await instaLikesAPI(todayItems[i]);
                    const likesItems = await responseLikes.data.data.items;
    
                    let newDataUsers = [];
    
                    for (let iii = 0; iii < fromRows.length; iii++) {
                      if (fromRows[iii] != undefined || fromRows[iii] != null || fromRows[iii] != "") {
                        if (!newDataUsers.includes(fromRows[iii])) {
                          newDataUsers.push(fromRows[iii]);
                        }
                      }
                    }
    
                    for (let iii = 0; iii < likesItems.length; iii++) {
                      if (likesItems[iii].username != undefined || likesItems[iii].username != null || likesItems[iii].username != "") {
                        if (!newDataUsers.includes(likesItems[iii].username)) {
                          newDataUsers.push(likesItems[iii].username);
                        }
                      }
                    }
    
                    await instaLikesUsernameData[ii].delete();
                    await instaLikesUsernameSheet.addRow(newDataUsers);
                    console.log(clientName + ' Update data ' + todayItems[i]);
                    updateData++;
    
                  }
                }
                //Final Code
                if (!hasShortcode) {
    
                  console.log(clientName+' Has No Content');
                  //If Shortcode doesn't exist push new data
                  let responseLikes = await instaLikesAPI(todayItems[i]);
    
                  let likesItems = responseLikes.data.data.items;
                  let userNameList = [todayItems[i]];
    
                  for (let iii = 0; iii < likesItems.length; iii++) {
                    if ('username' in likesItems[iii]) {
                      userNameList.push(likesItems[iii].username);
                    }
                  }
                  //Add new Row
                  
                  await instaLikesUsernameSheet.addRow(userNameList);
                  newData++;
                  console.log(clientName + 'Insert new data ' + todayItems[i]);
    
                }
              }
    
              let responseData = {
                data: clientName + '\n\nSucces Reload Insta Data : ' + todayItems.length + '\n\nNew Content : ' + newData + '\nUpdate Content : ' + updateData,
                state: true,
                code: 200
              };
              console.log(responseData.data);
              instaOfficialDoc.delete;
              instaLikesUsernameDoc.delete;
              return responseData;
    
            } else {
              
              let responseData = {
                data: clientName + '\n\nHas No Insta Content',
                state: true,
                code: 201
              };
              console.log(responseData.data);
    
              instaOfficialDoc.delete;
              instaLikesUsernameDoc.delete;
              return responseData;
            }
    
          } else {
            let responseData = {
              data: clientName + '\n\nInsta Post API Error',
              state: true,
              code: 201
            };
            console.log(responseData.data);
            instaOfficialDoc.delete;
            instaLikesUsernameDoc.delete;
            return responseData;
          }
          
        });
  
      } else {
        let responseData = {
          data: clientName + '\n\nYour Client ID has Expired, Contacts Developers for more Informations',
          state: true,
          code: 201
        };
        console.log(responseData.data);
        instaOfficialDoc.delete;
        instaLikesUsernameDoc.delete;
        return responseData;
      }
    });



  } catch (error) {
    let responseData = {
      data: error,
      state: false,
      code: 303
    };
    console.log(responseData.data);
    return responseData;
  }
};