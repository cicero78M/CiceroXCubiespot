import { readFileSync } from 'fs';
import { sheetDoc } from "../database_query/sheetDoc.js";
const ciceroKey = JSON.parse (readFileSync('ciceroKey.json'));

export async function propertiesView(clientName, type) {
  
    const userDoc = await sheetDoc(ciceroKey.dbKey.userDataID, clientName);
    const userRows = userDoc.data;
    let dataList = [];
    let dataString = '';

    //Collect Divisi List String
    for (let i = 0; i < userRows.length; i++) {
      if (!dataList.includes(userRows[i].get(type))) {
        dataList.push(userRows[i].get(type));
        if(userRows[i].get(type) !== undefined){
          dataString = dataString+"\n"+userRows[i].get(type);
        }
      }
    }

    let data = {
      data : `*`+type+` List*\n\n`+dataString,
      state: true,
      code: 201
    }

  return data;
}
