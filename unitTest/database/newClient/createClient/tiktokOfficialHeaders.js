/*******************************************************************************
 * 
 * This Function Create a new Tiktok Official Data Sheet and Properties / Headers.
 * As a Child of Create Client Function
 * 
 */

const fs = require('fs');

const ciceroKeys = JSON.parse (fs.readFileSync('ciceroKey.json'));

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
    tiktokOfficialHeaders: async function tiktokOfficialHeaders(clientName){
        let response;

        //Tiktok Official DataBase Headers
        try {
            const tiktokOfficialDoc = new GoogleSpreadsheet(ciceroKeys.dbKey.tiktokOfficialID, googleAuth);//Google Authentication for InstaOfficial DB
            
            await tiktokOfficialDoc.loadInfo(); // loads document properties and worksheets
            let tiktokOfficialHeadersSheet = await tiktokOfficialDoc.addSheet({title : clientName, headerValues: ['TIMESTAMP', 'USER_ACCOUNT'	, 'ID'	, 'COMMENT_COUNT',
                'LIKE_COUNT', 'PLAY_COUNT', 'SHARE_COUNT', 'REPOST_COUNT']});
    
            response = {
                data: 'Create Tiktok Official Data Sheet '+tiktokOfficialHeadersSheet.title,
                state : true,
                code : 200
            }
        
            return response;
    
        } catch (error) {

            console.log(error);
            
            response = {
                data: 'Error Create Tiktok Official Data Sheet',
                state : false,
                code : 303
            }

            return response;
        
        }  
    }
}