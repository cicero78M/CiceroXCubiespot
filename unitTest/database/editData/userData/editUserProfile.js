const fs = require('fs');

//Google Spreadsheet
const { GoogleSpreadsheet } = require ('google-spreadsheet');
const { JWT } = require ('google-auth-library');
const checkMyData = require('../../checkMyData');

const ciceroKey = JSON.parse (fs.readFileSync('ciceroKey.json'));

const googleAuth = new JWT({
  // env var values here are copied from service account credentials generated by google
  // see "Authentication" section in docs for more info
  email: ciceroKey.client_email,
  key: ciceroKey.private_key,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

module.exports = {

//Edit User Divisi to User Data Base   
  editProfile: async function editProfile(clientName, idKey, newData, phone, type){

    const userDoc = new GoogleSpreadsheet(ciceroKey.dbKey.userDataID, googleAuth);//Google Auth
    try {
      //Insert New Sheet
      await userDoc.loadInfo(); // loads document properties and worksheets
      const userSheet = userDoc.sheetsByTitle[clientName];

      const userRows = await userSheet.getRows();

      let isDataExist = false;
      let dataList = [];
  
      //Collect Divisi List String
      for (let i = 0; i < userRows.length; i++){
        if(!dataList.includes(userRows[i].get(type))){
          dataList.push(userRows[i].get(type));
        }
      }

      for (let ii = 0; ii < userRows.length; ii++){
        if (userRows[ii].get('ID_KEY') === idKey){
                  
          if(userRows[ii].get('WHATSAPP') === "" || userRows[ii].get('WHATSAPP') === phone || userRows[ii].get('WHATSAPP') === "6281235114745"){

            isDataExist = true;

            if (type === 'DIVISI'){
              if (dataList.includes(newData)){
  
                userRows[ii].assign({DIVISI: newData, WHATSAPP: phone});; // Update Divisi Value
  
              } else {
  
                let responseData = {
                  data : 'Divisi Unregsitered',
                  state : true,
                  code : 200
                }
        
                console.log('Return Success');
        
                userDoc.delete;
  
                return responseData;
              }
  
  
            } else if (type === 'JABATAN') {
              userRows[ii].assign({JABATAN: newData, WHATSAPP: phone});// Update Divisi Value
            } else if (type === 'NAMA') {
              userRows[ii].assign({NAMA: newData, WHATSAPP: phone}); // Update Divisi Value
            } else if (type === 'ID_KEY') {
              userRows[ii].assign({ID_KEY: newData.toLowerCase(), WHATSAPP: phone}); // Update Divisi Value
            } else if (type === 'TITLE') {
  
              if (dataList.includes(newData)){
  
                userRows[ii].assign({TITLE: newData, WHATSAPP: phone});// Update Divisi Value
  
              } else {
  
                let responseData = {
                  data : 'Title Unregsitered',
                  state : true,
                  code : 200
                }
        
                console.log('Return Success');
        
                userDoc.delete;
  
                return responseData;
              }
  
            } else if (type === 'STATUS') {
              userRows[ii].assign({STATUS: newData, WHATSAPP: phone});// Update Divisi Value
            }
  
            await userRows[ii].save(); //save update
      
          } else {
            let responseData = {
              data : 'Ubah data dengan menggunakan Nomor Whatsapp terdaftar',
              state : true,
              code : 200
            }
            console.log('Return Success');
            userDoc.delete;
            return responseData;
          }         
        } 
      }

      if(!isDataExist){
              
        let responseData = {
          data : 'User Data with delegated ID_KEY Doesn\'t Exist',
          state : true,
          code : 200
        }

        console.log('Return Success');
        userDoc.delete;
        return responseData;
     
      } else {

        let responseMyData = await checkMyData.checkMyData(clientName, idKey);
        userDoc.delete;
        return responseMyData;
      
      }

    } catch (error) {

      let responseData = {
        data : error,
        state : false,
        code : 303
      }

      console.log('Return Success');
      userDoc.delete;
      return responseData;
    
    }
  },
}