import { readUser } from '../read_data/read_data_from_dir.js';

//This Function for edit user data profile
export async function usernameInfo(clientName, uname) {
  return new Promise(async (resolve, reject) => {
    try {
  
      await readUser(
        clientName
      ).then( 
        async response => { 
               
          let userRows = response.data; 

          let data = {
            data: userRows,
            state: true,
            code: 200
        };      

        resolve (data);  

        }
      ).catch(
        error => reject (error)
      );

    } catch (error) {
      let data = {
        data: error,
        message:"Edit Profile Error",
        state: false,
        code: 303
      };
      reject (data); 
    }    
  });

}