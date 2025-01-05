import { GoogleSpreadsheet } from 'google-spreadsheet';
import { ciceroKey, googleAuth } from '../../database/new_query/sheet_query.js';
import { instaLikesAPI } from '../../socialMediaAPI/instaAPI.js';
import { client } from '../../../app.js';

export async function getInstaLikes(todayItems, clientValue ) {

    console.log("Generate Username Insta Likes");

    const clientName = clientValue.get('CLIENT_ID');

    var newData = 0;
    var updateData = 0;

    let newDataUsers = [];

    let hasShortcode = false;
    
    return new Promise(async (resolve, reject) => {
      
      try { 


        const instaLikesUsernameDoc = new GoogleSpreadsheet(ciceroKey.dbKey.instaLikesUsernameID, googleAuth); //Google Authentication for instaLikes Username DB
        await instaLikesUsernameDoc.loadInfo(); // loads document properties and worksheets
        let instaLikesUsernameSheet = instaLikesUsernameDoc.sheetsByTitle[clientName];
        let instaLikesUsernameData = await instaLikesUsernameSheet.getRows();

        for (let i = 0; i < todayItems.length; i++) {
          
          for (let ii = 0; ii < instaLikesUsernameData.length; ii++) {
            
            if (instaLikesUsernameData[ii].get('SHORTCODE') === todayItems[i]) {
              hasShortcode = true;

              newDataUsers =[];
        
              const fromRows = Object.values(instaLikesUsernameData[ii].toObject());

              for (let iii = 0; iii < fromRows.length; iii++) {
                if (fromRows[iii] != undefined || fromRows[iii] != null || fromRows[iii] != "") {
                  if (!newDataUsers.includes(fromRows[iii])) {
                    newDataUsers.push(fromRows[iii]);
                  }
                }
              }
          
              await instaLikesAPI(todayItems[i]).then(async response =>{
                const likesItems = await response.data.data.items;
                for (let iii = 0; iii < likesItems.length; iii++) {
                  if (likesItems[iii].username != undefined || likesItems[iii].username != null || likesItems[iii].username != "") {
                    if (!newDataUsers.includes(likesItems[iii].username)) {
                      newDataUsers.push(likesItems[iii].username);
                    }
                  }
                }
              
              }).catch(
                error =>{
                  let data = {
                    data: error,
                    state: false,
                    code: 303
                  };

                  reject (data);
                }
              );
              await instaLikesUsernameData[ii].delete();
              await instaLikesUsernameSheet.addRow(newDataUsers);
        
              console.log(`${clientName} Update Data ${todayItems[i]}`);
              await client.sendMessage('6281235114745@c.us', `${clientName} Update Data https://www.instagram.com/p/${todayItems[i]}`);
    
              updateData++;

            }
          }

          //Final Code
          if (!hasShortcode) {
            //If Shortcode doesn't exist push new data
            await instaLikesAPI(todayItems[i]).then(async response =>{
              let likesItems = await response.data.data.items;
              let userNameList = [todayItems[i]];
          
              for (let iii = 0; iii < likesItems.length; iii++) {
                if ('username' in likesItems[iii]) {
                  userNameList.push(likesItems[iii].username);
                }
              }
              //Add new Row              
              await instaLikesUsernameSheet.addRow(userNameList);
          
              console.log(`${clientName} Insert New Data ${todayItems[i]}`);
              await client.sendMessage('6281235114745@c.us', `${clientName} Insert New Data https://www.instagram.com/p/${todayItems[i]}`);
              newData++;

            }).catch(
              error =>{
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

        instaLikesUsernameDoc.delete;
        resolve(data);
        
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







