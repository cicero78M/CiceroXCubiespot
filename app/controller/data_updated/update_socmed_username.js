import { newListValueData } from "../../module/data_list_query.js";
import { myData } from "../read_data/read_my_data.js";
import { readFileSync, writeFileSync } from "fs";
import { encrypted } from "../../module/crypto.js";
import { logsSave } from "../../view/logs_whatsapp.js";
import { readUser } from "../read_data/read_data_from_dir.js";
import { authorize, saveGoogleContact } from "../../module/g_contact_api.js";

export async function updateUsername(clientName, idKey, username, phone, type, isContact) {

  console.log(phone)

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

            let sourceKey;
            let targetKey;
            
            if(process.env.APP_CLIENT_TYPE === "RES"){
              sourceKey = userRows[i].ID_KEY;
              targetKey = idKey;
            } else {
              sourceKey = userRows[i].ID_KEY;
              targetKey = idKey.toUpperCase();
            }

            if (sourceKey === targetKey ){
              logsSave("data exist")
              idExist = true;
              userData = JSON.parse(readFileSync(`json_data_file/user_data/${clientName}/${sourceKey}.json`));            
            }
          } 
        }
      );

      for (let i = 0; i < userRows.length; i++) {

        let sourceKey;
        let targetKey;
        
        if(process.env.APP_CLIENT_TYPE === "RES"){
          sourceKey = userRows[i].ID_KEY;
          targetKey = idKey;
        } else {
          sourceKey = userRows[i].ID_KEY;
          targetKey = idKey.toUpperCase();
        }

        if (sourceKey === targetKey ){

          if (userRows[i].STATUS === "TRUE") {

            userData.ID_KEY = encrypted(userRows[i].ID_KEY);
            userData.NAMA = encrypted(userRows[i].NAMA);
            userData.TITLE = encrypted(userRows[i].TITLE);
            userData.DIVISI = encrypted(userRows[i].DIVISI);
            userData.JABATAN = encrypted(userRows[i].JABATAN);
            userData.STATUS = encrypted(userRows[i].STATUS);
            userData.EXCEPTION = encrypted(userRows[i].EXCEPTION);

            if (!usernameList.includes(username)){
              if (type === "INSTA") {                  
                userData.TIKTOK = encrypted(userRows[i].TIKTOK);
                userData.INSTA = encrypted(username);
              } else if (type === "TIKTOK") {
                userData.INSTA = encrypted(userRows[i].INSTA);
                userData.TIKTOK = encrypted(username);
              }
            } else {

              if (type === "INSTA") {                  
                if(username === userRows[i].INSTA){
                  
                  await myData(clientName, targetKey).then(
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
                  
                  await myData(clientName, targetKey).then(
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

            if (!isContact){
              authorize().then(
                  async auth =>
                    {
                        console.log(await saveGoogleContact(userRows[i].NAMA, `+${phone}`, auth));
                    }
              ).catch(console.error); 
            }

            switch (userRows[i].WHATSAPP) {

              case phone:
                {
                  console.log(
                    'Case ==== phone '
                  );

                  if (phone === "6281235114745") {

                    userData.WHATSAPP = encrypted("");
                    writeFileSync(`json_data_file/user_data/${clientName}/${sourceKey}.json`, JSON.stringify(userData));
                    await myData(clientName, targetKey).then(
                      response => resolve (response)
                    ).catch(
                      response => reject (response)
                    );
    
                  } else {
    
                    writeFileSync(`json_data_file/user_data/${clientName}/${sourceKey}.json`, JSON.stringify(userData));
                    await myData(clientName, targetKey).then(
                      response => resolve (response)
                    ).catch(
                      response => reject (response)
                    );
                  }
                }
                break;
       
              default:
                {
                  if (phoneList.includes(phone)) {

                    if (phone === "6281235114745") {
                      userData.WHATSAPP = encrypted("");

                      writeFileSync(`json_data_file/user_data/${clientName}/${targetKey}.json`, JSON.stringify(userData));
                      await myData(clientName, targetKey).then(
                        response => resolve (response)
                      ).catch(
                        response => reject (response)
                      );
                    } else {

                      if (phone !== userRows[i].WHATSAPP ){

                          
                        let responseData = {
                          data: 'Nomor Whatsapp anda sudah terdaftar dengan akun lain, hubungi admin untuk perubahan',
                          state: true,
                          code: 201
                        };
                        reject (responseData); 

                      }

                    }                 
                  } else {
                    
                    if (phone === "6281235114745") {
                      userData.WHATSAPP = encrypted("");
                      writeFileSync(`json_data_file/user_data/${clientName}/${targetKey}.json`, JSON.stringify(userData));
                      await myData(clientName, targetKey).then(
                        response => resolve (response)
                      ).catch(
                        response => reject (response)
                      );
                    } else {

                      userData.WHATSAPP = encrypted(phone);
                      writeFileSync(`json_data_file/user_data/${clientName}/${targetKey}.json`, JSON.stringify(userData));
                      await myData(clientName, targetKey).then(
                        response => resolve (response)
                      ).catch(
                        response => reject (response)
                      );
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
      console.log(error)
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