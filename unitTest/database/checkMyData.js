import { readFileSync } from 'fs';
import { sheetDoc as _sheetDoc } from '../queryData/sheetDoc.js';

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

        let responseData = {
          data: `*Profile Anda*\n\nUser : ` +response.get('TITLE')+` `+response.get('NAMA') + `\nID Key : ` + response.get('ID_KEY') + `\nDivisi / Jabatan : `
            + response.get('DIVISI') + ` / ` + response.get('JABATAN') + `\nInsta : ` + response.get('INSTA') + `\nTikTok : ` + response.get('TIKTOK')
            + `\nAccount Status : ` + response.get('STATUS'),
          state: true,
          code: 200
        };

        return responseData;

      }
    }

    if (!isUserExist) {

      let responseData = {
        data: "ID KEY HAVE NO RECORD",
        state: true,
        code: 200
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