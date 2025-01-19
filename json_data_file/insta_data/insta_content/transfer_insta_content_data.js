import { GoogleSpreadsheet } from "google-spreadsheet";
import { ciceroKey, googleAuth } from "../../../app/database/new_query/sheet_query.js";
import { encrypted } from "../../crypto.js";
// import { mkdirSync, writeFileSync } from "fs";



export async function transferInstaContent(clientName) {


    let instaOfficialDoc = new GoogleSpreadsheet(ciceroKey.dbKey.instaOfficialID, googleAuth); //Google Authentication for InstaOfficial DB    
    await instaOfficialDoc.loadInfo(); // loads document properties and worksheets
    let officialInstaSheet = instaOfficialDoc.sheetsByTitle[clientName];
    let officialInstaData = await officialInstaSheet.getRows();



    for (let i = 0; i < officialInstaData.length; i++) {
        let instaContents = Object();

        instaContents.TIMESTAMP = encrypted(officialInstaData[i].get("TIMESTAMP"));
        instaContents.USER_ACCOUNT = encrypted(officialInstaData[i].get("USER_ACCOUNT"));
        instaContents.SHORTCODE = encrypted(officialInstaData[i].get("SHORTCODE"));
        instaContents.ID = encrypted(officialInstaData[i].get("ID"));
        instaContents.TYPE = encrypted(officialInstaData[i].get("TYPE"));
        instaContents.CAPTION = encrypted(officialInstaData[i].get("CAPTION"));
        instaContents.COMMENT_COUNT = encrypted(officialInstaData[i].get("COMMENT_COUNT"));
        instaContents.LIKE_COUNT = encrypted(officialInstaData[i].get("LIKE_COUNT"));
        instaContents.PLAY_COUNT = encrypted(officialInstaData[i].get("PLAY_COUNT"));
        instaContents.THUMBNAIL = encrypted(officialInstaData[i].get("THUMBNAIL"));

        console.log(instaContents);



        try {

            writeFileSync(`json_data_file/insta_data/insta_content/${clientName}/${officialInstaData[i].get("SHORTCODE")}.json`, JSON.stringify(instaContents));
  
          } catch (error) {

            mkdirSync(`json_data_file/insta_data/insta_content/${clientName}`);
            writeFileSync(`json_data_file/insta_data/insta_content/${clientName}/${officialInstaData[i].get("SHORTCODE")}.json`, JSON.stringify(instaContents));
              
          }
      }
}



