import { myDataView } from '../view/my_data_view.js';
import { readUser } from '../../json_data_file/user_data/read_data_from_dir.js';

export async function myData(clientName, idKey) {

  return new Promise(async (resolve, reject) => {
    try {
      //Data by Sheet Name
  
      let isUserExist = false;
      let response = [];
  
      await readUser(
        clientName
      ).then(
        async userRows =>{
          //Check if idKey Exist
          for (let i = 0; i < userRows.length; i++) {
  
            if (parseInt(userRows[i].ID_KEY) === parseInt(idKey)) {
  
              isUserExist = true;
              response = userRows[i];
  
              let responseData = await myDataView(response);
              
              resolve (responseData);
            
            }
          }
        }
      )
  
      if (!isUserExist) {
        
        let responseData = {
          data: "ID KEY HAVE NO RECORD",
          state: true,
          code: 201
        };
  
        reject (responseData);
      }
  
    } catch (error) {
    
      let responseData = {
        data: error,
        state: false,
        code: 303
      };
  
      console.log(error);
      reject (responseData);
    
    }
  })

}