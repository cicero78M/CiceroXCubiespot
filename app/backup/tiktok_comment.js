import { readdirSync, readFileSync } from 'fs';
import { decrypted, encrypted } from '../../json_data_file/crypto.js';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { googleAuth } from '../database/new_query/sheet_query.js';

export async function tiktokCommentsBackup(clientValue) {
  //Date Time
  let d = new Date();
  let localDate = d.toLocaleDateString("en-US", {timeZone: "Asia/Jakarta"});
  const clientName = decrypted(clientValue.CLIENT_ID);
  let data;
  let shortcodeList = [];

  return new Promise(
    async (
      resolve, reject
    ) => {
      try {
                
        if (decrypted(clientValue.INSTA_STATE)) {   
            
            let tiktokContentDir = readdirSync(`json_data_file/tiktok_data/tiktok_content/${clientName}`);

            for (let i = 0; i < tiktokContentDir.length; i++) {

                let contentItems = JSON.parse(readFileSync(`json_data_file/tiktok_data/tiktok_content/${clientName}/${tiktokContentDir[i]}`));

                let itemDate = new Date(Number(decrypted(contentItems.TIMESTAMP)) * 1000);
                let dateNow = itemDate.toLocaleDateString("en-US", {timeZone: "Asia/Jakarta"});

                if ( dateNow === localDate) {
                  shortcodeList.push(decrypted(contentItems.SHORTCODE));
                }
            }

          if (shortcodeList.length >= 1) {  
        
            for (let i = 0; i < shortcodeList.length; i++) {
              let commentItems = JSON.parse(readFileSync(`json_data_file/tiktok_data/tiktok_engagements/tiktok_comments/${clientName}/${shortcodeList[i]}.json`));
              commentItems.upshift(encrypted(shortcodeList[i]));
            }
            
            const sheetDoc = new GoogleSpreadsheet(
                process.env.tiktokCommentUsernameID, 
                googleAuth
            ); //Google Auth

            await sheetDoc.loadInfo();
            const sheetName = sheetDoc.sheetsByTitle[clientName];
            await sheetName.addRows(commentItems);

            data = {
              data: `${clientName} Added Tiktok Content Data`,
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