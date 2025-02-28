import { myData } from '../read_data/read_my_data.js';
import { propertiesView } from '../../view/properties_view.js';
import { writeFileSync } from "fs";
import { encrypted } from '../../module/crypto.js';
import { newListValueData } from '../../module/data_list_query.js';
import { readUser } from '../read_data/read_data_from_dir.js';
import { authorize, saveGoogleContact, searchbyNumbers } from '../../module/g_contact_api.js';
import { logsUserSend } from '../../view/logs_whatsapp.js';

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

      //Data List by Type
      await newListValueData(clientName, type).then(
        async response =>{
          dataList = await response.data;
        }
      ).catch(
        error =>reject (error)
      );
  
      //Data list Whatsapp Number
      await newListValueData(clientName, "WHATSAPP").then(
        async response =>{
          phoneList = await response.data;
        }
      ).catch(
        error => reject (error) 
      );

      await readUser(clientName).then( async response => {   

        userRows = await response.data;                             
        userRows.forEach(element => {

            let sourceKey;
            let targetKey;
            let testData = false;
            
            if(process.env.APP_CLIENT_TYPE === "RES"){
            sourceKey = parseInt(element.ID_KEY);
            targetKey = parseInt(idKey);
            } else {
            sourceKey = element.ID_KEY;
            targetKey = idKey.toUpperCase();;
            }
    
            if (sourceKey === targetKey) {

                isDataExist = true;

                userData.ID_KEY = encrypted(element.ID_KEY.toUpperCase());
                userData.NAMA = encrypted(element.NAMA);
                userData.TITLE = encrypted(element.TITLE);
                userData.DIVISI = encrypted(element.DIVISI);
                userData.JABATAN = encrypted(element.JABATAN);
                userData.STATUS = encrypted(element.STATUS);
                userData.INSTA = encrypted(element.INSTA);
                userData.TIKTOK = encrypted(element.TIKTOK);
                userData.WHATSAPP = encrypted(element.WHATSAPP);
                userData.EXCEPTION = encrypted(element.EXCEPTION);
            
                if (type === 'DIVISI') {
                  console.log("Div Executed")
                  if (dataList.includes(newData)) {
                    userData.DIVISI = encrypted(newData);
                    testData = true;
                  } else {
                      propertiesView(clientName, "DIVISI").then(
                        response => {
                          logsUserSend(`${phone}@c.us`, response.data);
                        }             
                      ).catch(
                        error=>reject(error)
                      )
                  }
    
                } else if (type === 'JABATAN') {
                    
                  testData = true;
                  userData.JABATAN = encrypted(newData);
                
                } else if (type === 'NAMA') {
              
                  testData = true;
                  userData.NAMA = encrypted(newData);
                
                } else if (type === 'ID_KEY') {
      
                  testData = true;
                  userData.ID_KEY = encrypted(targetKey);
                
                } else if (type === 'TITLE') {
        
                  if (dataList.includes(newData)) {
                    userData.TITLE = encrypted(newData);
                    testData = true;
                  } else {
                    propertiesView(clientName, type).then(
                        response =>
                            logsUserSend(`${phone}@c.us`, response.data)
                    ).catch(
                        error=>reject(error)
                    )
                  }
        
                } else if (type === 'STATUS') {
                
                  testData = true;
                  userData.STATUS = encrypted(newData);
        
                } else if (type === 'EXCEPTION') {
                  
                  testData = true;
                  userData.EXCEPTION = encrypted(newData);
        
                } 
    
                if (testData){            
                  if (element.STATUS === "TRUE") { 
                    switch (element.WHATSAPP) {
                        case phone:
                          {
          
                            if (phone === "6281235114745"){
        
                                userData.WHATSAPP = encrypted("");

                                writeFileSync(`json_data_file/user_data/${clientName}/${targetKey}.json`, JSON.stringify(userData));
                    
                                myData(clientName, idKey).then(
                                    response => resolve(response)
                                ).catch(
                                    error => reject(error)
                                );
        
                            } else {
        
                                writeFileSync(`json_data_file/user_data/${clientName}/${targetKey}.json`, JSON.stringify(userData));
                
                                myData(clientName, targetKey).then(
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
                      
                                  myData(clientName, idKey).then(
                                    response => resolve(response)
                                  ).catch(
                                    error => reject(error)
                                  );
                                
                                } else {
            
                                    if (phone !== element.WHATSAPP ){
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
                                  myData(clientName, idKey).then(
                                    response => resolve(response)
                                  ).catch(
                                    error => reject(error)
                                  );
                                
                                } else {

                                  userData.WHATSAPP = encrypted(phone);

                                  writeFileSync(`json_data_file/user_data/${clientName}/${targetKey}.json`, JSON.stringify(userData));          
                                  
                                  myData(clientName, idKey).then(
                                      response => resolve(response)
                                  ).catch(
                                      error => reject(error)
                                  );

                                  if (!isContact){
                                    authorize().then(
                                      async auth =>
                          
                                        {
                                          console.log(await saveGoogleContact(element.NAMA, `+${phone}`, auth));
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
        });

      }).catch(
        error => reject (error)
      );

      if (!isDataExist) {
        data = {
          data: 'User Data with ID_KEY Doesn\'t Exist',
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