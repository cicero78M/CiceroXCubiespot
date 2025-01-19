import { instaLikesAPI } from '../../socialMediaAPI/insta_API.js';
import { client } from '../../../app.js';
import { decrypted, encrypted } from '../../../json_data_file/crypto.js';

export async function getInstaLikes(todayItems, clientValue ) {

    console.log("Generate Username Insta Likes");

    const clientName = decrypted(clientValue.get('CLIENT_ID'));

    let newData = 0;
    let updateData = 0;
    let newDataUsers = [];

    let hasShortcode = false;
    
    return new Promise(async (resolve, reject) => {
      
      try { 

        let datax = readdirSync(`json_data_file/insta_data/insta_likes/${clientName}`);

        for (let i = 0; i < todayItems.length; i++) {
          
          for (let ii = 0; ii < datax.length; ii++) {
            
            if (todayItems[i] === (datax[ii]).replace(".json", "")) {

              console.log("Data Exist")

              hasShortcode = true;

              newDataUsers =[];
        
              let fromRows = JSON.parse(readFileSync(`json_data_file/insta_data/insta_likes/${clientName}/${datax[ii]}`));

              for (let iii = 0; iii < fromRows.length; iii++) {
                if (decrypted(fromRows[iii]) != undefined || decrypted(fromRows[iii]) != null || decrypted(fromRows[iii]) != "") {
                  if (!newDataUsers.includes(decrypted(fromRows[iii]))) {
                    newDataUsers.push(decrypted(fromRows[iii]));
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

                  let encryptedData = []

                  for (let iii = 0; iii < newDataUsers.length; iii++) {
                    encryptedData.push(encrypted(newDataUsers[iii]));
                  }

                  try {
                    writeFileSync(`json_data_file/insta_data/insta_likes/${clientName}/${todayItems[i]}.json`, JSON.stringify(encryptedData));
                  } catch (error) {
                    mkdirSync(`json_data_file/insta_data/insta_likes/${clientName}`);
                    writeFileSync(`json_data_file/insta_data/insta_likes/${clientName}/${todayItems[i]}.json`, JSON.stringify(encryptedData));
                  }    

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

              console.log(`${clientName} Update Data ${todayItems[i]}`);
              await client.sendMessage('6281235114745@c.us', `${clientName} Update Data https://www.instagram.com/p/${todayItems[i]}`);
    
              updateData++;

            }
          }

          //Final Code
          if (!hasShortcode) {
            //If Shortcode doesn't exist push new data
            await instaLikesAPI(todayItems[i]).then(
              async response =>{
                let likesItems = await response.data.data.items;
                let encryptedData = [];
            
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