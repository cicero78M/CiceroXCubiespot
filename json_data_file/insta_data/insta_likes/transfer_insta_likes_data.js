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

      let fromRows = Object.values(instaLikesUsernameData[i].toObject());

      for (let ii = 0; ii < fromRows.length; ii++) {


        if (fromRows[ii] === null || fromRows[ii] === undefined || fromRows[ii] === ""){

          console.log(null);

        } else {

          data.push(encrypted(fromRows[ii]));

        }

        
        try {
          writeFileSync(`json_data_file/insta_data/insta_likes/${clientName}/${fromRows[0]}.json`, JSON.stringify(data));
        } catch (error) {
          mkdirSync(`json_data_file/insta_data/insta_likes/${clientName}`);
          writeFileSync(`json_data_file/insta_data/insta_likes/${clientName}/${fromRows[0]}.json`, JSON.stringify(data));
        }    
      }
    }
}



