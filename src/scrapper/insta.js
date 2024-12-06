const fs = require('fs');
const axios = require('axios');

//Google Spreadsheet
const { GoogleSpreadsheet } = require ('google-spreadsheet');
const { JWT } = require ('google-auth-library');

const googleCreds = JSON.parse (fs.readFileSync('ciceroKey.json'));

const googleAuth = new JWT({
  // env var values here are copied from service account credentials generated by google
  // see "Authentication" section in docs for more info
  email: googleCreds.client_email,
  key: googleCreds.private_key,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

module.exports = {
  reloadInsta: async function reloadInsta(sheetName, userClientID, clientID, instaOfficialID){

    const d = new Date();
    const localDate = d.toLocaleDateString('id');

    const userClientDoc = new GoogleSpreadsheet(userClientID, googleAuth);//Google Authentication for user client DB
    await userClientDoc.loadInfo(); // loads document properties and worksheets

    const clientDoc = new GoogleSpreadsheet(clientID, googleAuth);//Google Authentication for client DB
    await clientDoc.loadInfo(); // loads document properties and worksheets

    const instaOfficialDoc = new GoogleSpreadsheet(instaOfficialID, googleAuth);//Google Authentication for instaLikes DB
    await instaOfficialDoc.loadInfo(); // loads document properties and worksheets

    //Check Client_ID. then get async data
    let isClientID = false;
    let instaOfficial;
    let isStatus;
    
    let shortcodeUpdateCounter = 0;
    let shortcodeNewCounter = 0;

    const clientDataSheet = clientDoc.sheetsByTitle['ClientData'];
    const rowsClientData = await clientDataSheet.getRows();

    for (let i = 0; i < rowsClientData.length; i++){
      if (rowsClientData[i].get('CLIENT_ID') === sheetName){
        isClientID = true;
        instaOfficial = rowsClientData[i].get('INSTAGRAM');
        isStatus = rowsClientData[i].get('STATUS');
      }
    }

    // If Client_ID exist. then get official content
    if (isClientID && isStatus){    
      const options = {
        method: 'GET',
        url: 'https://instagram-scraper-api2.p.rapidapi.com/v1.2/posts',
        params: {
          username_or_id_or_url: instaOfficial
        },
        headers: {
          'x-rapidapi-key': 'f667627969msh3bfa806fa07f0c1p15c406jsn47bc847d28d2',
          'x-rapidapi-host': 'instagram-scraper-api2.p.rapidapi.com'
        }
      };
      
      try {
        
        const response = await axios.request(options);
        const items = response.data.data.items;
        let itemByDay = [];

        for (let i = 0; i < items.length; i++){

          let itemDate = new Date(items[i].taken_at*1000);
          if(itemDate.toLocaleDateString('id') === localDate){
            itemByDay.push(items[i]);
          }
        }
        
        let shortcodeList = [];

        const officialInstaSheet = instaOfficialDoc.sheetsByTitle[sheetName];
        const officialInstaData = await officialInstaSheet.getRows();
        for (let i = 0; i < officialInstaData.length; i++){
          if (!shortcodeList.includes(officialInstaData[i].get('SHORTCODE'))){
            shortcodeList.push(officialInstaData[i].get('SHORTCODE'));
          }
        }
        
        let isShortcode = false;
        //Add data to DB
        for (let i = 0; i < itemByDay.length; i++){
          if(shortcodeList.includes(itemByDay[i].code)){
            isShortcode = true;          
          }
        }

        //If Shortcode Exist
        if(isShortcode){
          for (let i = 0; i < itemByDay.length; i++){
            for (let ii = 0; ii < officialInstaData.length; ii++){
              if(officialInstaData[ii].get('SHORTCODE') === itemByDay[i].code){
                officialInstaData[ii].assign({TIMESTAMP: itemByDay[i].taken_at,	USER_ACCOUNT:itemByDay[i].owner.username,	SHORTCODE:itemByDay[i].code, ID: itemByDay[i].id, 
                  TYPE:itemByDay[i].media_name, CAPTION:itemByDay[i].caption.text,	COMMENT_COUNT:itemByDay[i].comment_count,	LIKE_COUNT:itemByDay[i].like_count,	
                  PLAY_COUNT:itemByDay[i].play_count, THUMBNAIL:itemByDay[i].thumbnail_url,	VIDEO_URL:itemByDay[i].video_url	}); // Jabatan Divisi Value
                  await officialInstaData[ii].save(); //save update

                shortcodeUpdateCounter++;
                console.log('Existing Content Updated');
              } else if(!shortcodeList.includes(itemByDay[i].code)){
                shortcodeList.push(itemByDay[i].code);
                officialInstaSheet.addRow({TIMESTAMP: itemByDay[i].taken_at,	USER_ACCOUNT:itemByDay[i].owner.username,	SHORTCODE:itemByDay[i].code, ID: itemByDay[i].id, TYPE:itemByDay[i].media_name, 	
                  CAPTION:itemByDay[i].caption.text,	COMMENT_COUNT:itemByDay[i].comment_count,	LIKE_COUNT:itemByDay[i].like_count,	PLAY_COUNT:itemByDay[i].play_count,
                  THUMBNAIL:itemByDay[i].thumbnail_url,	VIDEO_URL:itemByDay[i].video_url});
    
                shortcodeNewCounter++;
                console.log('New Content Added');    
              }
            }            
          }
        } else {
          //if Shortcode Doesn't exist
          for (let i = 0; i < itemByDay.length; i++){

            officialInstaSheet.addRow({TIMESTAMP: itemByDay[i].taken_at,	USER_ACCOUNT:itemByDay[i].owner.username,	SHORTCODE:itemByDay[i].code, ID: itemByDay[i].id, TYPE:itemByDay[i].media_name, 	
              CAPTION:itemByDay[i].caption.text,	COMMENT_COUNT:itemByDay[i].comment_count,	LIKE_COUNT:itemByDay[i].like_count,	PLAY_COUNT:itemByDay[i].play_count,
              THUMBNAIL:itemByDay[i].thumbnail_url,	VIDEO_URL:itemByDay[i].video_url});

            shortcodeNewCounter++;
            console.log('New Content Added');
          }
        }
      } catch (error) {
        console.error(error);
      }

      if(shortcodeNewCounter === 0 && shortcodeUpdateCounter === 0 ){
        return 'Reload Insta return with No Content to Update'
      } else if (shortcodeNewCounter != 0 && shortcodeUpdateCounter != 0 ){
        return 'Reload Insta return With '+shortcodeNewCounter+' New Content Added and '+shortcodeUpdateCounter+' Content Updated';
      } else if(shortcodeUpdateCounter != 0  ){
        return 'Reload Insta return With '+shortcodeUpdateCounter+' Content Updated';
      } else if(shortcodeNewCounter != 0 ){
        return 'Reload Insta return With '+shortcodeNewCounter+' New Content Added';
      }

    }  else {
      console.log('Contact Developers for Activate your Client ID');
    }
  },
}