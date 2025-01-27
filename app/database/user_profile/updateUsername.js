import { newListValueData } from "../new_query/data_list_query.js";
import { myData } from "../../database_query/myData.js";
import { readUser } from "../../../json_data_file/user_data/read_data_from_dir.js";
import { readFileSync, writeFileSync } from "fs";
import { encrypted } from "../../../json_data_file/crypto.js";
import { logsSave } from "../../responselogs/logs_modif.js";

export async function updateUsername(clientName, idKey, username, phone, type) {

  let idExist = false;
  let usernameList = [];
  let userRows = [];
  let phoneList = [];
  let userData = new Object();

  return new Promise(async (resolve, reject) => {
    try {
    
      await newListValueData(clientName, type).then(
        async response => {
          usernameList = await response;
        }
      );

      await newListValueData(
        clientName, 
        "WHASTAPP"
      ).then(
        async response =>{
          phoneList = await response;
        }
      );
  
      await readUser(
        clientName
      ).then( 
        async response => {    
          userRows = await response;                           
          for (let i = 0; i < userRows.length; i++) {
            if (parseInt(userRows[i].ID_KEY) === parseInt(idKey) ){
              logsSave("data exist")
              idExist = true;
              userData = JSON.parse(readFileSync(`json_data_file/user_data/${clientName}/${userRows[i].ID_KEY}.json`));            
            }
          } 
        }
      );
  
      if (!usernameList.includes(username)) {
        for (let i = 0; i < userRows.length; i++) {
          if (parseInt(userRows[i].ID_KEY) === parseInt(idKey) ){

            if (userRows[i].STATUS === "TRUE") {
              
              userData.ID_KEY = encrypted(userRows[i].ID_KEY);
              userData.NAMA = encrypted(userRows[i].NAMA);
              userData.TITLE = encrypted(userRows[i].TITLE);
              userData.DIVISI = encrypted(userRows[i].DIVISI);
              userData.JABATAN = encrypted(userRows[i].JABATAN);
              userData.STATUS = encrypted(userRows[i].STATUS);
              userData.EXCEPTION = encrypted(userRows[i].EXCEPTION);
                
              if (type === "INSTA") {                  
                userData.TIKTOK = encrypted(userRows[i].TIKTOK);
                userData.INSTA = encrypted(username);
              } else if (type === "TIKTOK") {
                userData.INSTA = encrypted(userRows[i].INSTA);
                userData.TIKTOK = encrypted(username);
              }

              switch (userRows[i].WHATSAPP) {
                case phone:
                  userData.WHATSAPP = encrypted(phone);
                  writeFileSync(`json_data_file/user_data/${clientName}/${idKey}.json`, JSON.stringify(userData));
                  await myData(clientName, idKey).then(
                    response => resolve (response)
                  ).catch(
                    response => reject (response)
                  );
                  break;
                case "6281235114745":
                  userData.WHATSAPP = encrypted("");
                  writeFileSync(`json_data_file/user_data/${clientName}/${idKey}.json`, JSON.stringify(userData));
                  await myData(clientName, idKey).then(
                    response => resolve (response)
                  ).catch(
                    response => reject (response)
                  );
                  break;
                default:
                  if (!phoneList.includes(phone)) {

                    userData.WHATSAPP = encrypted(phone);

                    writeFileSync(`json_data_file/user_data/${clientName}/${idKey}.json`, JSON.stringify(userData));
                
                    await myData(clientName, idKey).then(
                      response => resolve (response)
    
                    ).catch(
                      response => reject (response)
    
                    )
                  } else {
                    
                    let responseData = {
                      data: 'Ubah data dengan menggunakan Nomor Whatsapp terdaftar',
                      state: true,
                      code: 201
                    };

                    reject (responseData);                  
                  }
                  break;
              }
                
            } else {

              let responseData = {
                data: 'Your Account Suspended',
                state: true,
                code: 201
              };

              reject (responseData);

            }
          }
        }
  
        if (!idExist) {
  
          let responseData = {
            data: 'User Data with delegated ID_KEY Doesn\'t Exist',
            state: true,
            code: 201
          };
          reject (responseData);
        }
      } else {
  
        let responseData = {
          data: 'Username Sudah Terdaftar',
          state: true,
          code: 201
        };
        reject (responseData);
      }
  
    } catch (error) {
  
      let responseData = {
        data: error,
        message: "Update Username Error",
        state: false,
        code: 303
      };
  
      reject (responseData);
    }
  });
}