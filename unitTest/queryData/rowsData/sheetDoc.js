
//Google Spreadsheet
const { GoogleSpreadsheet } = require ('google-spreadsheet');
const { JWT } = require ('google-auth-library');

const fs = require('fs');
const ciceroKey = JSON.parse (fs.readFileSync('ciceroKey.json'));

const googleAuth = new JWT({
  // env var values here are copied from service account credentials generated by google
  // see "Authentication" section in docs for more info
  email: ciceroKey.client_email,
  key: ciceroKey.private_key,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

module.exports = {  

  sheetDoc: async function sheetDoc(sheetID, clientName) {

    try {

      const dataDoc = new GoogleSpreadsheet(sheetID, googleAuth);//Google Authentication for client DB
      
      await dataDoc.loadInfo(); // loads document properties and worksheets

      const sheetTitle = dataDoc.sheetsByTitle[clientName];
    
      let data = await sheetTitle.getRows();
      
      let response = {
        data : data,
        state : true,
        code : 200
      }

      dataDoc.delete;

      return response;
    
    } catch (err){
      let response = {
        data : data,
        state : true,
        code : 200
      }
      return response;      
    } 
  }
}