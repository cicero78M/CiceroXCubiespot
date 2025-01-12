//Google Spreadsheet
import { GoogleSpreadsheet } from 'google-spreadsheet';

//Local Import
import { ciceroKey, googleAuth } from '../new_query/sheet_query.js';
import { myData } from '../../database_query/myData.js';
import { propertiesView } from '../../view/properties_view.js';
import { client } from '../../../app.js';

//This Function for edit user data profile
export async function editProfile(clientName, idKey, newData, phone, type) {
  try {
    //Insert New Sheet
    const userDoc = new GoogleSpreadsheet(
      ciceroKey.dbKey.userDataID, 
      googleAuth
    ); //Google Auth Constructor
    
    await userDoc.loadInfo(); // loads document properties and worksheets
    const userSheet = userDoc.sheetsByTitle[clientName];
    const userRows = await userSheet.getRows();

    let isDataExist = false;
    let dataList = [];

    //Collect Divisi List String
    for (let i = 0; i < userRows.length; i++) {
      if (!dataList.includes(userRows[i].get(type))) {
        dataList.push(userRows[i].get(type));
      }
    }

    for (let ii = 0; ii < userRows.length; ii++) {
      if (userRows[ii].get('ID_KEY') === idKey) {

        if (userRows[ii].get('WHATSAPP') === "" 
        || userRows[ii].get('WHATSAPP') === phone 
        || phone === "6281235114745") {

          isDataExist = true;

          if (userRows[ii].get('STATUS') === "TRUE") {

            if (type === 'DIVISI') {
              if (dataList.includes(newData)) {
                userRows[ii].assign({ DIVISI: newData });; // Update Divisi Value
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
              userRows[ii].assign({ JABATAN : newData }); // Update Jabatan Value
            } else if (type === 'NAMA') {
              userRows[ii].assign({ NAMA : newData }); // Update Nama Value
            } else if (type === 'ID_KEY') {
              userRows[ii].assign({ ID_KEY : newData}); // Update IDKey Value
            } else if (type === 'TITLE') {

              if (dataList.includes(newData)) {
                userRows[ii].assign({ TITLE: newData }); // Update Title Value
              } else {
                let responseData = await propertiesView(clientName, type);
                return responseData;
              }

            } else if (type === 'STATUS') {
              userRows[ii].assign({ STATUS : newData}); // Update Status Value
            } else if (type === 'EXCEPTION') {
              userRows[ii].assign({ EXCEPTION : newData}); // Update Exception Value
            } else if (type === 'WHATSAPP') {
              userRows[ii].assign({ WHATSAPP : phone}); // Update Status Value
            }

            await userRows[ii].save(); //save update

            let responseMyData = await myData(clientName, idKey);
            
            return responseMyData;

          } else {

            let responseData = {
              data: 'Your Account Suspended',
              state: true,
              code: 201
            };

            console.log('Return Account Suspended');
            return responseData;
          
          }
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