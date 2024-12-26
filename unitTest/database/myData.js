import { readFileSync } from 'fs';
import { sheetDoc as _sheetDoc } from '../queryData/sheetDoc.js';
import { myDataView } from '../view/myDataView.js';

const ciceroKey = JSON.parse (readFileSync('ciceroKey.json'));

export async function myData(clientName, idKey) {
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

        let responseData = await myDataView(response);
        return responseData;
      }
    }

    if (!isUserExist) {
      
      let responseData = {
        data: "ID KEY HAVE NO RECORD",
        state: true,
        code: 201
      };

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