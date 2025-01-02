//Google Spreadsheet
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { instaLikesAPI, instaPostAPI } from '../socialMediaAPI/instaAPI.js';
import { client } from '../../app.js';
import { ciceroKey, googleAuth } from '../database_query/sheetDoc.js';

export const collectInstaLikes = async function colectInstaLikes(clientValue) {
  //Date Time
  const d = new Date();
  const localDate = d.toLocaleDateString("en-US", {
      timeZone: "Asia/Jakarta"
  });   
  try {
    const clientName = clientValue.get('CLIENT_ID');
    const instaAccount = clientValue.get('INSTAGRAM')

    console.log(clientName + " Collecting Insta Likes Starting...");
    await client.sendMessage('6281235114745@c.us', `${clientName} Collecting Insta Likes Starting...`);
    if (clientValue.get('STATUS') === 'TRUE') {

      console.log(`${clientName} Collecting Insta Data...`);
      await client.sendMessage('6281235114745@c.us', `${clientName} Collecting Insta Data...`);

      //Collect Content Shortcode from Official Account
      let hasContent = false;
      let itemByDay = [];
      let todayItems = [];
      let postItems = [];
      
      let instaPostAPIResponse = await instaPostAPI(instaAccount);

      console.log(`${clientName} Collecting Insta Post Data...`);
      await client.sendMessage('6281235114745@c.us', `${clientName} Collecting Insta Post Data...`);

      if (instaPostAPIResponse.state) {

        postItems = await instaPostAPIResponse.data.data.items;

        for (let i = 0; i < postItems.length; i++) {

          let itemDate = new Date(postItems[i].taken_at * 1000);
          if (itemDate.toLocaleDateString("en-US", {timeZone: "Asia/Jakarta"}) === localDate) {
            hasContent = true;
            itemByDay.push(postItems[i]);
            todayItems.push(postItems[i].code);
          }
        }

        if (hasContent) {
          const instaOfficialDoc = new GoogleSpreadsheet(ciceroKey.dbKey.instaOfficialID, googleAuth); //Google Authentication for InstaOfficial DB    
          await instaOfficialDoc.loadInfo(); // loads document properties and worksheets
          
          console.log(`${clientName} Official Account Has Post Data...`);
          await client.sendMessage('6281235114745@c.us', `${clientName} Official Account Has Post Data...`);

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
                  await officialInstaSheet.addRow({
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
              await officialInstaSheet.addRow({
                TIMESTAMP: itemByDay[i].taken_at, USER_ACCOUNT: itemByDay[i].user.username, SHORTCODE: itemByDay[i].code, ID: itemByDay[i].id, TYPE: itemByDay[i].media_name,
                CAPTION: itemByDay[i].caption.text, COMMENT_COUNT: itemByDay[i].comment_count, LIKE_COUNT: itemByDay[i].like_count, PLAY_COUNT: itemByDay[i].play_count,
                THUMBNAIL: itemByDay[i].thumbnail_url, VIDEO_URL: itemByDay[i].video_url
              });
              shortcodeNewCounter++;
            }
          }

          const instaLikesUsernameDoc = new GoogleSpreadsheet(ciceroKey.dbKey.instaLikesUsernameID, googleAuth); //Google Authentication for instaLikes Username DB
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

                console.log(`${clientName} Update Data ${todayItems[i]}`);
                await client.sendMessage('6281235114745@c.us', `${clientName} Update Data https://www.instagram.com/p/${todayItems[i]}`);
                
                updateData++;
              }
            }
            //Final Code
            if (!hasShortcode) {
              //If Shortcode doesn't exist push new data
              let responseLikes = await instaLikesAPI(todayItems[i]);

              let likesItems = await responseLikes.data.data.items;
              let userNameList = [todayItems[i]];

              for (let iii = 0; iii < likesItems.length; iii++) {
                if ('username' in likesItems[iii]) {
                  userNameList.push(likesItems[iii].username);
                }
              }
              //Add new Row
              
              await instaLikesUsernameSheet.addRow(userNameList);
              newData++;

              console.log(`${clientName} Insert New Data ${todayItems[i]}`);
              await client.sendMessage('6281235114745@c.us', `${clientName} Insert New Data https://www.instagram.com/p/${todayItems[i]}`);
            }
          }

          let responseData = {
            data: clientName + '\n\nSucces Reload Insta Data : ' + todayItems.length + '\n\nNew Content : ' + newData + '\nUpdate Content : ' + updateData,
            state: true,
            code: 200
          };

          console.log(responseData.data);
          await client.sendMessage('6281235114745@c.us', responseData.data);

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
          await client.sendMessage('6281235114745@c.us', responseData.data);
          return responseData;
        }

      } else {
        let responseData = {
          data: clientName + '\n\nInsta Post API Error',
          state: true,
          code: 201
        };
        console.log(responseData.data);
        await client.sendMessage('6281235114745@c.us',responseData.data);
        return responseData;
      }
    } else {

      let responseData = {
        data: clientName + '\n\nYour Client ID has Expired, Contacts Developers for more Informations',
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
    await client.sendMessage('6281235114745@c.us', `${clientName} Collecting Insta Error`);
    return responseData;
  }
};