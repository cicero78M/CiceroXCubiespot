import { readUser } from '../read_data/read_data_from_dir.js';

//This Function for edit user data profile
export async function usernameInfo(clientName, uname) {
  return new Promise(async (resolve, reject) => {
    try {

      let userRows = new Array();
  
  
      await readUser(
        clientName
      ).then( 
        async response => {    
          userRows = await response.data; 
          for (let i = 0; i < userRows.length; i++) {
            if (userRows[i].INSTA === uname){
                console.log(userRows[i]);
            }
          } 
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