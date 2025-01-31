import { GoogleSpreadsheet } from "google-spreadsheet";
import { googleAuth } from "../../../app/database/new_query/sheet_query.js";
import { mkdirSync, writeFileSync } from "fs";
import { logsSave } from "../../../app/responselogs/logs_modif.js";
import { decrypted } from "../../encryption/crypto.js";

export async function restoreInstaContent(clientName) {

  logsSave("Execute");

  let instaOfficialDoc = new GoogleSpreadsheet(process.env.instaOfficialID, googleAuth); //Google Authentication for InstaOfficial DB    
  await instaOfficialDoc.loadInfo(); // loads document properties and worksheets
  let officialInstaSheet = instaOfficialDoc.sheetsByTitle[clientName];
  let officialInstaData = await officialInstaSheet.getRows();

  for (let i = 0; i < officialInstaData.length; i++) {
    let instaContents = Object();

    instaContents.TIMESTAMP = officialInstaData[i].get("TIMESTAMP");
    instaContents.USER_ACCOUNT = officialInstaData[i].get("USER_ACCOUNT");
    instaContents.SHORTCODE = officialInstaData[i].get("SHORTCODE");
    instaContents.ID = officialInstaData[i].get("ID");
    instaContents.TYPE = officialInstaData[i].get("TYPE");
    instaContents.CAPTION = officialInstaData[i].get("CAPTION");
    instaContents.COMMENT_COUNT = officialInstaData[i].get("COMMENT_COUNT");
    instaContents.LIKE_COUNT = officialInstaData[i].get("LIKE_COUNT");
    instaContents.PLAY_COUNT = officialInstaData[i].get("PLAY_COUNT");
    instaContents.THUMBNAIL = officialInstaData[i].get("THUMBNAIL");
    
    try {

      writeFileSync(`json_data_file/insta_data/insta_content/${clientName}/${decrypted(officialInstaData[i].get("SHORTCODE"))}.json`, JSON.stringify(instaContents));

    } catch (error) {

      mkdirSync(`json_data_file/insta_data/insta_content/${clientName}`);
      writeFileSync(`json_data_file/insta_data/insta_content/${clientName}/${decrypted(officialInstaData[i].get("SHORTCODE"))}.json`, JSON.stringify(instaContents));
            
    }
  }
}



