import { GoogleSpreadsheet } from "google-spreadsheet";
import { mkdirSync, writeFileSync } from "fs";
import { decrypted } from "../../module/crypto.js";
import { logsSave } from "../../view/logs_whatsapp.js";
import { googleAuth } from "../../module/sheet_query.js";

export async function restoreTiktokComments(clientName) {

  logsSave("Execute");

    let tiktokCommentsUsernameDoc = new GoogleSpreadsheet(process.env.tiktokCommentUsernameID, googleAuth); //Google Authentication for InstaOfficial DB    
    await tiktokCommentsUsernameDoc.loadInfo(); // loads document properties and worksheets
    let tiktokCommentsUsernameSheet = tiktokCommentsUsernameDoc.sheetsByTitle[`${clientName}_BACKUP`];
    let tiktokCommentUsernameData = await tiktokCommentsUsernameSheet.getRows();

    for (let i = 0; i < tiktokCommentUsernameData.length; i++) {

      let data = [];

      let fromRows = Object.values(tiktokCommentUsernameData[i].toObject());

      for (let ii = 0; ii < fromRows.length; ii++) {

        if (fromRows[ii] !== null || fromRows[ii] !== undefined || fromRows[ii] !== ""){
          data.push(fromRows[ii]);
        }

      }
                      
      try {
      
        writeFileSync(`json_data_file/tiktok_data/tiktok_engagement/tiktok_comments/${clientName}/${decrypted(fromRows[0])}.json`, JSON.stringify(data));
      
      } catch (error) {

        mkdirSync(`json_data_file/tiktok_data/tiktok_engagement/tiktok_comments/${clientName}`);
        writeFileSync(`json_data_file/tiktok_data/tiktok_engagement/tiktok_comments/${clientName}/${decrypted(fromRows[0])}.json`, JSON.stringify(data));
      
      }  

      logsSave("Done");
    
    }
}

