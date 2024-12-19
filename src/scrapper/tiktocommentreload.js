//Google Spreadsheet
const { GoogleSpreadsheet } = require ('google-spreadsheet');
const { JWT } = require ('google-auth-library');

const fs = require('fs');
const axios = require('axios');

const googleCreds = JSON.parse (fs.readFileSync('ciceroKey.json'));

const headers = {
  'x-cache-control': 'no-cache',
  'x-rapidapi-key': googleCreds.tiktokKey.tiktokKey,
  'x-rapidapi-host': googleCreds.tiktokKey.tiktokHost
}
const googleAuth = new JWT({
  // env var values here are copied from service account credentials generated by google
  // see "Authentication" section in docs for more info
  email: googleCreds.client_email,
  key: googleCreds.private_key,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

async function tiktokUserInfoAPI(key){
  const options = {
    method: 'GET',
    url: googleCreds.tiktokKey.tiktokhostInfo,
    params: {
      uniqueId: key
    },
    headers: headers
  };
  
  try {
  
    const response = await axios.request(options);

    return response.data;
  
  } catch (error) {
    console.error(error);
  }
}

async function tiktokPostAPI(key, cursors){
//Tiktok Post API
  const options = {
    method: 'GET',
    url: googleCreds.tiktokKey.tiktokhostContent,
    params: {
      secUid: key,
      count: '50',
      cursor: cursors
    },
    headers : headers
  };

  try {
  
    const response = await axios.request(options);
    
    return response.data; 
  
  } catch (error) {
    console.error(error);
  }
}

async function tiktokCommentAPI(key, cursors){
  //Insta Likes API
  const options = {
    method: 'GET',
    url: googleCreds.tiktokKey.tiktokhostComments,
    params: {
      videoId: key,
      count: '50',
      cursor: cursors
    },
    headers: headers
  }
  
  try {
 
    const response = await axios.request(options);
  
    return response.data;
 
  } catch (error) {
    console.error(error);
  }
}

module.exports = {  

  reloadTiktokComments: async function reloadTiktokComments(sheetName, userClientID, clientID, tiktokOfficialID, tiktokCommentsUsernameID){
    
    const d = new Date();
    const localDate = d.toLocaleDateString('id');

    const userClientDoc = new GoogleSpreadsheet(userClientID, googleAuth);//Google Authentication for user client DB
    await userClientDoc.loadInfo(); // loads document properties and worksheets

    const clientDoc = new GoogleSpreadsheet(clientID, googleAuth);//Google Authentication for client DB
    await clientDoc.loadInfo(); // loads document properties and worksheets

    const tiktokOfficialDoc = new GoogleSpreadsheet(tiktokOfficialID, googleAuth);//Google Authentication for InstaOfficial DB
    await tiktokOfficialDoc.loadInfo(); // loads document properties and worksheets

    const tiktokCommentsUsernameDoc = new GoogleSpreadsheet(tiktokCommentsUsernameID, googleAuth);//Google Authentication for instaLikes Username DB
    await tiktokCommentsUsernameDoc.loadInfo(); // loads document properties and worksheets

    
    //Check Client_ID. then get async data
    let isClientID = false;
    let tiktokOfficial;
    let isStatus;
  
    const clientDataSheet = clientDoc.sheetsByTitle['ClientData'];
    const rowsClientData = await clientDataSheet.getRows();

    for (let i = 0; i < rowsClientData.length; i++){
      if (rowsClientData[i].get('CLIENT_ID') === sheetName){
        isClientID = true;
        tiktokOfficial = rowsClientData[i].get('TIKTOK');
        isStatus = rowsClientData[i].get('STATUS');
      }
    }

    // If Client_ID exist. then get official content
    if (isClientID && isStatus){    
      try {
        //Collect Content Shortcode from Official Account
        let responseInfo = await tiktokUserInfoAPI(tiktokOfficial.replaceAll('@',''));
        const secUid = responseInfo.userInfo.user.secUid;
        
        let cursor = 0;

        let responseContent = await tiktokPostAPI(secUid, cursor);
        let items =[];
      
        try{
          items = responseContent.data.itemList;
        } catch (e){
          items = responseContent.itemList;
        }

        let hasContent = false;
        let itemByDay = [];
        let todayItems = [];
        
        for (let i = 0; i < items.length; i++){
          let itemDate = new Date(items[i].createTime*1000);
          if(itemDate.toLocaleDateString('id') === localDate){
            hasContent = true;
            itemByDay.push(items[i]);
            todayItems.push(items[i].video.id);
          }
        }

        if(hasContent){
          const officialTiktokSheet = tiktokOfficialDoc.sheetsByTitle[sheetName];
          const officialTiktokData = await officialTiktokSheet.getRows();

          let shortcodeList = [];

          for (let i = 0; i < officialTiktokData.length; i++){
            if (!shortcodeList.includes(officialTiktokData[i].get('SHORTCODE'))){
              shortcodeList.push(officialTiktokData[i].get('SHORTCODE'));
            }
          }

          //Check if Database Contains Shortcode Items        
          let hasShortcode = false;
          for (let i = 0; i < itemByDay.length; i++){
            if(shortcodeList.includes(itemByDay[i].video.id)){
              hasShortcode = true;  
            }
          }

          let shortcodeUpdateCounter = 0;
          let shortcodeNewCounter = 0;

          //If Database Contains Shortcode 
          if(hasShortcode){
            for (let i = 0; i < itemByDay.length; i++){
              for (let ii = 0; ii < officialTiktokData.length; ii++){
                if(officialTiktokData[ii].get('SHORTCODE') === itemByDay[i].video.id){
                  //Update Existing Content Database                
                  officialTiktokData[ii].assign({TIMESTAMP: itemByDay[i].createTime,	USER_ACCOUNT:itemByDay[i].author.uniqueId,	
                    SHORTCODE:itemByDay[i].video.id, ID: itemByDay[i].id, CAPTION:itemByDay[i].desc,	COMMENT_COUNT:itemByDay[i].statsV2.commentCount,	
                    LIKE_COUNT:itemByDay[i].statsV2.diggCount,	PLAY_COUNT:itemByDay[i].statsV2.playCount, COLLECT_COUNT: itemByDay[i].statsV2.collectCount, 
                    SHARE_COUNT: itemByDay[i].statsV2.shareCount, REPOST_COUNT: itemByDay[i].statsV2.repostCount}); // Jabatan Divisi Value
                    await officialTiktokData[ii].save(); //save update
                  shortcodeUpdateCounter++;
                  
                } else if(!shortcodeList.includes(itemByDay[i].video.id)){
                  //Push New Content to Database  
                  shortcodeList.push(itemByDay[i].video.id);
                  officialTiktokSheet.addRow({TIMESTAMP: itemByDay[i].createTime,	USER_ACCOUNT:itemByDay[i].author.uniqueId,	
                    SHORTCODE:itemByDay[i].video.id, ID: itemByDay[i].id, CAPTION:itemByDay[i].desc,	COMMENT_COUNT:itemByDay[i].statsV2.commentCount,	
                    LIKE_COUNT:itemByDay[i].statsV2.diggCount,	PLAY_COUNT:itemByDay[i].statsV2.playCount, COLLECT_COUNT: itemByDay[i].statsV2.collectCount, 
                    SHARE_COUNT: itemByDay[i].statsV2.shareCount, REPOST_COUNT: itemByDay[i].statsV2.repostCount});  
                  shortcodeNewCounter++;
                }
              }            
            }
          } else {
            //Push New Shortcode Content to Database
            for (let i = 0; i < itemByDay.length; i++){
              officialTiktokSheet.addRow({TIMESTAMP: itemByDay[i].createTime,	USER_ACCOUNT:itemByDay[i].author.uniqueId,	
                SHORTCODE:itemByDay[i].video.id, ID: itemByDay[i].id, CAPTION:itemByDay[i].desc,	COMMENT_COUNT:itemByDay[i].statsV2.commentCount,	
                LIKE_COUNT:itemByDay[i].statsV2.diggCount,	PLAY_COUNT:itemByDay[i].statsV2.playCount, COLLECT_COUNT: itemByDay[i].statsV2.collectCount, 
                SHARE_COUNT: itemByDay[i].statsV2.shareCount, REPOST_COUNT: itemByDay[i].statsV2.repostCount});
              shortcodeNewCounter++;
            }
          }
        }

        await tiktokCommentsUsernameDoc.loadInfo();
        // loads document properties and worksheets
        let tiktokCommentsUsernameSheet = tiktokCommentsUsernameDoc.sheetsByTitle[sheetName];
        let tiktokCommentsUsernameData = await tiktokCommentsUsernameSheet.getRows();

        var newData = 0;
        var updateData = 0;

        for (let i = 0; i < todayItems.length; i++){
          let hasShortcode = false;
          //code on the go
          for (let ii = 0; ii < tiktokCommentsUsernameData.length; ii++){
            if (tiktokCommentsUsernameData[ii].get('SHORTCODE') === todayItems[i]){
            
              hasShortcode = true;
              const fromRows = Object.values(tiktokCommentsUsernameData[ii].toObject());

              let cursorNumber = 0;
              let newDataUsers = [];
              let checkNext = 0;

              for (let iii = 0; iii < fromRows.length; iii++){
                if(fromRows[iii] != undefined || fromRows[iii] != null || fromRows[iii] != ""){
                  if(!newDataUsers.includes(fromRows[iii])){
                    newDataUsers.push(fromRows[iii]);
                  }
                }
              }

              do  { 
                let responseComments = await tiktokCommentAPI(todayItems[i], cursorNumber);
                let commentItems = responseComments.comments;       

                for (let iii = 0; iii < commentItems.length; iii++){
                  if(commentItems[iii].user.unique_id != undefined || commentItems[iii].user.unique_id != null || commentItems[iii].user.unique_id != ""){
                    if(!newDataUsers.includes(commentItems[iii].user.unique_id)){
                      newDataUsers.push(commentItems[iii].user.unique_id);
                    }
                  }
                }
            
                cursorNumber = responseComments.cursor;
                checkNext = responseComments.has_more;
                
                setTimeout(() => {
                  console.log(checkNext);
                }, 1200);
              } while ( checkNext === 1);

              let dataCleaning = [];

              for(let iv = 0; iv < newDataUsers.length; iv++){
                if (newDataUsers[iv] != '' || newDataUsers[iv] != null || newDataUsers[iv] != undefined){
                  if (!dataCleaning.includes(newDataUsers[iv])){
                    dataCleaning.push(newDataUsers[iv]);
                  }
                }
              }

              console.log(sheetName+' Update Data');
            
              await tiktokCommentsUsernameData[ii].delete();
              await tiktokCommentsUsernameSheet.addRow(dataCleaning);

              updateData++;
            
            }
          }
          //Final Code
          if(!hasShortcode){
            //If Shortcode doesn't exist push new data

            let cursorNumber = 0;
            let newDataUsers = [todayItems[i]];
            let checkNext = 0;

            
            
            do {
            
              let responseComments = await tiktokCommentAPI(todayItems[i], cursorNumber);
              let commentItems = responseComments.comments;

              for (let iii = 0; iii < commentItems.length; iii++){
                newDataUsers.push(commentItems[iii].user.unique_id);             
              }
              //Add new Row
              cursorNumber = responseComments.cursor
              checkNext = responseComments.has_more;
              setTimeout(() => {
                console.log(checkNext);
              }, 1200);
            } while (checkNext === 1);

            let dataCleaning = [];

            for(let iv = 0; iv < newDataUsers.length; iv++){
              if (newDataUsers[iv] != '' || newDataUsers[iv] != null || newDataUsers[iv] != undefined){
                if (!dataCleaning.includes(newDataUsers[iv])){
                  dataCleaning.push(newDataUsers[iv]);
                }
              }
            }

            console.log(sheetName+' Insert new data');
            await tiktokCommentsUsernameSheet.addRow(dataCleaning);


            newData++;
          }
        }
      
        let responseData = {
          message : sheetName+' Succes Reload Comments Data : '+todayItems.length+'\n\nNew Content : '+newData+'\nUpdate Content : '+updateData,
          state : true,
          code : 1
        }

        userClientDoc.delete;
        clientDoc.delete;
        tiktokOfficialDoc.delete;
        tiktokCommentsUsernameDoc.delete;
        
        return responseData; 
      
      } catch (error) {

        let responseData = {
          message : error,
          state : false,
          code : 0
        }
        userClientDoc.delete;
        clientDoc.delete;
        tiktokOfficialDoc.delete;
        tiktokCommentsUsernameDoc.delete;
        return responseData;           
      }
    }  else {
      let responseData = {
        message : 'Your Client ID has Expired, Contacts Developers for more Informations',
        state : true,
        code : 1
      }
      userClientDoc.delete;
      clientDoc.delete;
      tiktokOfficialDoc.delete;
      tiktokCommentsUsernameDoc.delete;
      return responseData;      
    }     
  },
}