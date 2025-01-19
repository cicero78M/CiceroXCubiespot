import { GoogleSpreadsheet } from "google-spreadsheet";
import { ciceroKey, googleAuth } from "../../../app/database/new_query/sheet_query";


export async function transferInstaContent(clientName) {

    let instaOfficialDoc = new GoogleSpreadsheet(ciceroKey.dbKey.instaOfficialID, googleAuth); //Google Authentication for InstaOfficial DB    
    await instaOfficialDoc.loadInfo(); // loads document properties and worksheets
    let officialInstaSheet = instaOfficialDoc.sheetsByTitle[clientName];
    let officialInstaData = await officialInstaSheet.getRows();
    let instaContents = Object.values(officialInstaData.toObject());


    for (let i = 0; i < instaContents.length; i++) {
        
        try {

            writeFileSync(`json_data_file/insta_data/insta_content${clientName}/${instaContents[i].code}.json`, JSON.stringify(instaContents[i]));
  
          } catch (error) {

            mkdirSync(`json_data_file/insta_data/insta_content${clientName}`);
            writeFileSync(`json_data_file/insta_data/insta_content${clientName}/${instaContents[i].code}.json`, JSON.stringify(instaContents[i]));
              
          }

      }
}



