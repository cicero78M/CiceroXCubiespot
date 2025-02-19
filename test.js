import { existsSync, readdirSync, readFileSync, writeFileSync } from "fs";
import { readUser } from './app/controller/read_data/read_data_from_dir.js';
import { decrypted } from './app/module/crypto.js';
import { logsSave } from './app/view/logs_whatsapp.js';

export async function instaVisData(clientValue) {

  logsSave("Execute Report Insta")
  const clientName = decrypted(clientValue.CLIENT_ID);
  logsSave(clientName);
  let data;

  return new Promise(
    async (resolve, reject) => {
      try {

        logsSave("Execute");

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
        ).catch( error => reject (error));

        // If Client_ID exist. then get Insta content

        if (decrypted(clientValue.STATUS)) {   

          let userLikesData = new Array();
          let userNotLikes;
          let dataLikes = new Array();


          let instaContentDir = readdirSync(`json_data_file/insta_data/insta_content/${clientName}`);

          for (let i = 0; i < instaContentDir.length; i++) {

            let contentItems = JSON.parse(readFileSync(`json_data_file/insta_data/insta_content/${clientName}/${instaContentDir[i]}`));
            let likesItems = JSON.parse(readFileSync(`json_data_file/insta_data/insta_likes/${clientName}/${instaContentDir[i]}`));


            let date = new Date((decrypted(contentItems.taken_at) * 1000));

            if (!existsSync("json_data_file/insta_data")){
                mkdirSync("json_data_file/insta_data");
            }

            if (!existsSync("json_data_file/insta_data/insta_vis/")){
                mkdirSync("json_data_file/insta_data/insta_vis");
            }
            
            if (!existsSync("json_data_file/insta_data/insta_vis/"+date.getFullYear())){
                mkdirSync("json_data_file/insta_data/insta_vis/"+date.getFullYear());
            }
            
            if (!existsSync("json_data_file/insta_data/insta_vis/"+date.getFullYear()+"/"+date.getMonth())){
                mkdirSync("json_data_file/insta_data/insta_vis/"+date.getFullYear()+"/"+date.getMonth());
            }

            if (!existsSync("json_data_file/insta_data/insta_vis/"+date.getFullYear()+"/"+date.getMonth()+"/"+date.getDate())){
                mkdirSync("json_data_file/insta_data/insta_vis/"+date.getFullYear()+"/"+date.getMonth()+"/"+date.getDate());
            }

            for (let ii = 0; ii < likesItems.length; ii++) {
              if (decrypted(likesItems[ii]) !== ""){
                if (!userLikesData.includes(decrypted(likesItems[ii]))) {
                  userLikesData.push(decrypted(likesItems[ii]));
                }
              }
            }

            for (let i = 0; i < userRows.length; i++) {     

              if (userRows[i].INSTA === undefined
              || userRows[i].INSTA === null 
              || userRows[i].INSTA === ""){

                logsSave("Null Data Exist");
                userNotLikes.push(userRows[i].ID_KEY);

                userRows[i].LIKES = "FALSE";
                userRows[i].SHORTCODE = contentItems.SHORTCODE;
                userRows[i].TIMESTAMPS = contentItems.taken_at;
                dataLikes.push(userRows[i]);


              } else {
                if (!userLikesData.includes(userRows[i].INSTA)) {
                  if (!userNotLikes.includes(userRows[i].ID_KEY)) {
                    if (userRows[i].STATUS === 'TRUE' ){
                      if (userRows[i].EXCEPTION === "FALSE"){
                        userNotLikes.push(userRows[i].ID_KEY);
                        userRows[i].LIKES = "FALSE";
                        userRows[i].SHORTCODE = contentItems.SHORTCODE;
                        userRows[i].TIMESTAMPS = contentItems.taken_at;
                        dataLikes.push(userRows[i]);
                      } else {
                        userRows[i].LIKES = "TRUE";
                        userRows[i].SHORTCODE = contentItems.SHORTCODE;
                        userRows[i].TIMESTAMPS = contentItems.taken_at;
                        dataLikes.push(userRows[i]);
                      }                
                    }
                  }
                } else {
                  userRows[i].LIKES = "TRUE";
                  userRows[i].SHORTCODE = contentItems.SHORTCODE;
                  userRows[i].TIMESTAMPS = contentItems.taken_at;
                  dataLikes.push(userRows[i]);
                }
              }
            }

            writeFileSync(`"json_data_file/insta_data/insta_vis/${date.getFullYear()}/${date.getMonth()}/${date.getDate()}/${contentItems.SHORTCODE}.json`, JSON.stringify(dataLikes));

          }

          data = {
            data: 'Record Done',
            state: true,
            code: 200
          };
          resolve (data);

        } else {
          data = {
            data: 'Your Client ID has Expired, Contacts Developers for more Informations',
            state: true,
            code: 201
          };
          reject (data);
        }
      } catch (error) {
        console.log(error)
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