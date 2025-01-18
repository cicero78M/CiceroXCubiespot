import { newListValueData } from '../database/new_query/data_list_query.js';

export async function propertiesView(clientName, type) {
  
  let dataList = [];
  let dataString = '';
  return new Promise(async (resolve) => {
    
   try {
     await newListValueData(
       clientName,
       type
     ).then(
       userRows => {
         //Collect Divisi List String
         for (let i = 0; i < userRows.length; i++) {
           if (!dataList.includes(userRows[i][type])) {
             dataList.push(userRows[i][type]);
             if(userRows[i][type] !== undefined){
               dataString = dataString+"\n"+userRows[i][type];
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
