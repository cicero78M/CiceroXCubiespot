import { client } from "../../../app.js";
import { instaInfoAPI } from "../../module/insta_API.js";
import { decrypted } from '../../module/crypto.js';
import { mkdirSync, writeFileSync } from "fs";
import { logsSave } from "../../view/logs_whatsapp.js";

export async function getInstaUserInfo(clientValue) {

  //Date Time

  const clientName = decrypted(clientValue.CLIENT_ID);
  let instaAccount;

  instaAccount = decrypted(clientValue.INSTAGRAM);
  
  logsSave(`${clientName} ${type } Collecting Insta Post Starting...`);
  await client.sendMessage('6281235114745@c.us', `${clientName} ${type } Collecting Insta Post Starting...`);

  return new Promise(async (resolve, reject) => {

    try {

        await instaInfoAPI(instaAccount).then( async response =>{

            let objectData = response;

            try {
                writeFileSync(`json_data_file/user_info/insta/${clientName}.json`, JSON.stringify(objectData));
              } catch (error) {
                mkdirSync(`json_data_file/user_info/insta/`);
                writeFileSync(`json_data_file/user_info/insta/${clientName}.json`, JSON.stringify(objectData));
              }

              logsSave(clientName+" Insta User Info Updated");
              let data = {
                data: clientName+" Insta User Info Updated",
                state: true,
                code: 200
              };
  
              resolve (data);

          }).catch(error =>{
          
            let data = {
              data: error,
              message: "generate Insta Post Error",
              state: false,
              code: 303
            };

            reject (data);
          
          });

    } catch (error) {
      let data = {
        data: error,
        message: "generate Insta User Info Error",
        state: false,
        code: 303
      };
      reject (data);
    }   
  });
}