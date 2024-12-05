const fs = require('fs');

//Google Spreadsheet
const { GoogleSpreadsheet } = require ('google-spreadsheet');
const { JWT } = require ('google-auth-library');
const { response } = require('express');

const googleCreds = JSON.parse (fs.readFileSync('./database/ciceroKey.json'));

const googleAuth = new JWT({
  // env var values here are copied from service account credentials generated by google
  // see "Authentication" section in docs for more info
  email: googleCreds.client_email,
  key: googleCreds.private_key,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

module.exports = {

  myData: async function myData(sheetName, idKey, phone, filesID){

    const targetDoc = new GoogleSpreadsheet(filesID, googleAuth);//Google Auth
    await targetDoc.loadInfo(); // loads document properties and worksheets

    try {

      const sheetTarget = targetDoc.sheetsByTitle[sheetName];
      const rowsData = await sheetTarget.getRows();
      
      let response= [];

      for (let i = 0; i < rowsData.length; i++){
        if (rowsData[i].get('ID_KEY') === idKey){
          response = rowsData[i];
        }
      }

      let myDataReport = `*Profile Anda*\n\nUser :`+response.get('NAMA')+`\nID Key : `+response.get('ID_KEY')+`\nDivisi / Jabatan : `+response.get('DIVISI')+` / `+response.get('JABATAN')+`\nInsta : `+response.get('INSTA')+`\nTikTok : `+response.get('TIKTOK')+`\nStatus : `+response.get('STATUS');

      return myDataReport;

    } catch (error) {

      console.log(error);
      return 'error'; 
    
    }
  },

}