import { readdirSync, readFileSync } from 'fs';
import { decrypted } from '../encryption/crypto.js';
import { notifView } from '../view/notif_view.js';
import { logsSend } from '../responselogs/logs_modif.js';
import { readUser } from '../restore/user_data/read_data_from_dir.js';

export async function warningReportInsta(clientValue) {

  logsSend("Execute Warning Report Insta");
  
  //Date Time
  let d = new Date();
  let localDate = d.toLocaleDateString("en-US", {timeZone: "Asia/Jakarta"});

  const clientName = decrypted(clientValue.CLIENT_ID);
  let data;

  let userAll = 0;

  let shortcodeList = [];
  let userRows = [];
  let userLikesData = [];
  let UserNotLikes = [];
  let notLikesList = [];
  
  let shortcodeListString = '';

  return new Promise(
    async (resolve, reject) => {
      try {
        //Get User Data
        await readUser(
          clientName
        ).then( 
          async response => {    
            userRows = await response.data;                           
            for (let i = 0; i < userRows.length; i++) {
              if (userRows[i].STATUS === 'TRUE' ){
                userAll++;
              }
            } 
          }
        ).catch(
          error => reject(error)
        )

        // If Client_ID exist. then get Insta content

                  
        if (decrypted(clientValue.STATUS)) {   
          
          let instaContentDir = readdirSync(`json_data_file/insta_data/insta_content/${clientName}`);

          for (let i = 0; i < instaContentDir.length; i++) {

            let contentItems = JSON.parse(readFileSync(`json_data_file/insta_data/insta_content/${clientName}/${instaContentDir[i]}`));

            let itemDate = new Date(Number(decrypted(contentItems.TIMESTAMP)) * 1000);
            let dateNow = itemDate.toLocaleDateString("en-US", {timeZone: "Asia/Jakarta"});

            if ( dateNow === localDate) {

              if (!shortcodeList.includes(decrypted(contentItems.SHORTCODE))) {

                shortcodeList.push(decrypted(contentItems.SHORTCODE));
                
                if (decrypted(contentItems.TYPE) === 'reel') {
                  shortcodeListString = shortcodeListString.concat('\nhttps://instagram.com/reel/' + decrypted(contentItems.SHORTCODE));
                } else {
                  shortcodeListString = shortcodeListString.concat('\nhttps://instagram.com/p/' + decrypted(contentItems.SHORTCODE));
                }
              }
            }
          }

          if (shortcodeList.length >= 1) {      

            //Collect Likes Data
            for (let i = 0; i < shortcodeList.length; i++) {

              let likesItems = JSON.parse(readFileSync(`json_data_file/insta_data/insta_likes/${clientName}/${shortcodeList[i]}.json`));

              for (let ii = 0; ii < likesItems.length; ii++) {

                if (!userLikesData.includes(decrypted(likesItems[ii]))) {
                  userLikesData.push(decrypted(likesItems[ii]));
                }
              }

            } 

            for (let i = 0; i < userRows.length; i++) {     

              if (userRows[i].INSTA === undefined
              || userRows[i].INSTA === null 
              || userRows[i].INSTA === ""){

                UserNotLikes.push(userRows[i].ID_KEY);
                notLikesList.push(userRows[i]);

              } else {
                if (!userLikesData.includes(userRows[i].INSTA)) {
                  if (!UserNotLikes.includes(userRows[i].ID_KEY)) {
                    if (userRows[i].STATUS === 'TRUE' ){
                      if (userRows[i].EXCEPTION === "FALSE"){
                        UserNotLikes.push(userRows[i].ID_KEY);
                        notLikesList.push(userRows[i]);
                      }                
                    }
                  }
                } 
              }   
            }

            notifView(notLikesList, shortcodeListString).then(
              response => resolve(response)
            ).catch(
              error => reject (error)
            );

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
          message: "Error Warning Report Insta",
          state: false,
          code: 303
        };
        reject (data);
      } 
    }
  );
}