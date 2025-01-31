import { newListValueData } from '../module/data_list_query.js';

export async function propertiesView(clientName, type) {
  let data;
  let dataList = [];
  let dataString = '';
  return new Promise(async (resolve, reject) => {
    
   try {
     await newListValueData(
       clientName,
       type
     ).then(
       response => {
        let userRows = response.data;
         //Collect Divisi List String
         for (let i = 0; i < userRows.length; i++) {
           if (!dataList.includes(userRows[i])) {
             dataList.push(userRows[i]);
             if(userRows[i] !== undefined){
               dataString = dataString+"\n"+userRows[i];
             }
           }
         }
       }
     )

      data = {
       data : `*`+type+` List*\n\n`+dataString,
       state: true,
       code: 200
     }  
     resolve (data);

    } catch (error) {
    data = {
      data : error,
      message:"List Value Data Error",
      state: false,
      code: 303
    }  
    reject (data);
   }
  });
}
