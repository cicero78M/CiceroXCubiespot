import { newListValueData } from "../../module/data_list_query.js";
import { myData } from "../read_data/read_my_data.js";
import { readFileSync, writeFileSync } from "fs";
import { encrypted } from "../../module/crypto.js";
import { logsSave } from "../../view/logs_whatsapp.js";
import { readUser } from "../read_data/read_data_from_dir.js";
import { saveGoogleContact } from "../../module/g_contact_api.js";

export async function updateUsername(clientName, idKey, username, phone, type, isContact) {

  let idExist = false;
  let usernameList = new Array();
  let userRows = new Array();
  let phoneList = new Array();
  let userData = new Object();

  return new Promise(async (resolve, reject) => {
    try {
      //Get Username List
      await newListValueData(clientName, type).then(
        async response => {
          usernameList = await response.data;
        }
      );
      //Get Whatsapp  List
      await newListValueData(
        clientName, 
        "WHATSAPP"
      ).then(
        async response =>{
          phoneList = await response.data;
        }
      ).catch(
        error =>{
          reject (error);   
        } 
      );
      //Get User Data
      await readUser(
        clientName
      ).then( 
        async response => {    
          userRows = await response.data;                           
          for (let i = 0; i < userRows.length; i++) {
            if (parseInt(userRows[i].ID_KEY) === parseInt(idKey) ){
              logsSave("data exist")
              idExist = true;
              userData = JSON.parse(readFileSync(`json_data_file/user_data/${clientName}/${userRows[i].ID_KEY}.json`));            
            }
          } 
        }
      );

      for (let i = 0; i < userRows.length; i++) {
        if (parseInt(userRows[i].ID_KEY) === parseInt(idKey) ){

          if (userRows[i].STATUS === "TRUE") {

            // if(!isContact){        
            //   saveGoogleContact(userRows[i].NAMA, clientName, phone);
            // }
            
            userData.ID_KEY = encrypted(userRows[i].ID_KEY);
            userData.NAMA = encrypted(userRows[i].NAMA);
            userData.TITLE = encrypted(userRows[i].TITLE);
            userData.DIVISI = encrypted(userRows[i].DIVISI);
            userData.JABATAN = encrypted(userRows[i].JABATAN);
            userData.STATUS = encrypted(userRows[i].STATUS);
            userData.EXCEPTION = encrypted(userRows[i].EXCEPTION);

            if (!usernameList.includes(username)){
              if (type === "INSTA") {                  
                userData.INSTA = encrypted(userRows[i].INSTA);
                userData.TIK\
                 = encrypted(username);
              } else if (type === "TIKTOK") {
                userData.TIKTOK = encrypted(userRows[i].TIKTOK);
                userData.INSTA = encrypted(username);
              }
            } else {
              if (type === "INSTA") {                  
                if(username === userRows[i].INSTA){
                  
                  await myData(clientName, idKey).then(
                    response => resolve (response)
                  ).catch(
                    response => reject (response)
                  );

                } else {
                  let responseData = {
                    data: 'Username sudah di gunakan oleh akun lainnya',
                    state: true,
                    code: 201
                  };
                  reject (responseData);
                  break;
                }
              } else if (type === "TIKTOK") {
                if(username === userRows[i].TIKTOK){
                  
                  await myData(clientName, idKey).then(
                    response => resolve (response)
                  ).catch(
                    response => reject (response)
                  );

                } else {
                  let responseData = {
                    data: 'Username sudah di gunakan oleh akun lainnya',
                    state: true,
                    code: 201
                  };
                  reject (responseData);
                  break;
                }
              }
            }

            switch (userRows[i].WHATSAPP) {
              case phone:
                writeFileSync(`json_data_file/user_data/${clientName}/${idKey}.json`, JSON.stringify(userData));
                await myData(clientName, idKey).then(
                  response => resolve (response)
                ).catch(
                  response => reject (response)
                );
                break;
       
              default:
                {
                  if (!phoneList.includes(phone)) {
                    if (phone === "6281235114745") {
                      userData.WHATSAPP = encrypted("");

                      writeFileSync(`json_data_file/user_data/${clientName}/${idKey}.json`, JSON.stringify(userData));
                      await myData(clientName, idKey).then(
                        response => resolve (response)
                      ).catch(
                        response => reject (response)
                      );
                    } else {
                      userData.WHATSAPP = encrypted(phone);
                      writeFileSync(`json_data_file/user_data/${clientName}/${idKey}.json`, JSON.stringify(userData));
                      await myData(clientName, idKey).then(
                        response => resolve (response)
                      ).catch(
                        response => reject (response)
                      );
                    }                 
                  } else {
                    if (phone === "6281235114745") {
                      userData.WHATSAPP = encrypted("");
                      writeFileSync(`json_data_file/user_data/${clientName}/${idKey}.json`, JSON.stringify(userData));
                      await myData(clientName, idKey).then(
                        response => resolve (response)
                      ).catch(
                        response => reject (response)
                      );
                    } else {
                      let responseData = {
                        data: 'Nomor Whatsapp anda sudah terdaftar dengan akun lain, hubungi admin untuk perubahan',
                        state: true,
                        code: 201
                      };
                      reject (responseData); 
                    }
                  }

                  break;
              }
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