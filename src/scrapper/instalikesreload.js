const fs = require('fs');
const axios = require('axios');

//Google Spreadsheet
const { GoogleSpreadsheet } = require ('google-spreadsheet');
const { JWT } = require ('google-auth-library');

const googleCreds = JSON.parse (fs.readFileSync('ciceroKey.json'));
const instaKey = JSON.parse (fs.readFileSync('instaKey.json'));

const headers = {
  'x-cache-control': 'no-cache',
  'x-rapidapi-key': instaKey.instakeyAPI,
  'x-rapidapi-host': instaKey.instahostAPI
}

const googleAuth = new JWT({
  // env var values here are copied from service account credentials generated by google
  // see "Authentication" section in docs for more info
  email: googleCreds.client_email,
  key: googleCreds.private_key,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

async function instaPostAPI(key){
  //Insta Post API
  let options = {
    method: 'GET',
    url: instaKey.instahostContent,
    params: {
      username_or_id_or_url: key
    },
    headers: headers
  };

  try {
    let response = await axios.request(options);
    return response.data;
  } catch (error) {
    return 'error';
  }
}

async function instaLikesAPI(key){
  //Insta Likes API
  let options = {
    method: 'GET',
    url: instaKey.instahostLikes,
    params: {
      code_or_id_or_url: key
    },
    headers: headers
  };

  try {
    let response = await axios.request(options);
    return response.data;
  } catch (error) {
    return 'error';
  }
}

module.exports = {  

  reloadInstaLikes: async function reloadInstaLikes(sheetName, userClientID, clientID, instaOfficialID, instaLikesUsernameID){
    try {
  
      const d = new Date();
      const localDate = d.toLocaleDateString('id');
  
      const userClientDoc = new GoogleSpreadsheet(userClientID, googleAuth);//Google Authentication for user client DB
      await userClientDoc.loadInfo(); // loads document properties and worksheets
  
      const clientDoc = new GoogleSpreadsheet(clientID, googleAuth);//Google Authentication for client DB
      await clientDoc.loadInfo(); // loads document properties and worksheets
  
      const instaOfficialDoc = new GoogleSpreadsheet(instaOfficialID, googleAuth);//Google Authentication for InstaOfficial DB
      await instaOfficialDoc.loadInfo(); // loads document properties and worksheets
  
      const instaLikesUsernameDoc= new GoogleSpreadsheet(instaLikesUsernameID, googleAuth);//Google Authentication for instaLikes Username DB
        let isClientID = false;
      let instaOfficial;
      let isStatus;
      const clientDataSheet = clientDoc.sheetsByTitle['ClientData'];
      const rowsClientData = await clientDataSheet.getRows();

      for (let i = 0; i < rowsClientData.length; i++){
        
        if (rowsClientData[i].get('CLIENT_ID') === sheetName){
          isClientID = true;
          instaOfficial = rowsClientData[i].get('INSTAGRAM');
          isStatus = rowsClientData[i].get('STATUS');
        }
      }
  
      if (isClientID && isStatus){    
        //Collect Content Shortcode from Official Account
        let response = await instaPostAPI(instaOfficial);

        const items = response.data.items;

        let hasContent = false;
        let itemByDay = [];
        let todayItems = [];

        for (let i = 0; i < items.length; i++){

          let itemDate = new Date(items[i].taken_at*1000);
          
          if(itemDate.toLocaleDateString('id') === localDate){

            hasContent = true;
            itemByDay.push(items[i]);
            todayItems.push(items[i].code);

          }    
        }

        if(hasContent){
          const officialInstaSheet = instaOfficialDoc.sheetsByTitle[sheetName];
          const officialInstaData = await officialInstaSheet.getRows();
          
          let shortcodeList = [];

          for (let i = 0; i < officialInstaData.length; i++){
            if (!shortcodeList.includes(officialInstaData[i].get('SHORTCODE'))){
              shortcodeList.push(officialInstaData[i].get('SHORTCODE'));
            }
          }

          //Check if Database Contains Shortcode Items        
          let hasShortcode = false;
          for (let i = 0; i < itemByDay.length; i++){
            if(shortcodeList.includes(itemByDay[i].code)){
              hasShortcode = true;  
            }
          }

          let shortcodeUpdateCounter = 0;
          let shortcodeNewCounter = 0;

          //If Database Contains Shortcode 
          if(hasShortcode){
            for (let i = 0; i < itemByDay.length; i++){
              for (let ii = 0; ii < officialInstaData.length; ii++){
                if(officialInstaData[ii].get('SHORTCODE') === itemByDay[i].code){
                  //Update Existing Content Database                
                  officialInstaData[ii].assign({TIMESTAMP: itemByDay[i].taken_at,	USER_ACCOUNT:itemByDay[i].user.username,	SHORTCODE:itemByDay[i].code, ID: itemByDay[i].id, 
                    TYPE:itemByDay[i].media_name, CAPTION:itemByDay[i].caption.text,	COMMENT_COUNT:itemByDay[i].comment_count,	LIKE_COUNT:itemByDay[i].like_count,	
                    PLAY_COUNT:itemByDay[i].play_count, THUMBNAIL:itemByDay[i].thumbnail_url,	VIDEO_URL:itemByDay[i].video_url	}); // Jabatan Divisi Value
                    await officialInstaData[ii].save(); //save update
                  shortcodeUpdateCounter++;
                } else if(!shortcodeList.includes(itemByDay[i].code)){
                  //Push New Content to Database  
                  shortcodeList.push(itemByDay[i].code);
                  officialInstaSheet.addRow({TIMESTAMP: itemByDay[i].taken_at,	USER_ACCOUNT:itemByDay[i].user.username,	SHORTCODE:itemByDay[i].code, ID: itemByDay[i].id, TYPE:itemByDay[i].media_name, 	
                    CAPTION:itemByDay[i].caption.text,	COMMENT_COUNT:itemByDay[i].comment_count,	LIKE_COUNT:itemByDay[i].like_count,	PLAY_COUNT:itemByDay[i].play_count,
                    THUMBNAIL:itemByDay[i].thumbnail_url,	VIDEO_URL:itemByDay[i].video_url});  
                  shortcodeNewCounter++;
                }
              }            
            }
          } else {
            //Push New Shortcode Content to Database
            for (let i = 0; i < itemByDay.length; i++){
              officialInstaSheet.addRow({TIMESTAMP: itemByDay[i].taken_at,	USER_ACCOUNT:itemByDay[i].user.username,	SHORTCODE:itemByDay[i].code, ID: itemByDay[i].id, TYPE:itemByDay[i].media_name, 	
                CAPTION:itemByDay[i].caption.text,	COMMENT_COUNT:itemByDay[i].comment_count,	LIKE_COUNT:itemByDay[i].like_count,	PLAY_COUNT:itemByDay[i].play_count,
                THUMBNAIL:itemByDay[i].thumbnail_url,	VIDEO_URL:itemByDay[i].video_url});
              shortcodeNewCounter++;
            }
          }
  
          await instaLikesUsernameDoc.loadInfo(); // loads document properties and worksheets
          let instaLikesUsernameSheet = await instaLikesUsernameDoc.sheetsByTitle[sheetName];
          let instaLikesUsernameData = await instaLikesUsernameSheet.getRows();

          var newData = 0;
          var updateData = 0;
        
          for (let i = 0; i < todayItems.length; i++){
            let hasShortcode = false;
            //code on the go
            for (let ii = 0; ii < instaLikesUsernameData.length; ii++){
              if (instaLikesUsernameData[ii].get('SHORTCODE') === todayItems[i]){
                hasShortcode = true;
                updateData++;

                const fromRows = Object.values(instaLikesUsernameData[ii].toObject());
                const responseLikes = await instaLikesAPI(todayItems[i]);
                const likesItems = responseLikes.data.items;

                let newDataUsers = [];
              
                for (let iii = 0; iii < fromRows.length; iii++){
                  if(fromRows[iii] != undefined || fromRows[iii] != null || fromRows[iii] != ""){
                    if(!newDataUsers.includes(fromRows[iii])){
                      newDataUsers.push(fromRows[iii]);
                    }
                  }
                }

                for (let iii = 0; iii < likesItems.length; iii++){
                  if(likesItems[iii].username != undefined || likesItems[iii].username != null || likesItems[iii].username != ""){
                    if(!newDataUsers.includes(likesItems[iii].username)){
                      newDataUsers.push(likesItems[iii].username);
                    }
                  }
                }
                console.log('update data');
                await instaLikesUsernameData[ii].delete();
                await instaLikesUsernameSheet.addRow(newDataUsers);
              }
            }
            //Final Code
            if (!hasShortcode){
              //If Shortcode doesn't exist push new data
              let responseLikes = await instaLikesAPI(todayItems[i]);
                            
              let likesItems = responseLikes.data.items;
              let userNameList = [todayItems[i]];

              for (let iii = 0; iii < likesItems.length; iii++){
                if ('username' in likesItems[iii]){
                  userNameList.push(likesItems[iii].username);    
                }         
              }
              //Add new Row
              console.log('Insert new data');
              await instaLikesUsernameSheet.addRow(userNameList);
              newData++;
            }
          }

        return 'Succes Reload Data : '+todayItems.length+'\n\nNew Content : '+newData+'\nUpdate Content : '+updateData;
        } else { 
          return 'No Content';
        }
      }  else {
        return 'Your Client ID has Expired, Contacts Developers for more Informations';
      }
    } catch (error) {
      console.log(error);
    }     
  },
}