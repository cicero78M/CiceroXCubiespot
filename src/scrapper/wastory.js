const fs = require('fs');

//Google Spreadsheet
const { GoogleSpreadsheet } = require ('google-spreadsheet');
const { JWT } = require ('google-auth-library');

const googleCreds = JSON.parse (fs.readFileSync('ciceroKey.json'));
const instaKey = JSON.parse (fs.readFileSync('instaKey.json'));


const googleAuth = new JWT({
  // env var values here are copied from service account credentials generated by google
  // see "Authentication" section in docs for more info
  email: googleCreds.client_email,
  key: googleCreds.private_key,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const headers = {
  'x-cache-control': 'no-cache',
  'x-rapidapi-key': instaKey.instakeyAPI,
  'x-rapidapi-host': instaKey.instahostAPI
}

async function instaPostInfoAPI(key){
  //Insta Post API
  let options = {
    method: 'GET',
    url: instaKey.instapostInfo,
    params: {
      code_or_id_or_url: key,
      include_insights: 'true'    },
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

  waStoryInsta: async function waStoryInsta(whatsapp, instalink, userClientID, clientID, waStoryID){

    const userClientDoc = new GoogleSpreadsheet(userClientID, googleAuth);//Google Authentication for user client DB
    await userClientDoc.loadInfo(); // loads document properties and worksheets

    const clientDoc = new GoogleSpreadsheet(clientID, googleAuth);//Google Authentication for client DB
    await clientDoc.loadInfo(); // loads document properties and worksheets

    const waStoryDoc = new GoogleSpreadsheet(waStoryID, googleAuth);//Google Authentication for client DB
    await waStoryDoc.loadInfo(); // loads document properties and worksheets

    if(instalink.includes('instagram.com')){
        let insta = instalink.pop().split('?')[0];
        let shortcode = insta.split('/');

        let instaPost = await instaPostInfoAPI(shortcode.pop());

        let instaOfficial = instaPost.data.user.username;

        const clientDataSheet = clientDoc.sheetsByTitle['ClientData'];
        const rowsClientData = await clientDataSheet.getRows();
        let hasSheetName = false;
        let sheetName;
        for (let i = 0; i < rowsClientData.length; i++){
          if (rowsClientData[i].get('INSTAGRAM') === instaOfficial){
            hasSheetName = true;
            sheetName = rowsClientData[i].get('CLIENT_ID');
          }
        }

        if(hasSheetName){

          let userClientSheet = await userClientDoc.sheetsByTitle[sheetName];
          let userClientData = await userClientSheet.getRows();

          let hasUser = false;
          let userData = [];
          for (let i = 0; i < userClientData.length; i++){
            if(userClientData[i].get('WHATSAPP') === whatsapp){
              hasUser = true;
              userData.push(userClientData[i]);
            }
          }
          if(hasUser){
            return 'Thank you, your number exist';
          } else {
            return 'Number not recorded';
          }

        }



    }//if(url.includes...
  }//waStoryInsta....
}//module export....