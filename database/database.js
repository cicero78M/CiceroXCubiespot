const fs = require('fs');

//Google Spreadsheet
const { GoogleSpreadsheet } = require ('google-spreadsheet');
const { JWT } = require ('google-auth-library');

const googleCreds = JSON.parse (fs.readFileSync('./database/ciceroKey.json'));

const googleAuth = new JWT({
  // env var values here are copied from service account credentials generated by google
  // see "Authentication" section in docs for more info
  email: googleCreds.client_email,
  key: googleCreds.private_key,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

module.exports = {
  
  //New Client Database by Organizations Source Functions
  newClientOrg: async function newClientOrg(sheetName, sourceID, filesID){

    const sourceX = sourceID.split('/').pop(); //Get Last Segment of Links
    
    const targetDoc = new GoogleSpreadsheet(filesID, googleAuth); //Google Auth

    try {
      //Insert New Sheet
      const targetSheet = await targetDoc.addSheet({ title: sheetName, headerValues:['ID_KEY', 'NAMA', 'TITLE', 'DIVISI', 'JABATAN', 'STATUS', 'WHATSAPP', 'INSTA', 'TIKTOK'] });
      console.log(targetSheet.title);

      const sourceDoc = new GoogleSpreadsheet(sourceX, googleAuth); //Google Auth
      await sourceDoc.loadInfo(); // loads document properties and worksheets

      const sheetSource = sourceDoc.sheetsByTitle[sheetName]; //Get Source Sheet Documents by Title
      const rowsSource = await sheetSource.getRows(); //Get Sheet data By Rows
      
      await targetDoc.loadInfo(); // loads document properties and worksheets
      const sheetTarget = targetDoc.sheetsByTitle[sheetName]; //Get Target Sheet Documents by Title

      var i = 0;  //  set your counter to 0

      function pushDataOrg() { //  create a loop function
        setTimeout(function() { //  call a 2s setTimeout when the loop is called
          sheetTarget.addRow({ID_KEY: rowsSource[i].get('NRP'), NAMA: rowsSource[i].get('NAMA'), TITLE: rowsSource[i].get('PANGKAT'), DIVISI: rowsSource[i].get('SATFUNG'), JABATAN: rowsSource[i].get('JABATAN'), STATUS: true, WHATSAPP: rowsSource[i].get('WHATSAPP'), INSTA: rowsSource[i].get('IG1'), TIKTOK: rowsSource[i].get('TIKTOK')});
          //  post data
          i++;  //  increment the counter
          if (i < rowsSource.length) {  //  if the counter < rowsSource.length, call the loop function
            pushDataOrg(); //  again which will trigger another 
          } else {
            return "All  Data Transfered";
          };
        }, 2000)
      }
      //initiate
      pushDataOrg();
    } catch (error) {
      //if sheet name is exist
      return "Sheet Name Existed";
    }
  },

  //New Client Database by Company Source Functions  
  newClientCom: async function newClientCom(sheetName, sourceID, filesID){

    const sourceX = sourceID.split('/').pop();      //Get Last Segment of Links
    const targetDoc = new GoogleSpreadsheet(filesID, googleAuth);//Google Auth

    try {
      //Insert New Sheet
      const targetSheet = await targetDoc.addSheet({ title: sheetName, headerValues:['ID_KEY', 'NAMA', 'TITLE', 'DIVISI', 'JABATAN', 'STATUS', 'WHATSAPP', 'INSTA', 'TIKTOK'] });
      console.log(targetSheet.title);

      const sourceDoc = new GoogleSpreadsheet(sourceX, googleAuth); //Google Auth
      await sourceDoc.loadInfo(); // loads document properties and worksheets

      const sheetSource = sourceDoc.sheetsByTitle[sheetName]; //Get Source Sheet Documents by Title
      const rowsSource = await sheetSource.getRows(); // loads document properties and worksheets
      
      await targetDoc.loadInfo(); // loads document properties and worksheets
      const sheetTarget = targetDoc.sheetsByTitle[sheetName];//Get Target Sheet Documents by Title

      var i = 0;  //  set your counter to 0

      function pushDataCom() { //  create a loop function
        setTimeout(function() { //  call a 2s setTimeout when the loop is called
          sheetTarget.addRow({ID_KEY: rowsSource[i].get('ID_KEY'), NAMA: rowsSource[i].get('NAMA'), TITLE: null, DIVISI: rowsSource[i].get('DIVISI'), JABATAN: rowsSource[i].get('JABATAN'), STATUS: true, WHATSAPP: rowsSource[i].get('WHATSAPP'), INSTA: rowsSource[i].get('INSTA'), TIKTOK: rowsSource[i].get('TIKTOK')});
          //  post data
          i++;  //  increment the counter
          if (i < rowsSource.length) {  //  if the counter < rowsSource.length, call the loop function
            pushDataCom();  //again which will trigger another 
          } else {
            return "All  Data Transfered";
          };
        }, 2000)
      }
      //initiate
      pushDataCom();
    } catch (error) {
      //if sheet name is exist
      return "Sheet Name Existed";
    }
  },

  //Add New User to Client Data Base Functions  
  addUser: async function addUser(sheetName, idKey, userName, userDiv, userJab, userTitle, filesID){
    const targetDoc = new GoogleSpreadsheet(filesID, googleAuth);//Google Auth
    try {
      //Insert New Sheet
      await targetDoc.loadInfo(); // loads document properties and worksheets
      const sheetTarget = targetDoc.sheetsByTitle[sheetName];

      await targetDoc.loadInfo(); // loads document properties and worksheets
      const rowsData = await sheetTarget.getRows();

      let idKeyList = [];

      //Collect ID_KEY List String
      for (let ix = 0; ix < rowsData.length; ix++){
        if(!idKeyList.includes(rowsData[ix].get('ID_KEY'))){
          idKeyList.push(rowsData[ix].get('ID_KEY'));
        }
      }
      
      let divisiList = [];

      //Collect Divisi List String
      for (let i = 0; i < rowsData.length; i++){
        if(!divisiList.includes(rowsData[i].get('DIVISI'))){
          divisiList.push(rowsData[i].get('DIVISI'));
        }
      }
      if(divisiList.includes(userDiv)){
        if (!idKeyList.includes(idKey)){

          //Get Target Sheet Documents by Title
          sheetTarget.addRow({ID_KEY: idKey, NAMA: userName, TITLE: userTitle, DIVISI: userDiv, JABATAN: userJab, STATUS: true});

          return 'Success Input Data';
        } else {
          return 'ID_Key is Exist, Try Another ID_Key';
        }

      } else {
        return 'Divisi Tidak Terdaftar';
      }
    } catch (error) {
      //if sheet name is exist
      console.log(error);
    }
  },
  //Edit User Divisi to Client Data Base Functions  
  editDivisi: async function editDivisi(sheetName, idKey, userDiv, phone, filesID){
    const targetDoc = new GoogleSpreadsheet(filesID, googleAuth);//Google Auth
    try {
      //Insert New Sheet
      await targetDoc.loadInfo(); // loads document properties and worksheets
      const sheetTarget = targetDoc.sheetsByTitle[sheetName];

      await targetDoc.loadInfo(); // loads document properties and worksheets
      const rowsData = await sheetTarget.getRows();

      let isDataExist = false;

      let divisiList = [];
  
      //Collect Divisi List String
      for (let i = 0; i < rowsData.length; i++){
        if(!divisiList.includes(rowsData[i].get('DIVISI'))){
          divisiList.push(rowsData[i].get('DIVISI'));
        }
      }

      if (divisiList.includes(userDiv)){
        for (let ii = 0; ii < rowsData.length; ii++){
          if (rowsData[ii].get('ID_KEY') === idKey){
            isDataExist = true;
            rowsData[ii].assign({DIVISI: userDiv, WHATSAPP: phone});; // Update Divisi Value
            await rowsData[ii].save(); //save update

            return 'Data Updated';
          }
        }

        if(!isDataExist){
          return 'User Data with delegated ID_KEY Doesn\'t Exist';
        }
      } else {
        return 'Divisi Unregsitered';
      }
    } catch (error) {
      //if sheet name is exist
      return 'Sheet Exist';
    }
  },

  //Edit User Jabatan to Client Data Base Functions  
  editJabatan: async function editJabatan(sheetName, idKey, userJab, phone, filesID){

    const targetDoc = new GoogleSpreadsheet(filesID, googleAuth);//Google Auth
    try {
      //Insert New Sheet
      await targetDoc.loadInfo(); // loads document properties and worksheets
      const sheetTarget = targetDoc.sheetsByTitle[sheetName];

      await targetDoc.loadInfo(); // loads document properties and worksheets
      const rowsData = await sheetTarget.getRows();

      let isDataExist = false;

      for (let i = 0; i < rowsData.length; i++){
        if (rowsData[i].get('ID_KEY') === idKey){
          isDataExist = true;

          rowsData[i].assign({JABATAN: userJab, WHATSAPP: phone});; // Jabatan Divisi Value
          await rowsData[i].save(); //save update

          return 'Data Updated';
        }
      }

      if(!isDataExist){
        return 'User Data with delegated ID_KEY Doesn\'t Exist';
      }
      
    } catch (error) {
      //if sheet name is exist
      console.log(error);
    }
  },

  //Edit User Jabatan to Client Data Base Functions  
  editNama: async function editNama(sheetName, idKey, userNama, phone, filesID){

    const targetDoc = new GoogleSpreadsheet(filesID, googleAuth);//Google Auth
    try {
      //Insert New Sheet
      await targetDoc.loadInfo(); // loads document properties and worksheets
      const sheetTarget = targetDoc.sheetsByTitle[sheetName];

      await targetDoc.loadInfo(); // loads document properties and worksheets
      const rowsData = await sheetTarget.getRows();

      let isDataExist = false;

      for (let i = 0; i < rowsData.length; i++){
        if (rowsData[i].get('ID_KEY') === idKey){

          isDataExist = true;
          rowsData[i].assign({NAMA: userNama, WHATSAPP: phone});; // Update Divisi Value
          await rowsData[i].save(); //save update

          return 'Data Updated';
        }
      }

      if(!isDataExist){
        return 'User Data with delegated ID_KEY Doesn\'t Exist';
      }
      
    } catch (error) {
      //if sheet name is exist
      console.log(error);
    }
  },

  //Edit User Jabatan to Client Data Base Functions  
  updateInsta: async function updateInsta(sheetName, idKey, insta, phone, filesID){
    const userLink = insta.replaceAll('/profilecard/','').split('/').pop();      //Get Last Segment of Links

    const targetDoc = new GoogleSpreadsheet(filesID, googleAuth);//Google Auth
    try {
      //Insert New Sheet
      await targetDoc.loadInfo(); // loads document properties and worksheets
      const sheetTarget = targetDoc.sheetsByTitle[sheetName];

      await targetDoc.loadInfo(); // loads document properties and worksheets
      const rowsData = await sheetTarget.getRows();

      let isDataExist = false;

      let instaList = [];
  
      //Collect Divisi List String
      for (let i = 0; i < rowsData.length; i++){
        if(!instaList.includes(rowsData[i].get('INSTA'))){
          instaList.push(rowsData[i].get('INSTA'));
        }
      }

      if(!instaList.includes(userLink)){
        for (let i = 0; i < rowsData.length; i++){
          if (rowsData[i].get('ID_KEY') === idKey){

            isDataExist = true;
            rowsData[i].assign({INSTA: userLink, WHATSAPP: phone}); // Update Insta Value
            await rowsData[i].save(); //save update

            return 'Data Updated';
          }
        }
      } else {
        isDataExist = true;
        return 'Username Instagram is Used by another User';
      }

      if(!isDataExist){
        return 'User Data with delegated ID_KEY Doesn\'t Exist';
      }
      
    } catch (error) {
      //if sheet name is exist
      console.log(error);
    }
  },

  //Edit User Jabatan to Client Data Base Functions  
  updateTiktok: async function updateTiktok(sheetName, idKey, tiktok, phone, filesID){
    const userLink = tiktok.split('/').pop();      //Get Last Segment of Links

    const targetDoc = new GoogleSpreadsheet(filesID, googleAuth);//Google Auth
    try {
      //Insert New Sheet
      await targetDoc.loadInfo(); // loads document properties and worksheets
      const sheetTarget = targetDoc.sheetsByTitle[sheetName];

      await targetDoc.loadInfo(); // loads document properties and worksheets
      const rowsData = await sheetTarget.getRows();

      let isDataExist = false;

      let tiktokList = [];
  
      //Collect Divisi List String
      for (let i = 0; i < rowsData.length; i++){
        if(!tiktokList.includes(rowsData[i].get('TIKTOK'))){
          tiktokList.push(rowsData[i].get('TIKTOK'));
        }
      }
    
      if(!tiktokList.includes(userLink)){
        for (let i = 0; i < rowsData.length; i++){
          if (rowsData[i].get('ID_KEY') === idKey){

            isDataExist = true;
            rowsData[i].assign({TIKTOK: userLink, WHATSAPP: phone}); // Update Insta Value
            await rowsData[i].save(); //save update

            return 'Data Tiktok Updated';
          }
        }
      } else {
        isDataExist = true;
        return 'Username Tiktok is Used by another User';
      }

      if(!isDataExist){
        return 'User Data with delegated ID_KEY Doesn\'t Exist';
      }
    
    } catch (error) {
      //if sheet name is exist
      console.log(error);
    }
  },
};