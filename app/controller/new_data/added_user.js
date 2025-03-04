import { myData } from '../read_data/read_my_data.js';
import { newListValueData } from '../../module/data_list_query.js';
import { encrypted } from '../../module/crypto.js';
import { writeFileSync } from "fs";
import { readUser } from '../read_data/read_data_from_dir.js';
import { logsError } from '../../view/logs_whatsapp.js';

export async function addNewUser(clientName, idKey, name, divisi, jabatan, title){

  return new Promise(async (resolve, reject) => {

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
      ).catch(
        error => reject(error)
      )

      let divisiList = new Array();

      await newListValueData(
        clientName, 
        'DIVISI'
      ).then(
        async response =>{
          divisiList =  response.data;
        }
      ).catch(
        error => reject(error)
      )
      
      console.log(divisiList)

      if (divisiList.includes(divisi)) {

        if (!idExist) {
          //Get Target Sheet Documents by Title
          let userData = new Object();

          userData.ID_KEY = encrypted(idKey);
          userData.NAMA = encrypted(name);
          userData.TITLE = encrypted(title);
          userData.DIVISI = encrypted(divisi);
          userData.JABATAN = encrypted(jabatan);
          userData.STATUS = encrypted("TRUE");
          userData.WHATSAPP = encrypted("");
          userData.INSTA = encrypted("");
          userData.TIKTOK = encrypted("");
          userData.EXCEPTION = encrypted("FALSE");

          writeFileSync(`json_data_file/user_data/${clientName}/${parseInt(idKey)}.json`, JSON.stringify(userData));
              
          await myData(
            clientName, 
            parseInt(idKey)

          ).then(
            response => resolve (response)
          ).catch(
            error => reject (error)
          )
                  
        } else {
  
          await myData(
            clientName, 
            parseInt(idKey)
          ).then(
            response => resolve (response)
          ).catch(
            error => reject (error)
          )

        }

      } else {

        await propertiesView(
            clientName, 
            "DIVISI"
        ).then(
            response => resolve (response)
          ).catch(
            error => reject (error)
          )
      }
    } catch (error) {

      logsError(error);
      let responseData = {
        data: error,
        state: false,
        code: 303
      };
  
      reject (responseData);
    }
    
  });

}