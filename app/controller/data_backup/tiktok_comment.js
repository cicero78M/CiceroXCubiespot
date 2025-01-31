import { readdirSync, readFileSync } from 'fs';
import { decrypted, encrypted } from '../../module/crypto.js';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { googleAuth } from '../../module/sheet_query.js';
import { logsSave } from '../../view/logs_whatsapp.js';

export async function tiktokCommentsBackup(clientValue) {
  //Date Time
  let d = new Date();
  let localDate = d.toLocaleDateString("en-US", {timeZone: "Asia/Jakarta"});
  const clientName = decrypted(clientValue.CLIENT_ID);
  let data;
  let shortcodeList = [];

  const sheetDoc = new GoogleSpreadsheet(
    process.env.tiktokCommentUsernameID, 
    googleAuth
  ); //Google Auth

  await sheetDoc.loadInfo();
  const sheetName = sheetDoc.sheetsByTitle[`${clientName}_BACKUP`];

  return new Promise(
    async (
      resolve, reject
    ) => {
      try {
       
        if (decrypted(clientValue.TIKTOK_STATE)) {   
            
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
              try {

                let commentItems = [];
                let decryptedComments = [];
                let reEncryptedComments = [];

                commentItems = JSON.parse(readFileSync(`json_data_file/tiktok_data/tiktok_engagement/tiktok_comments/${clientName}/${shortcodeList[i]}.json`));

                commentItems.forEach(element => {
                  if(!decryptedComments.includes(decrypted(element))){
                    decryptedComments.push(decrypted(element));
                    reEncryptedComments.push(element);                
                  }
                });

                reEncryptedComments.unshift(encrypted(shortcodeList[i]));

                setTimeout(async () => {
                  logsSave(reEncryptedComments.length);
                }, 2000);

                await sheetName.addRow(reEncryptedComments);
             
              } catch (error) {

                logsSave("No Data");
                
              }
            }
            
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
          message: "Tiktok Content Backup No Data",
          state: false,
          code: 303
        };
        reject (data);
      } 
    }
  );
}