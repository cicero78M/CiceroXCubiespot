import { GoogleSpreadsheet } from "google-spreadsheet";
import { ciceroKey, googleAuth } from "../../../app/database/new_query/sheet_query.js";
import { encrypted } from "../../crypto.js";
import { mkdirSync, writeFileSync } from "fs";

export async function transferInstaLikes(clientName) {

    let instaLikesDoc = new GoogleSpreadsheet(ciceroKey.dbKey.instaLikesUsernameID, googleAuth); //Google Authentication for InstaOfficial DB    
    await instaLikesDoc.loadInfo(); // loads document properties and worksheets
    let instaLikesUsernameSheet = instaLikesDoc.sheetsByTitle[clientName];
    let instaLikesUsernameData = await instaLikesUsernameSheet.getRows();

    for (let i = 0; i < instaLikesUsernameData.length; i++) {

      let data = [];

      for (let ii = 1; ii < instaLikesUsernameData[i].length; ii++) {

        if (instaLikesUsernameData[i][ii] === null || instaLikesUsernameData[i][ii] === undefined || instaLikesUsernameData[i][ii] === ""){

          console.log(null);

        } else {

          data.push(encrypted(instaLikesUsernameData[i][ii]));

        }

      
      }
  

        try {
            writeFileSync(`json_data_file/insta_data/insta_likes/${clientName}/${instaLikesUsernameData[i][0]}.json`, JSON.stringify(data));
          } catch (error) {
            mkdirSync(`json_data_file/insta_data/insta_likes/${clientName}`);
            writeFileSync(`json_data_file/insta_data/insta_likes/${clientName}/${instaLikesUsernameData[i][0]}.json`, JSON.stringify(data));
          }
      }
}



