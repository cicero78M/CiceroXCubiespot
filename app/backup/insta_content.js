import { readdirSync, readFileSync } from 'fs';
import { decrypted } from '../../json_data_file/crypto.js';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { googleAuth } from '../database/new_query/sheet_query.js';

export async function instaContentBackup(clientValue) {

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
                
        if (decrypted(clientValue.STATUS)) {   
          
          let instaContentDir = readdirSync(`json_data_file/insta_data/insta_content/${clientName}`);

          for (let i = 0; i < instaContentDir.length; i++) {

            let contentItems = JSON.parse(readFileSync(`json_data_file/insta_data/insta_content/${clientName}/${instaContentDir[i]}`));

            let itemDate = new Date(Number(decrypted(contentItems.TIMESTAMP)) * 1000);
            let dateNow = itemDate.toLocaleDateString("en-US", {timeZone: "Asia/Jakarta"});

            // console.log(itemDate.toLocaleDateString("en-US", {timeZone: "Asia/Jakarta"}));
            // console.log(localDate);

            shortcodeList.push(contentItems);

            if ( dateNow === localDate) {
            }

          }

          if (shortcodeList.length >= 1) {      
            
            const sheetDoc = new GoogleSpreadsheet(
                process.env.instaOfficialID, 
                googleAuth
            ); //Google Auth

            await sheetDoc.loadInfo();
            const sheetName = sheetDoc.sheetsByTitle[`${clientName}_BACKUP`];
            await sheetName.addRows(shortcodeList);

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