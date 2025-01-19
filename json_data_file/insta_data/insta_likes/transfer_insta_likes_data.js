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
      const fromRows = Object.values(instaLikesUsernameData[i].toObject());
      console.log(fromRows);

      let data = [];

      for (let ii = 1; ii < fromRows[i].length; ii++) {

        if (fromRows[i][ii] === null || fromRows[i][ii] === undefined || fromRows[i][ii] === ""){

          console.log(null);

        } else {

          data.push(encrypted(fromRows[i][ii]));

        }

      
      }
  

        try {
            writeFileSync(`json_data_file/insta_data/insta_likes/${clientName}/${fromRows[i][0]}.json`, JSON.stringify(data));
          } catch (error) {
            mkdirSync(`json_data_file/insta_data/insta_likes/${clientName}`);
            writeFileSync(`json_data_file/insta_data/insta_likes/${clientName}/${fromRows[i][0]}.json`, JSON.stringify(data));
          }
      }
}



