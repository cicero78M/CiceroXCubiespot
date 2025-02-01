import { readUser } from './read_data_from_dir.js';
import { myDataView } from '../../view/my_data_view.js';

export async function usernameInfo(clientName, username, type) {

  return new Promise(async (resolve, reject) => {
    try {
      //Data by Sheet Name
      let data;
      let isUserExist = false;
  
      await readUser(
        clientName
      ).then(
        async response =>{ 
          let userRows = response.data;
          //Check if idKey Exist
          for (let i = 0; i < userRows.length; i++) {
            if(type === "INSTA"){

                if (userRows[i].INSTA === username) {
  
                    isUserExist = true;
                    let userRow = userRows[i];
        
                    await myDataView(userRow).then(
                      response => resolve(response)
                    ).catch(
                      error =>reject (error)
                    )             
                }

            } else {
                
                if (userRows[i].TIKTOK === username) {
  
                    isUserExist = true;
                    let userRow = userRows[i];
        
                    await myDataView(userRow).then(
                      response => resolve(response)
                    ).catch(
                      error =>reject (error)
                    )             
                }

            }
          }
        }
      ).catch(
        error =>reject (error)
      );
  
      if (!isUserExist) {
        data = {
          data: "Username not found",
          state: true,
          code: 201
        };
        reject (data);
      }
      
    } catch (error) {
      data = {
        data: error,
        message : "My Data Error",
        state: false,
        code: 303
      };
      reject (data);
    }
  });
}