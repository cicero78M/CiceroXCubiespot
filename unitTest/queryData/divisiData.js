import { readFileSync } from 'fs';

const ciceroKey = JSON.parse (readFileSync('ciceroKey.json'));


export async function divisiData(clientName) {

    let userDoc = await sheetDoc.sheetDoc(ciceroKey.dbKey.userDataID, clientName);
    let userRows = userDoc.data;
      
    let divisiList = [];

    for (let i = 0; i < userRows.length; i++){
        if(!divisiList.includes(userRows[i].get('DIVISI'))){
          divisiList.push(userRows[i].get('DIVISI')); 
        }
    }
    
    let response = {
        data : divisiList,
        state : true,
        code : 200
      }

      return response;
}