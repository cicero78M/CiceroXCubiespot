import { myData } from '../read_data/read_my_data.js';
import { propertiesView } from '../../view/properties_view.js';
import { readFileSync, writeFileSync } from "fs";
import { encrypted } from '../../module/crypto.js';
import { newListValueData } from '../../module/data_list_query.js';
import { readUser } from '../read_data/read_data_from_dir.js';
import { authorize, saveGoogleContact, searchbyNumbers } from '../../module/g_contact_api.js';

//This Function for edit user data profile
export async function editProfile(clientName, idKey, newData, phone, type, isContact) {
  return new Promise(async (resolve, reject) => {
    try {
      let data;
      let isDataExist = false;
      let userRows = [];
      let dataList = [];
      let phoneList = [];
      let userData = new Object();

      await newListValueData(
        clientName, 
        type
      ).then(
        async response =>{
          dataList = await response.data;
        }
      ).catch(
        error =>{
          reject (error);   
        } 
      );
  
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
  
      await readUser(
        clientName
      ).then( 
        async response => {    
          userRows = await response.data;                           
          for (let i = 0; i < userRows.length; i++) {

            let sourceKey;
            let targetKey;
            
            if(process.env.APP_CLIENT_TYPE === "RES"){
              sourceKey = parseInt(userRows[i].ID_KEY);
              targetKey = parseInt(idKey);
            } else {
              sourceKey = userRows[i].ID_KEY;
              targetKey = idKey.toUpperCase();
              console.log(targetKey);
            }

            if (sourceKey === targetKey ){
              
              idExist = true;  
              userData = JSON.parse( readFileSync(`json_data_file/user_data/${clientName}/${targetKey}.json`));
            
            }
          } 
        }
      ).catch(
        error => reject (error)
      );

  
      for (let ii = 0; ii < userRows.length; ii++) {

        let sourceKey;
        let targetKey;
        
        if(process.env.APP_CLIENT_TYPE === "RES"){
          sourceKey = parseInt(userRows[ii].ID_KEY);
          targetKey = parseInt(idKey);
        } else {
          sourceKey = userRows[ii].ID_KEY;
          targetKey = idKey.toUpperCase();;
        }

        if (sourceKey === targetKey) {
  
          userData.ID_KEY = encrypted(userRows[ii].ID_KEY.toUpperCase());
          userData.NAMA = encrypted(userRows[ii].NAMA);
          userData.TITLE = encrypted(userRows[ii].TITLE);
          userData.DIVISI = encrypted(userRows[ii].DIVISI);
          userData.JABATAN = encrypted(userRows[ii].JABATAN);
          userData.STATUS = encrypted(userRows[ii].STATUS);
          userData.INSTA = encrypted(userRows[ii].INSTA);
          userData.TIKTOK = encrypted(userRows[ii].TIKTOK);
          userData.WHATSAPP = encrypted(userRows[ii].WHATSAPP);
          userData.EXCEPTION = encrypted(userRows[ii].EXCEPTION);
  
          isDataExist = true;
  
          if (type === 'DIVISI') {

            console.log("Div Executed")
            if (dataList.includes(newData)) {
              userData.DIVISI = encrypted(newData);
            } else {
              propertiesView(clientName, "DIVISI").then(
                response => {
                  resolve(response);    
                  console.log(response.data);
                }             
              ).catch(
                error=>reject(error)
              )
            }
  
          } else if (type === 'JABATAN') {
            userData.JABATAN = encrypted(newData);
          } else if (type === 'NAMA') {
            userData.NAMA = encrypted(newData);
          } else if (type === 'ID_KEY') {
            userData.ID_KEY = encrypted(targetKey);
          } else if (type === 'TITLE') {
  
            if (dataList.includes(newData)) {
              userData.TITLE = encrypted(newData);
            } else {
              propertiesView(clientName, type).then(
                response => resolve(response)                 
              ).catch(
                error=>reject(error)
              )
            }
  
          } else if (type === 'STATUS') {
            userData.STATUS = encrypted(newData);
          } else if (type === 'EXCEPTION') {
            userData.EXCEPTION = encrypted(newData);
          } 
  
          if (userRows[ii].STATUS === "TRUE") { 

            switch (userRows[ii].WHATSAPP) {
              case phone:
                {

                  if (phone === "6281235114745"){

                    userData.WHATSAPP = encrypted("");

                    writeFileSync(`json_data_file/user_data/${clientName}/${targetKey}.json`, JSON.stringify(userData));
        
                    await myData(clientName, idKey).then(
                      response => resolve(response)
                    ).catch(
                      error => reject(error)
                    );

                  } else {

                    writeFileSync(`json_data_file/user_data/${clientName}/${targetKey}.json`, JSON.stringify(userData));
  
                    await myData(clientName, targetKey).then(
                      response => resolve(response)
                    ).catch(
                      error => reject(error)
                    );
                  }
                }
                break;
              default:
                {
                  if  (phoneList.includes(phone)) {
                      
                    if (phone === "6281235114745"){

                      userData.WHATSAPP = encrypted("");

                      writeFileSync(`json_data_file/user_data/${clientName}/${targetKey}.json`, JSON.stringify(userData));
          
                      await myData(clientName, idKey).then(
                        response => resolve(response)
                      ).catch(
                        error => reject(error)
                      );
                    } else {

                      if (phone !== userRows[ii].WHATSAPP ){

                        data = {
                          data: 'Nomor Whatsapp anda sudah terdaftar dengan akun lain',
                          state: true,
                          code: 201
                        };
                        reject (data);
                      }
                    }
                  } else {   

                    if (phone === "6281235114745"){
                      userData.WHATSAPP = encrypted("");
                      writeFileSync(`json_data_file/user_data/${clientName}/${targetKey}.json`, JSON.stringify(userData));          
                      await myData(clientName, idKey).then(
                        response => resolve(response)
                      ).catch(
                        error => reject(error)
                      );
                    } else {
                      userData.WHATSAPP = encrypted(phone);
                      writeFileSync(`json_data_file/user_data/${clientName}/${targetKey}.json`, JSON.stringify(userData));          
                      await myData(clientName, idKey).then(
                        response => resolve(response)
                      ).catch(
                        error => reject(error)
                      );
                      if (!isContact){
                        authorize().then(
                            async auth =>
                
                              {
                                console.log(await saveGoogleContact(userRows[ii].NAMA, `+${phone}`, auth));
                                console.log(await searchbyNumbers(`+${phone}`, auth));
                              }
                        ).catch(console.error); 
                      }
                    }       
                  }
                }
                break;
            }
          } else {
            data = {
              data: 'Your Account Suspended',
              state: true,
              code: 201
            };
            reject (data);          
          }
        }
      }
  
      if (!isDataExist) {
        data = {
          data: 'User Data with delegated ID_KEY Doesn\'t Exist',
          state: true,
          code: 201
        };
        reject (data);
      }

    } catch (error) {
      console.log(error);
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