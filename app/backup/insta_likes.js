import { readdirSync, readFileSync } from 'fs';
import { decrypted, encrypted } from '../../json_data_file/crypto.js';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { googleAuth } from '../database/new_query/sheet_query.js';
import { timeout } from 'cron';

export async function instaLikesBackup(clientValue) {

  //Date Time
  let d = new Date();
  let localDate = d.toLocaleDateString("en-US", {timeZone: "Asia/Jakarta"});
      
  const clientName = decrypted(clientValue.CLIENT_ID);

  let data;
  let shortcodeList = [];
  
  const sheetDoc = new GoogleSpreadsheet(
    process.env.instaLikesUsernameID, 
    googleAuth
); //Google Auth

  return new Promise(
    async (
      resolve, reject
    ) => {
      try {
                
        if (decrypted(clientValue.INSTA_STATE)) {   
            
            let instaContentDir = readdirSync(`json_data_file/insta_data/insta_content/${clientName}`);

            for (let i = 0; i < instaContentDir.length; i++) {

                let contentItems = JSON.parse(readFileSync(`json_data_file/insta_data/insta_content/${clientName}/${instaContentDir[i]}`));

                let itemDate = new Date(Number(decrypted(contentItems.TIMESTAMP)) * 1000);
                let dateNow = itemDate.toLocaleDateString("en-US", {timeZone: "Asia/Jakarta"});
                shortcodeList.push(decrypted(contentItems.SHORTCODE));

                if ( dateNow === localDate) {
                }
            }


          if (shortcodeList.length >= 1) {  
        
            for (let i = 0; i < shortcodeList.length; i++) {
              try {
              let likeItem =[]
                
              likeItem = JSON.parse(readFileSync(`json_data_file/insta_data/insta_likes/${clientName}/${shortcodeList[i]}.json`));
              likeItem.unshift(encrypted(shortcodeList[i]));
              console.log(likeItem);

              setTimeout(async () => {
  
  
              await sheetDoc.loadInfo();
              const sheetName = sheetDoc.sheetsByTitle[`${clientName}_BACKUP`];
              await sheetName.addRow(likeItem);

              }, 2000);

              } catch (error) {
                // console.log('No Data');
              }

            }
            
            data = {
              data: `${clientName} Added Insta Content Data`,
              state: true,
              code: 200
            };

            resolve (data);

          } else {
            data = {
              data: "Tidak ada konten data untuk di olah",
              state: true,
              code: 201
            };

            reject (data);         
        }

        } else {
          data = {
            data: 'Your Client ID has Expired, Contacts Developers for more Informations',
            state: true,
            code: 201
          };
          reject (data);
        }
        
      } catch (error) {
        data = {
          data: error,
          state: false,
          code: 303
        };
        reject (data);
      } 
    }
  );
}