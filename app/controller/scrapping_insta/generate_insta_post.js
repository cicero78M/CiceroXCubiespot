import { client } from "../../../app.js";
import { instaPostAPI } from "../../module/insta_API.js";
import { decrypted, encrypted } from '../../module/crypto.js';
import { mkdirSync, writeFileSync } from "fs";
import { logsSave } from "../../view/logs_whatsapp.js";

export async function getInstaPost(clientValue, type) {

  //Date Time
  let d = new Date();
  let localDate = d.toLocaleDateString("en-US", {timeZone: "Asia/Jakarta"});   

  let executeState = false;

  const clientName = decrypted(clientValue.CLIENT_ID);
  let instaAccount;

  if (type === "official"){
    instaAccount = decrypted(clientValue.INSTAGRAM);
    if (decrypted(clientValue.INSTA_STATE) === 'TRUE'){
      executeState = true;
    }
  } else if(type === "secondary"){
    instaAccount = decrypted(clientValue.INSTA_2);
    if (decrypted(clientValue.INSTA_2_STATE) === 'TRUE'){
      executeState = true;
    }
  }

  let itemByDay = [];
  let todayItems = [];
  let postItems = [];

  let hasContent = false;

  
  logsSave(`${clientName} ${type } Collecting Insta Post Starting...`);
  await client.sendMessage('6281235114745@c.us', `${clientName} ${type } Collecting Insta Post Starting...`);

  return new Promise(async (resolve, reject) => {

    try {

      if (decrypted(clientValue.STATUS) === 'TRUE') {

        if(executeState === true){

          await instaPostAPI(instaAccount).then( async response =>{
        

            postItems = await response.data.data.items;
            
            for (let i = 0; i < postItems.length; i++) {
    
              let itemDate = new Date(postItems[i].taken_at * 1000);
            
              if (itemDate.toLocaleDateString("en-US", {timeZone: "Asia/Jakarta"}) === localDate) {
            
                hasContent = true;
                itemByDay.push(postItems[i]);
                todayItems.push(postItems[i].code);
            
              }
            }
    
            if (hasContent) {
    
              logsSave(`${clientName} Official Account Has Post Data...`);
            
              for (let i = 0; i < itemByDay.length; i++) {

                let dataObject = new Object();

                dataObject.TIMESTAMP = encrypted((itemByDay[i].taken_at).toString());
                dataObject.USER_ACCOUNT = encrypted(itemByDay[i].user.username);
                dataObject.SHORTCODE = encrypted(itemByDay[i].code); 
                dataObject.ID = encrypted(itemByDay[i].id);
                dataObject.TYPE = encrypted(itemByDay[i].media_name);
                dataObject.CAPTION = encrypted(itemByDay[i].caption.text);
                dataObject.COMMENT_COUNT = encrypted((itemByDay[i].comment_count ? (itemByDay[i].comment_count).toString() : null));
                dataObject.LIKE_COUNT = encrypted((itemByDay[i].like_count ? (itemByDay[i].like_count).toString() : null));
                dataObject.PLAY_COUNT = encrypted((itemByDay[i].play_count ? (itemByDay[i].play_count).toString() : null));

                try {
                  writeFileSync(`json_data_file/insta_data/insta_content/${clientName}/${itemByDay[i].code}.json`, JSON.stringify(dataObject));
                } catch (error) {
                  mkdirSync(`json_data_file/insta_data/insta_content/${clientName}`);
                  writeFileSync(`json_data_file/insta_data/insta_content/${clientName}/${itemByDay[i].code}.json`, JSON.stringify(dataObject));
                }
  
                logsSave("Insta Content Updated");
              }

              let data = {
                data: todayItems,
                state: true,
                code: 200
              };
  
              resolve (data);
  
            } else {
              
              let data = {
                data: `${clientName} ${type} Account Has No Insta Content for Today`,
                state: true,
                code: 201
              };
              
              reject (data);
            
            }

          }).catch(error =>{
          
            let data = {
              data: error,
              message: "generate Insta Post Error",
              state: false,
              code: 303
            };

            reject (data);
          
          });

        } else {

          let data = {
            data: clientName + ' Account State False',
            state: true,
            code: 201
          };
          reject (data);

        }
  
      } else {
        let data = {
          data: clientName + 'Your Client ID has Expired, Contacts Developers for more Informations',
          state: true,
          code: 201
        };
        reject (data);
      }
    } catch (error) {
      console.log(error)
      let data = {
        data: error,
        message: "generate Insta Post Error",
        state: false,
        code: 303
      };
      reject (data);
    }   
  });
}