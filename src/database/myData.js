const fs = require('fs');

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

  myData: async function myData(sheetName, idKey, filesID){
    //Auth Request to Files
    const targetDoc = new GoogleSpreadsheet(filesID, googleAuth);//Google Auth
    await targetDoc.loadInfo(); // loads document properties and worksheets

    try {
      //Data by Sheet Name
      const sheetTarget = targetDoc.sheetsByTitle[sheetName];
      const rowsData = await sheetTarget.getRows();
      
      let response= [];
      //Check if idKey Exist
      for (let i = 0; i < rowsData.length; i++){
        if (rowsData[i].get('ID_KEY') === idKey){
          response = rowsData[i];
        }
      }
      
      let responseData = {
        message : `*Profile Anda*\n\nUser :`+response.get('NAMA')+`\nID Key : `+response.get('ID_KEY')+`\nDivisi / Jabatan : `
        +response.get('DIVISI')+` / `+response.get('JABATAN')+`\nInsta : `+response.get('INSTA')+`\nTikTok : `+response.get('TIKTOK')
        +`\nStatus : `+response.get('STATUS'),
        state : true,
        code : 1
      }

      targetDoc.delete;
      return responseData;

    } catch (error) {

      let responseData = {
        message : error,
        state : false,
        code : 0
      }

      targetDoc.delete;
      return responseData;
    
    }
  },
}