
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { ciceroKey, googleAuth } from '../new_query/sheet_query.js';
import { myData } from '../../database_query/myData.js';

export async function addNewUser(clientName, idKey, name, divisi, jabatan, title){

  console.log('Execute');

  try {

    const userDoc = new GoogleSpreadsheet(
      ciceroKey.dbKey.userDataID, 
      googleAuth
    ); //Google Auth
    
    await userDoc.loadInfo(); // loads document properties and worksheets
    const userSheet = userDoc.sheetsByTitle[clientName];

    const userRows = await userSheet.getRows();

    let idKeyList = [];

    //Collect ID_KEY List String
    for (let i = 0; i < userRows.length; i++) {
      if (!idKeyList.includes(userRows[i].get('ID_KEY'))) {
        idKeyList.push(userRows[i].get('ID_KEY'));
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
      if (!idKeyList.includes(idKey)) {
        console.log("Id key not exist");

        //Get Target Sheet Documents by Title
        userSheet.addRow({ 
          ID_KEY: idKey, 
          NAMA: name, 
          TITLE: title, 
          DIVISI: divisi, 
          JABATAN: jabatan, 
          STATUS: true, 
          EXCEPTION: false 
        });
          
        let responseMyData = await myData(
          clientName, 
          idKey
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
 
      let responseData = {
        data: 'Divisi Tidak Terdaftar',
        state: true,
        code: 201
      };

      console.log('Return Divisi Tidak Terdaftar');

      await propertiesView(
          splittedMsg[0].toUpperCase(), 
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