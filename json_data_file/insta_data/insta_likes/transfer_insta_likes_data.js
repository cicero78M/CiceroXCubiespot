import { GoogleSpreadsheet } from "google-spreadsheet";
import { googleAuth } from "../../../app/database/new_query/sheet_query.js";
import { decrypted } from "../../crypto.js";
import { mkdirSync, writeFileSync } from "fs";
import { logsResponse } from "../../../app/responselogs/logs_modif.js";

export async function restoreInstaLikes(clientName) {

  logsResponse("Execute");

    let instaLikesDoc = new GoogleSpreadsheet(process.env.instaLikesUsernameID, googleAuth); //Google Authentication for InstaOfficial DB    
    await instaLikesDoc.loadInfo(); // loads document properties and worksheets
    let instaLikesUsernameSheet = instaLikesDoc.sheetsByTitle[`${clientName}_BACKUP`];
    let instaLikesUsernameData = await instaLikesUsernameSheet.getRows();

    for (let i = 0; i < instaLikesUsernameData.length; i++) {

      let data = [];

      let fromRows = Object.values(instaLikesUsernameData[i].toObject());

      for (let ii = 0; ii < fromRows.length; ii++) {


        if (fromRows[ii] !== null || fromRows[ii] !== undefined || fromRows[ii] !== ""){
          data.push(fromRows[ii]);
        }
                
        try {

          writeFileSync(`json_data_file/insta_data/insta_likes/${clientName}/${decrypted(fromRows[0])}.json`, JSON.stringify(data));
        
        } catch (error) {
        
          mkdirSync(`json_data_file/insta_data/insta_likes/${clientName}`);
          writeFileSync(`json_data_file/insta_data/insta_likes/${clientName}/${decrypted(fromRows[0])}.json`, JSON.stringify(data));
        
        }
        
        logsResponse("Done")
      }
    }
}



