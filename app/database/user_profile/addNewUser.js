
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { ciceroKey, googleAuth } from '../new_query/sheet_query.js';
import { myData } from '../../database_query/myData.js';

export async function addNewUser(clientName, idKey, name, divisi, jabatan, title){

  let dataKey = parseInt(idKey);

  console.log(dataKey);


  try {

    

    const userDoc = new GoogleSpreadsheet(
      ciceroKey.dbKey.userDataID, 
      googleAuth
    ); //Google Auth
    
    await userDoc.loadInfo(); // loads document properties and worksheets
    const userSheet = userDoc.sheetsByTitle[clientName];

    const userRows = await userSheet.getRows();

    let idKeyList = [];

    let idExist = false;

    //Collect ID_KEY List String
    for (let i = 0; i < userRows.length; i++) {

      if(parseInt(userRows[i].get('ID_KEY')) === dataKey){
        idExist = true;
      }
      
      if (!idKeyList.includes(parseInt(userRows[i].get('ID_KEY')))) {
        idKeyList.push(parseInt(userRows[i].get('ID_KEY')));
      }
    }

    let divisiList = [];

    //Collect Divisi List String
    for (let i = 0; i < userRows.length; i++) {
      if (!divisiList.includes(userRows[i].get('DIVISI'))) {
        divisiList.push(userRows[i].get('DIVISI'));
      }
    }

    if (divisiList.includes(divisi)) {

      if (!idExist) {
        console.log("Id key not exist");
        //Get Target Sheet Documents by Title
        userSheet.addRow({ 
          ID_KEY: dataKey, 
          NAMA: name, 
          TITLE: title, 
          DIVISI: divisi, 
          JABATAN: jabatan, 
          STATUS: true, 
          EXCEPTION: false 
        });
          
        let responseMyData = await myData(
          clientName, 
          dataKey
        );
          
        return responseMyData;
      
      } else {
        let responseData = {
          data: 'ID_Key is Exist, Try Another ID_Key',
          state: true,
          code: 201
        };

        console.log('Return ID_Key used');
        userDoc.delete;
        return responseData;
      }

    } else {

      console.log('Return Divisi Tidak Terdaftar');

      await propertiesView(
          clientName, 
          "DIVISI"
      ).then(
        response =>
          resolve (response)
      )
    }
  } catch (error) {

    console.log(error);
    let responseData = {
      data: error,
      state: false,
      code: 303
    };
 
    return responseData;
  }
}