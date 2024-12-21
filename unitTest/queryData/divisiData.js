import { readFileSync } from 'fs';
import { sheetDoc } from './sheetDoc.js';

const ciceroKey = JSON.parse (readFileSync('ciceroKey.json'));


export async function divisiData(clientName) {

    let userDoc = await sheetDoc(ciceroKey.dbKey.userDataID, clientName);
    let userRows = userDoc.data;
      console.log(userRows)
    let divisiList = [];

    for (let i = 0; i < userRows.length; i++){
        if(!divisiList.includes(userRows[i].get('DIVISI'))){
          divisiList.push(userRows[i].get('DIVISI')); 
        }
    }
    console.log(divisiList);
    let response = {
        data : divisiList,
        state : true,
        code : 200
      }

      return response;
}