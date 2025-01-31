import { myData } from '../../database_query/myData.js';
import { newListValueData } from '../new_query/data_list_query.js';
import { encrypted } from '../../encryption/crypto.js';
import { writeFileSync } from "fs";
import { readUser } from '../../restore/user_data/read_data_from_dir.js';

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

      let divisiList = [];

      await newListValueData(
        clientName, 
        'DIVISI'
      ).then(
        async response =>{
          divisiList = await response;
        }
      ).catch(
        error => reject(error)
      )

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

      logsResponse(error);
      let responseData = {
        data: error,
        state: false,
        code: 303
      };
  
      reject (responseData);
    }
    
  });

}