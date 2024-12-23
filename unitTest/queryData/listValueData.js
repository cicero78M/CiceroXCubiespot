import { readFileSync } from 'fs';
import { sheetDoc } from './sheetDoc.js';

const ciceroKey = JSON.parse (readFileSync('ciceroKey.json'));


export async function listValueData(clientName, keyValue) {

    let userDoc = await sheetDoc(ciceroKey.dbKey.userDataID, clientName);
    let userRows = userDoc.data;
    let listValue = [];

    for (let i = 0; i < userRows.length; i++){
        if(!listValue.includes(userRows[i].get(keyValue))){
          listValue.push(userRows[i].get(keyValue)); 
        }
    }
    let response = {
        data : listValue,
        state : true,
        code : 200
      }

      return response;
}