import { newListValueData } from '../module/data_list_query.js';
export async function propertiesView(clientName, type) {

  let data;
  let dataList = [];
  let dataString = '';
  return new Promise(async (resolve, reject) => {
    
    try {
      await newListValueData(clientName,type).then(response => {

        let userRows = response.data;

          userRows.forEach(element => {
            if (!dataList.includes(element)) {
              dataList.push(element);
              if(element !== undefined){
                dataString = dataString+"\n"+element;
              }
            }
            
          });

        });
        
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
      console.log(error)
      reject (data);
    }
  });
}
