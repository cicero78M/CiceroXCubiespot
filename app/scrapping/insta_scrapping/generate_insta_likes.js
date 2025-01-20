import { instaLikesAPI } from '../../socialMediaAPI/insta_API.js';
import { client } from '../../../app.js';
import { decrypted, encrypted } from '../../../json_data_file/crypto.js';
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "fs";

export async function getInstaLikes(todayItems, clientValue ) {

    const clientName = decrypted(clientValue.get('CLIENT_ID'));

    let newData = 0;
    let updateData = 0;
    let newDataUsers = [];
    let encryptedData = []                

    let hasShortcode = false;

    console.log(`${clientName} Generate Username Insta Likes`);
    
    return new Promise(async (resolve, reject) => {
      
      try { 

        let instaLikesDir = readdirSync(`json_data_file/insta_data/insta_likes/${clientName}`);

        for (let i = 0; i < todayItems.length; i++) {
          
          for (let ii = 0; ii < instaLikesDir.length; ii++) {
            
            if (todayItems[i] === (instaLikesDir[ii]).replace(".json", "")) {

              hasShortcode = true;

              newDataUsers =[];
        
              let instaLikes = await JSON.parse(readFileSync(`json_data_file/insta_data/insta_likes/${clientName}/${instaLikesDir[ii]}`));

              for (let iii = 0; iii < instaLikes.length; iii++) {
                if (decrypted(instaLikes[iii]) != undefined || decrypted(instaLikes[iii]) != null || decrypted(instaLikes[iii]) != "") {
                  if (!newDataUsers.includes(decrypted(instaLikes[iii]))) {
                    newDataUsers.push(decrypted(instaLikes[iii]));
                  }
                }
              }
          
              await instaLikesAPI(todayItems[i]).then(
                async response =>{

                  const likesItems = await response.data.data.items;
                
                  for (let iii = 0; iii < likesItems.length; iii++) {
                    if (likesItems[iii].username !== undefined || likesItems[iii].username !== null || likesItems[iii].username !== "") {
                      if (!newDataUsers.includes(likesItems[iii].username)) {
                        newDataUsers.push(likesItems[iii].username);
                      }
                    }
                  }

                  for (let iii = 0; iii < newDataUsers.length; iii++) {
                    encryptedData.push(encrypted(newDataUsers[iii]));
                  }

                  try {
                    writeFileSync(`json_data_file/insta_data/insta_likes/${clientName}/${todayItems[i]}.json`, JSON.stringify(encryptedData));
                  } catch (error) {
                    mkdirSync(`json_data_file/insta_data/insta_likes/${clientName}`);
                    writeFileSync(`json_data_file/insta_data/insta_likes/${clientName}/${todayItems[i]}.json`, JSON.stringify(encryptedData));
                  }    

                  console.log(`${clientName} Update Data https://www.instagram.com/p/${todayItems[i]}`);
                  
                  await client.sendMessage('6281235114745@c.us', `${clientName} Update Data https://www.instagram.com/p/${todayItems[i]}`);
        
                  updateData++;

                }
              ).catch(
                async error =>{
                  let data = {
                    data: error,
                    state: false,
                    code: 303
                  };
                  reject (data);
                }
              );
            }
          }

          //Final Code
          if (!hasShortcode) {
            //If Shortcode doesn't exist push new data
            await instaLikesAPI(todayItems[i]).then(
              async response =>{
                let likesItems = await response.data.data.items;
            
                for (let iii = 0; iii < likesItems.length; iii++) {
                  if ('username' in likesItems[iii]) {
                    encryptedData.push(encrypted(likesItems[iii].username));
                  }
                }
                
                try {
                  writeFileSync(`json_data_file/insta_data/insta_likes/${clientName}/${todayItems[i]}.json`, JSON.stringify(encryptedData));
                } catch (error) {
                  mkdirSync(`json_data_file/insta_data/insta_likes/${clientName}`);
                  writeFileSync(`json_data_file/insta_data/insta_likes/${clientName}/${todayItems[i]}.json`, JSON.stringify(encryptedData));
                }    

                console.log(`${clientName} Insert New Data ${todayItems[i]}`);
                
                await client.sendMessage('6281235114745@c.us', `${clientName} Insert New Data https://www.instagram.com/p/${todayItems[i]}`);
                
                newData++;

              }
            ).catch(
              async error =>{
                let data = {
                  data: error,
                  state: false,
                  code: 303
                };
                reject (data);
              
              }
            );
          }
        }

        let data = {
          data: 'Succes Reload Insta Data : ' + todayItems.length + '\n\nNew Content : ' + newData + '\nUpdate Content : ' + updateData,
          state: true,
          code: 200
        };

        resolve(data);
        
      } catch (error) {
        let data = {
          data: error,
          state: false,
          code: 303
        };
        reject (data);
      }
    }
  );
}