import { readFileSync } from 'fs';
import { sheetDoc } from "../queryData/sheetDoc.js";
const ciceroKey = JSON.parse (readFileSync('ciceroKey.json'));

export async function propertiesView(clientName, type) {
  
      const userDoc = await sheetDoc(ciceroKey.dbKey.userDataID, clientName);
      const userRows = userDoc.data;

      let dataString;

      //Collect Divisi List String
      for (let i = 0; i < userRows.length; i++) {
        if (!dataList.includes(userRows[i].get(type))) {
          dataString = dataString+"\n"+userRows[i].get(type);
        }
      }

      let data = {
        data : `*`+type+` List*\n\n`+dataString,
        state: true,
        code: 201
      }

      return data;
}
