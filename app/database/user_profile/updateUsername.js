import { GoogleSpreadsheet } from "google-spreadsheet";
import { ciceroKey, googleAuth } from "../new_query/sheet_query.js";
import { newListValueData } from "../new_query/data_list_query.js";

export async function updateUsername(clientName, idKey, username, phone, type) {

  let isDataExist = false;
  let usernameList;
  let userType;

  return new Promise(async (resolve, reject) => {

    try {
      
      //Insert New Sheet
      const userDoc = new GoogleSpreadsheet(ciceroKey.dbKey.userDataID, googleAuth); //Google Auth
      await userDoc.loadInfo(); // loads document properties and worksheets
      const userSheet = userDoc.sheetsByTitle[clientName];
      const userRows = await userSheet.getRows();
  
      //Collect Divisi List String
      if (type === "updateinstausername") {
        await newListValueData(clientName, 'INSTA').then(
          response => {
            usernameList = response.data;
            userType = 'INSTA';
          }
        );
      } else if (type === "updatetiktokusername") {
        await newListValueData(clientName, 'TIKTOK').then(
          response => {
            usernameList = response.data;
            userType = 'TIKTOK';     
          }
        );
      }
  
      if (!usernameList.includes(username)) {
        for (let i = 0; i < userRows.length; i++) {
          if (userRows[i].get('ID_KEY') === idKey) {
            if (userRows[i].get('WHATSAPP') === phone || userRows[i].get('WHATSAPP') === "" || phone === "6281235114745") {
  
              if (userRows[i].get('STATUS') === "TRUE") {
  
                isDataExist = true;
                if (type === "updateinstausername") {
                  userRows[i].assign({ INSTA: username, WHATSAPP: phone }); // Update Insta Value
                } else if (type === "updatetiktokusername") {
                  userRows[i].assign({ TIKTOK: username, WHATSAPP: phone }); // Update Insta Value
                }
                await userRows[i].save(); //save update
                
                await myData(clientName, idKey).then(
                  response => resolve (response)

                ).catch(
                  response => reject (response)

                )
                  
              } else {
  
                let responseData = {
                  data: 'Your Account Suspended',
                  state: true,
                  code: 201
                };
  
                console.log('Return Success');
                reject (responseData);
  
              }
  
            } else {
              let responseData = {
                data: 'Ubah data dengan menggunakan Nomor Whatsapp terdaftar',
                state: true,
                code: 201
              };
              console.log('Return Success');
              reject (responseData);
            }
          }
        }
  
        if (!isDataExist) {
  
          let responseData = {
            data: 'User Data with delegated ID_KEY Doesn\'t Exist',
            state: true,
            code: 201
          };
          console.log('Return ID_Key Doesnt Exist');
          reject (responseData);
        }
  
  
      } else {
  
        let responseData = {
          data: 'Username Sudah Terdaftar',
          state: true,
          code: 201
        };
        console.log('Return Username Exist');
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