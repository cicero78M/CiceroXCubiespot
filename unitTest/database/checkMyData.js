const fs = require('fs');
const sheetDoc = require('../queryData/sheetDoc');

const ciceroKey = JSON.parse (fs.readFileSync('ciceroKey.json'));

module.exports = {

  checkMyData: async function checkMyData(clientName, idKey){
    //Auth Request to Files


    try {
       //Data by Sheet Name
      let responseUser = await sheetDoc.sheetDoc(ciceroKey.dbKey.userDataID, clientName );
      let userRows = responseUser.data;

      isUserExist = false;  
      let response= [];
      //Check if idKey Exist
      for (let i = 0; i < userRows.length; i++){
        if (userRows[i].get('ID_KEY') === idKey){

          isUserExist = true
          response = userRows[i];

          let responseData = {
            data : `*Profile Anda*\n\nUser : `+response.get('NAMA')+`\nID Key : `+response.get('ID_KEY')+`\nDivisi / Jabatan : `
            +response.get('DIVISI')+` / `+response.get('JABATAN')+`\nInsta : `+response.get('INSTA')+`\nTikTok : `+response.get('TIKTOK')
            +`\nStatus : `+response.get('STATUS'),
            state : true,
            code : 200
          }
              
          return responseData;

        }
      }

      if (!isUserExist){

        let responseData = {
          data : "ID KEY HAVE NO RECORD",
          state : true,
          code : 200
        }
        
        console.log('Return Success');
  
        return responseData;

      }

    
    } catch (error) {
      let responseData = {
        data : error,
        state : false,
        code : 303
      }
      console.log('Return Success');
      return responseData;
    }
  },
}