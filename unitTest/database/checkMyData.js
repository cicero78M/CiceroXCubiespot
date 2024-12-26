import { readFileSync } from 'fs';
import { sheetDoc as _sheetDoc } from '../queryData/sheetDoc.js';
import { myDataView } from '../view/myDataView.js';

const ciceroKey = JSON.parse (readFileSync('ciceroKey.json'));

export async function checkMyData(clientName, idKey) {
  //Auth Request to Files
  try {
    //Data by Sheet Name
    let responseUser = await _sheetDoc(ciceroKey.dbKey.userDataID, clientName);
    let userRows = responseUser.data;

    let isUserExist = false;
    let response = [];
    //Check if idKey Exist
    for (let i = 0; i < userRows.length; i++) {
      if (userRows[i].get('ID_KEY') === idKey) {

        isUserExist = true;
        response = userRows[i];


        let data = {
          data: response,
          state: true,
          code: 200
        };

        let responseData = await myDataView(data);
        
        return responseData;

      }
    }

    if (!isUserExist) {

      let responseData = {
        data: "ID KEY HAVE NO RECORD",
        state: true,
        code: 201
      };

      console.log('ID KEY HAVE NO RECORD');

      return responseData;

    }


  } catch (error) {
    let responseData = {
      data: error,
      state: false,
      code: 303
    };

    console.log(error);
    return responseData;
  }
}