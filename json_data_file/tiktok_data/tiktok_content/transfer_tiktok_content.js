import { GoogleSpreadsheet } from "google-spreadsheet";
import { ciceroKey, googleAuth } from "../../../app/database/new_query/sheet_query.js";
import { encrypted } from "../../crypto.js";
import { mkdirSync, writeFileSync } from "fs";

export async function transferTiktokContent(clientName) {


    let tiktokOfficialDoc = new GoogleSpreadsheet(ciceroKey.dbKey.tiktokOfficialID, googleAuth); //Google Authentication for Tiktok Official DB    
    await tiktokOfficialDoc.loadInfo(); // loads document properties and worksheets
    let tiktokOfficialSheet = tiktokOfficialDoc.sheetsByTitle[clientName];
    let tiktokOfficialData = await tiktokOfficialSheet.getRows();

    for (let i = 0; i < tiktokOfficialData.length; i++) {

        let tiktokContent = Object();

        tiktokContent.TIMESTAMP = encrypted(tiktokOfficialData[i].get("TIMESTAMP"));
        tiktokContent.USER_ACCOUNT = encrypted(tiktokOfficialData[i].get("USER_ACCOUNT"));
        tiktokContent.SHORTCODE = encrypted(tiktokOfficialData[i].get("SHORTCODE"));
        tiktokContent.ID = encrypted(tiktokOfficialData[i].get("ID"));
        tiktokContent.CAPTION = encrypted(tiktokOfficialData[i].get("CAPTION"));
        tiktokContent.COMMENT_COUNT = encrypted(tiktokOfficialData[i].get("COMMENT_COUNT"));
        tiktokContent.LIKE_COUNT = encrypted(tiktokOfficialData[i].get("LIKE_COUNT"));
        tiktokContent.PLAY_COUNT = encrypted(tiktokOfficialData[i].get("PLAY_COUNT"));
        tiktokContent.SHARE_COUNT = encrypted(tiktokOfficialData[i].get("SHARE_COUNT"));
        tiktokContent.REPOST_COUNT = encrypted(tiktokOfficialData[i].get("REPOST_COUNT"));
        tiktokContent.SHARE_COUNT = encrypted(tiktokOfficialData[i].get("SHARE_COUNT"));
        tiktokContent.COLLECT_COUNT = encrypted(tiktokOfficialData[i].get("COLLECT_COUNT"));

        console.log(tiktokContent);

        try {

            writeFileSync(`json_data_file/tiktok_data/tiktok_content/${clientName}/${tiktokOfficialData[i].get("SHORTCODE")}.json`, JSON.stringify(tiktokContent));

        } catch (error) {

        mkdirSync(`json_data_file/tiktok_data/tiktok_content/${clientName}}`);
        writeFileSync(`json_data_file/tiktok_data/tiktok_content/${clientName}/${tiktokOfficialData[i].get("SHORTCODE")}.json`, JSON.stringify(tiktokContent));
            
        }
    }
}



