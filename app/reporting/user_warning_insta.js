import { readdirSync, readFileSync } from 'fs';
import { client } from '../../app.js';
import { decrypted } from '../../json_data_file/crypto.js';

export async function warningReportInsta(clientValue) {

  //Date Time
  let d = new Date();
  let localDate = d.toLocaleDateString("en-US", {timeZone: "Asia/Jakarta"});
      
  const clientName = decrypted(clientValue.get('CLIENT_ID'));

  let data;

  let userAll = 0;

  let shortcodeList = [];
  let userRows = [];
  let userLikesData = [];
  let UserNotLikes = [];
  let notLikesList = [];
  
  let shortcodeListString = '';

  return new Promise(
    async (
      resolve, reject
    ) => {
      try {

        //Get User Data
        await readUser(
          clientName
        ).then( 
          async response => {    
            userRows = await response;                           
            for (let i = 0; i < userRows.length; i++) {
              if (userRows[i].STATUS === 'TRUE' ){
                userAll++;
              }
            } 
          }
        );

        // If Client_ID exist. then get Insta content
        
        if (decrypted(clientValue.STATUS)) {   

          let instaContentDir = readdirSync(`json_data_file/insta_data/insta_content/${clientName}`);

          for (let i = 0; i < instaContentDir.length; i++) {

            let contentItems = JSON.parse(readFileSync(`json_data_file/insta_data/insta_content/${clientName}/${instaContentDir[i]}`));

            let itemDate = new Date(Number(decrypted(contentItems.TIMESTAMP)) * 1000);

            if (itemDate.toLocaleDateString("en-US", {timeZone: "Asia/Jakarta"}) === localDate) {

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

                console.log("Null Data Exist");
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

            for (let i = 0; i < notLikesList.length; i++){
                if(notLikesList[i].WHATSAPP !== ""){
                  
                  console.log(`Send Warning messages to ${notLikesList[i].TITLE} ${notLikesList[i].NAMA}`);  
                  await client.sendMessage(
                      `${notLikesList[i].WHATSAPP}@c.us`,
                      `Selamat Siang, Bpk/Ibu ${notLikesList[i].TITLE} ${notLikesList[i].NAMA}\n\nSistem kami membaca bahwa Anda belum melaksanakan Likes dan Komentar pada Konten dari AKun Official  berikut :\n\n${shortcodeListString}\n\nSilahkan segera melaksanakan Likes dan Komentar Pada Kesempatan Pertama, Terimakasih.\n\n_Anda Menerima Pesan Otomatis ini karena nomor ini terdaftar sesuai dengan Nama User Tercantum, silahkan Save No WA Bot Pegiat Medsos ini_\n\n_Cicero System_
                      `
                  );
                  setTimeout(async () => {
                    console.log("Waits");
                  }, 4000);
                }
            }

            data = {
                data: "Send warning Done",
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