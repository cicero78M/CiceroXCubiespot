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

            postItems.forEach(postelement => {

              let itemDate = new Date(postelement.taken_at * 1000);
            
              if (itemDate.toLocaleDateString("en-US", {timeZone: "Asia/Jakarta"}) === localDate) {
            
                hasContent = true;
                itemByDay.push(postelement);
                todayItems.push(postelement.code);
            
              }
              
            });
            

    
            if (hasContent) {
    
              logsSave(`${clientName} Official Account Has Post Data...`);

              itemByDay.forEach(itemselement => {
                
                let dataObject = new Object();

                dataObject.TIMESTAMP = encrypted((itemselement.taken_at).toString());
                dataObject.USER_ACCOUNT = encrypted(itemselement.user.username);
                dataObject.SHORTCODE = encrypted(itemselement.code); 
                dataObject.ID = encrypted(itemselement.id);
                dataObject.TYPE = encrypted(itemselement.media_name);
                dataObject.CAPTION = encrypted(itemselement.caption.text);
                dataObject.COMMENT_COUNT = encrypted((itemselement.comment_count ? (itemselement.comment_count).toString() : null));
                dataObject.LIKE_COUNT = encrypted((itemselement.like_count ? (itemselement.like_count).toString() : null));
                dataObject.PLAY_COUNT = encrypted((itemselement.play_count ? (itemselement.play_count).toString() : null));

                try {
                  writeFileSync(`json_data_file/insta_data/insta_content/${clientName}/${itemselement.code}.json`, JSON.stringify(dataObject));
                } catch (error) {
                  mkdirSync(`json_data_file/insta_data/insta_content/${clientName}`);
                  writeFileSync(`json_data_file/insta_data/insta_content/${clientName}/${itemselement.code}.json`, JSON.stringify(dataObject));
                }
  
                logsSave("Insta Content Updated");
                
              });
            

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