/***********************
 * 
 * Adding Client User Data / Personil Data into User Sheet by 'RES' Type of Client
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
  //New Client Database by Organizations Source Functions
  newClientRes: async function newClientRes(clientName, sourceFile){
  
    try {
      //Insert New Sheet
      const sourceID = sourceFile.split('/').pop(); //Get Last Segment of Links    
      const userDoc = new GoogleSpreadsheet(ciceroKeys.dbKey.userDataID, googleAuth); //Google Auth

      const sourceDoc = new GoogleSpreadsheet(sourceID, googleAuth); //Google Auth
      await sourceDoc.loadInfo(); // loads document properties and worksheets

      const sourceSheet = sourceDoc.sheetsByTitle[clientName]; //Get Source Sheet Documents by Title
      const sourceRows = await sourceSheet.getRows(); //Get Sheet data By Rows
      
      await userDoc.loadInfo(); // loads document properties and worksheets
      const userSheet = userDoc.sheetsByTitle[clientName]; //Get Target Sheet Documents by Title

      var userData = [];

      for (let i = 0; i < sourceRows.length; i++){

        userData.push({ID_KEY: sourceRows[i].get('NRP'), NAMA: sourceRows[i].get('NAMA').replaceAll('CO3A', ','), TITLE: sourceRows[i].get('PANGKAT'), 
          DIVISI: sourceRows[i].get('SATFUNG'), JABATAN: sourceRows[i].get('JABATAN'), STATUS: true, WHATSAPP: sourceRows[i].get('WHATSAPP'), 
          INSTA: sourceRows[i].get('IG1'), TIKTOK: sourceRows[i].get('TIKTOK')});

      }

      await userSheet.addRows(userData);

      let responseData = {
        message : 'Adding '+clientName+ ' as Client, and post user data to DB Client',
        state : true,
        code : 200
      }
  
      userDoc.delete;
      sourceDoc.delete;

      return responseData;

    } catch (error) {

      console.log(error);
      
      let responseData = {
        message : 'Adding User Data List Error',
        state : false,
        code : 303
      }
  
      return responseData;
    
    }
  },
}