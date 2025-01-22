import { myData } from '../../database_query/myData.js';
import { newListValueData } from '../new_query/data_list_query.js';
import { readUser } from '../../../json_data_file/user_data/read_data_from_dir.js';
import { encrypted } from '../../../json_data_file/crypto.js';
import { writeFileSync } from "fs";


export async function addNewUser(clientName, idKey, name, divisi, jabatan, title){

  try {

    let idExist = false;
    let userRows;

    await readUser(
      clientName
    ).then( 
      async response => {    
        userRows = await response;                           
        for (let i = 0; i < userRows.length; i++) {
          if (parseInt(userRows[i].ID_KEY) === parseInt(idKey) ){
            idExist = true;
          }
        } 
      }
    );

    let divisiList = [];

    await newListValueData(
      clientName, 
      'DIVISI'
    ).then(
      async response =>{
        divisiList = await response;
      }
    );

    if (divisiList.includes(divisi)) {

      if (!idExist) {
        console.log("Id key not exist");
        //Get Target Sheet Documents by Title
        let userData = new Object();

        userData.ID_KEY = encrypted(parseInt(idKey));
        userData.NAMA = encrypted(name);
        userData.TITLE = encrypted(title);
        userData.DIVISI = encrypted(divisi);
        userData.JABATAN = encrypted(jabatan);
        userData.STATUS = encrypted(true);
        userData.WHATSAPP = encrypted(null);
        userData.INSTA = encrypted(null);
        userData.TIKTOK = encrypted(null);
        userData.EXCEPTION = encrypted(false);

        writeFileSync(`json_data_file/user_data/${clientName}/${parseInt(idKey)}.json`, JSON.stringify(userData));

        resolve (`${dataKey} JSON Data Successfully Added.`);
            
        let responseMyData = await myData(
          clientName, 
          parseInt(idKey)
        );
          
      return responseMyData;
      
      } else {
 
        let responseMyData = await myData(
          clientName, 
          parseInt(idKey)
        );

        return responseMyData;

      }

    } else {

      console.log('Return Divisi Tidak Terdaftar');

      await propertiesView(
          clientName, 
          "DIVISI"
      ).then(
        response =>
          resolve (response)
      )
    }
  } catch (error) {

    console.log(error);
    let responseData = {
      data: error,
      state: false,
      code: 303
    };
 
    return responseData;
  }
}