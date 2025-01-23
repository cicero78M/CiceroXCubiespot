import { myData } from '../../database_query/myData.js';
import { propertiesView } from '../../view/properties_view.js';
import { client } from '../../../app.js';
import { readUser } from '../../../json_data_file/user_data/read_data_from_dir.js';
import { readFileSync, writeFileSync } from "fs";
import { encrypted } from '../../../json_data_file/crypto.js';
import { newListValueData } from '../new_query/data_list_query.js';


//This Function for edit user data profile
export async function editProfile(clientName, idKey, newData, phone, type) {
  try {
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
        dataList = await response;
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
          if (parseInt(userRows[i].ID_KEY) === idKey ){
            
            idExist = true;

            userData = JSON.parse( readFileSync(`json_data_file/user_data/${clientName}/${parseInt(idKey)}.json`));
          
          }
        } 
      }
    );

    for (let ii = 0; ii < userRows.length; ii++) {
      if (parseInt(userRows[ii].ID_KEY) === parseInt(idKey)) {

        userData.ID_KEY = encrypted(userRows[ii].ID_KEY);
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
            if (dataList.includes(newData)) {
              userData.DIVISI = encrypted(newData);
            } else {
              propertiesView(clientName, "DIVISI").then(
                async response =>{
                  client.sendMessage(phone+'@c.us', response.data);
                }
              ).catch(
                error =>{
                  console.log(error);
                  let responseData = {
                    data: "Divisi Unregistred",
                    state: true,
                    code: 200
                  };
                  client.sendMessage(phone+'@c.us', responseData.data);
                }
              )
            }

          } else if (type === 'JABATAN') {
            userData.JABATAN = encrypted(newData);
          } else if (type === 'NAMA') {
            userData.NAMA = encrypted(newData);
          } else if (type === 'ID_KEY') {
            userData.ID_KEY = encrypted(newData);
          } else if (type === 'TITLE') {

            if (dataList.includes(newData)) {
              userData.TITLE = encrypted(newData);
            } else {
              let responseData = await propertiesView(clientName, type);
              return responseData;
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
 
                userData.WHATSAPP = encrypted(phone);

                writeFileSync(`json_data_file/user_data/${clientName}/${parseInt(idKey)}.json`, JSON.stringify(userData));

                let responseMyData = await myData(clientName, idKey);
                
                return responseMyData;
              }
            case "6281235114745":
              {

                userData.WHATSAPP = encrypted("");

                writeFileSync(`json_data_file/user_data/${clientName}/${parseInt(idKey)}.json`, JSON.stringify(userData));

                responseMyData = await myData(clientName, idKey);
                
                return responseMyData;
              }             
              
            default:
              {
                if  (!phoneList.includes(phone)) {

                    userData.WHATSAPP = encrypted(phone);

                    writeFileSync(`json_data_file/user_data/${clientName}/${parseInt(idKey)}.json`, JSON.stringify(userData));
        
                    let responseMyData = await myData(clientName, idKey);
                    
                    return responseMyData;
        
                } else {
                  
                  let responseData = {
                    data: 'Ubah data dengan menggunakan Nomor Whatsapp terdaftar',
                    state: true,
                    code: 201
                  };
                  
                  console.log('Return Whatsapp Used');
                  return responseData;
                
                }
              }
          }

        } else {

          let responseData = {
            data: 'Your Account Suspended',
            state: true,
            code: 201
          };

          console.log('Return Account Suspended');
          return responseData;
        
        }

      }
    }

    if (!isDataExist) {

      let responseData = {
        data: 'User Data with delegated ID_KEY Doesn\'t Exist',
        state: true,
        code: 201
      };
      console.log('Return No ID_Key');
      return responseData;
    }

  } catch (error) {

    let responseData = {
      data: error,
      state: false,
      code: 303
    };

    console.log(error);
    return responseData;

  }
}