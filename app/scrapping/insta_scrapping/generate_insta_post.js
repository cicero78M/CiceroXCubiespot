import { client } from "../../../app.js";
import { instaPostAPI } from "../../socialMediaAPI/insta_API.js";
import { decrypted } from '../../../json_data_file/crypto.js';
import { mkdirSync, writeFileSync } from "fs";

export async function getInstaPost(clientValue) {
  //Date Time
  let d = new Date();
  let localDate = d.toLocaleDateString("en-US", {timeZone: "Asia/Jakarta"});   

  const clientName = decrypted(clientValue.get('CLIENT_ID'));
  const instaAccount = decrypted(clientValue.get('INSTAGRAM'));

  console.log(clientName + " Collecting Insta Post Starting...");
  await client.sendMessage('6281235114745@c.us', `${clientName} Collecting Insta Post Starting...`);

  let shortcodeUpdateCounter = 0;
  let shortcodeNewCounter = 0;

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
            
            let officialInstaSheet;
            let officialInstaData;
            
            let shortcodeList = [];
  
            for (let i = 0; i < officialInstaData.length; i++) {
              if (!shortcodeList.includes(officialInstaData[i].get('SHORTCODE'))) {
                shortcodeList.push(officialInstaData[i].get('SHORTCODE'));
              }
            }
            //Check if Database Contains Shortcode Items        
            let hasShortcode = false;
            
            for (let i = 0; i < itemByDay.length; i++) {
              if (shortcodeList.includes(itemByDay[i].code)) {
                hasShortcode = true;
              }
            }

            //If Database Contains Shortcode 
            if (hasShortcode) {
              for (let i = 0; i < itemByDay.length; i++) {
                for (let ii = 0; ii < officialInstaData.length; ii++) {
                  if (officialInstaData[ii].get('SHORTCODE') === itemByDay[i].code) {
                    //Update Existing Content Database                
                    officialInstaData[ii].assign({
                      TIMESTAMP: itemByDay[i].taken_at, USER_ACCOUNT: itemByDay[i].user.username, SHORTCODE: itemByDay[i].code, ID: itemByDay[i].id,
                      TYPE: itemByDay[i].media_name, CAPTION: itemByDay[i].caption.text, COMMENT_COUNT: itemByDay[i].comment_count, LIKE_COUNT: itemByDay[i].like_count,
                      PLAY_COUNT: itemByDay[i].play_count
                    }); // Jabatan Divisi Value
                    await officialInstaData[ii].save(); //save update
                    shortcodeUpdateCounter++;
                  } else if (!shortcodeList.includes(itemByDay[i].code)) {
                    //Push New Content to Database  
                    shortcodeList.push(itemByDay[i].code);
                    await officialInstaSheet.addRow({
                      TIMESTAMP: itemByDay[i].taken_at, USER_ACCOUNT: itemByDay[i].user.username, SHORTCODE: itemByDay[i].code, ID: itemByDay[i].id, TYPE: itemByDay[i].media_name,
                      CAPTION: itemByDay[i].caption.text, COMMENT_COUNT: itemByDay[i].comment_count, LIKE_COUNT: itemByDay[i].like_count, PLAY_COUNT: itemByDay[i].play_count
                    });
                    shortcodeNewCounter++;
                  }
                }
              }
            } else {
              //Push New Shortcode Content to Database
              for (let i = 0; i < itemByDay.length; i++) {
              
                try {

                  writeFileSync(`json_data_file/insta_data/insta_content${clientName}/${itemByDay[i].code}.json`, JSON.stringify(itemByDay[i]));
        
                } catch (error) {
      
                  mkdirSync(`json_data_file/insta_data/insta_content${clientName}`);
                  writeFileSync(`json_data_file/insta_data/insta_content${clientName}/${itemByDay[i].code}.json`, JSON.stringify(itemByDay[i]));
                    
                }

                shortcodeNewCounter++;
                resolve (`${dataKey} JSON Data Successfully Added.`);
              
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