const fs = require('fs');

const ciceroKeys = JSON.parse (fs.readFileSync('ciceroKey.json'));
const userDataBaseHeaders = require('./createClient/userHeaders');
const createClientID = require('./createClient/createClientID');
const instaOfficialHeaders = require('./createClient/instaOfficialHeaders');
const instaLikesHeaders = require('./createClient/instaLikesHeaders');
const tiktokOfficialHeaders = require('./createClient/tiktokOfficialHeaders');
const tiktokCommentsHeaders = require('./createClient/tiktokCommentsHeaders');




//Google Spreadsheet
const { GoogleSpreadsheet } = require ('google-spreadsheet');
const { JWT } = require ('google-auth-library');

const googleAuth = new JWT({
  // env var values here are copied from service account credentials generated by google
  // see "Authentication" section in docs for more info
  email: ciceroKeys.client_email,
  key: ciceroKeys.private_key,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});


module.exports = {
    //Add New Client to Database Client ID  
    createClient: async function createClient(clientName, type){
        let responseData =[];
        let response;

        //User Database Headers
        response = await userDataBaseHeaders.userDataBaseHeaders(clientName);
        responseData.push(response);

        //Create ClientID
        response = await createClientID.createClientID(clientName, type);
        responseData.push(response);

        //Create Insta Official Headers
        response = await instaOfficialHeaders.instaOfficialHeaders(clientName);
        responseData.push(response);

        //Create Insta Likes Headers
        response = await instaLikesHeaders.instaLikesHeaders(clientName);
        responseData.push(response);

        //Create Tiktok Official Headers
        response = await tiktokOfficialHeaders.tiktokOfficialHeaders(clientName);
        responseData.push(response);

        //Create Tiktok Comment Headers
        response = await tiktokCommentsHeaders.tiktokCommentsHeaders(clientName);
        responseData.push(response);

        return responseData;
    }
}