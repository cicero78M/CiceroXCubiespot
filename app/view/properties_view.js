import { readFileSync } from 'fs';
import { newRowsData } from '../database/new_query/sheet_query.js';
const ciceroKey = JSON.parse (readFileSync('ciceroKey.json'));

export async function propertiesView(clientName, type) {
  
  let dataList = [];
  let dataString = '';
  return new Promise(async (resolve) => {
    
   try {
     await newRowsData(
       ciceroKey.dbKey.userDataID, 
       clientName
     ).then(
       userRows => {
         //Collect Divisi List String
         for (let i = 0; i < userRows.length; i++) {
           if (!dataList.includes(userRows[i].get(type))) {
             dataList.push(userRows[i].get(type));
             if(userRows[i].get(type) !== undefined){
               dataString = dataString+"\n"+userRows[i].get(type);
             }
           }
         }
       }
     )
     let data = {
       data : `*`+type+` List*\n\n`+dataString,
       state: true,
       code: 201
     }  
     resolve (data);
   } catch (error) {
    let data = {
      data : error,
      state: false,
      code: 303
    }  
    reject (data);
   }
  })
}
