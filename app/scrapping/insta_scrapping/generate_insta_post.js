import { client } from "../../../app.js";
import { instaPostAPI } from "../../socialMediaAPI/insta_API.js";
import { decrypted, encrypted } from '../../../json_data_file/crypto.js';
import { mkdirSync, readdirSync, writeFileSync } from "fs";

export async function getInstaPost(clientValue) {
  //Date Time
  let d = new Date();
  let localDate = d.toLocaleDateString("en-US", {timeZone: "Asia/Jakarta"});   

  const clientName = decrypted(clientValue.get('CLIENT_ID'));
  const instaAccount = decrypted(clientValue.get('INSTAGRAM'));

  console.log(clientName + " Collecting Insta Post Starting...");
  await client.sendMessage('6281235114745@c.us', `${clientName} Collecting Insta Post Starting...`);

  let itemByDay = [];
  let todayItems = [];
  let postItems = [];

  let hasContent = false;

  return new Promise(async (resolve, reject) => {

    try {

      if (decrypted(clientValue.get('STATUS')) === 'TRUE') {
  
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
  
            console.log(`${clientName} Official Account Has Post Data...`);
            await client.sendMessage('6281235114745@c.us', `${clientName} Official Account Has Post Data...`);
            
            let hasShortcode = false;
            
            let datax = readdirSync(`json_data_file/insta_data/insta_content/${clientName}`);

            for (let ix = 0; ix < datax.length; ix++){
              
              if (todayItems.includes(datax[ix].replaceAll('.json', ''))){
                hasShortcode = true;
              }
            }
            
            //If Database Contains Shortcode 
            if (hasShortcode) {

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
              }
            }

            let data = {
              data: todayItems,
              state: true,
              code: 200
            };

            resolve (data);
          } else {
            let data = {
              data: 'Official Account Has No Insta Content for Today',
              state: true,
              code: 201
            };
            resolve (data);
          }
        }).catch(error =>{
          let data = {
            data: error,
            state: false,
            code: 303
          };
          reject (data);
        });
      } else {
        let data = {
          data: clientName + '\n\nYour Client ID has Expired, Contacts Developers for more Informations',
          state: true,
          code: 201
        };
        reject (data);
      }
    } catch (error) {
      let data = {
        data: error,
        state: false,
        code: 303
      };
      reject (data);
    }   
  });
}