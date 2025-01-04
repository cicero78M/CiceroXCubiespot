import { GoogleSpreadsheet } from "google-spreadsheet";
import { ciceroKey, googleAuth } from "../database_query/sheetDoc.js";

let hasShortcode = false;

export async function postTiktokUserComments(clientName, items, userdata) {
    return new Promise(async (resolve) => { 
        const tiktokCommentsUsernameDoc = new GoogleSpreadsheet(ciceroKey.dbKey.tiktokCommentUsernameID, googleAuth); //Google Authentication for instaLikes Username DB
        await  tiktokCommentsUsernameDoc.loadInfo(); // loads document properties and worksheets            
        let tiktokCommentsUsernameSheet = tiktokCommentsUsernameDoc.sheetsByTitle[clientName];
        await tiktokCommentsUsernameSheet.getRows().then ( async response =>{
            for (let ii = 0; ii < response.length; ii++) {
                if (response[ii].get('SHORTCODE') === items) {
                    hasShortcode = true;
                    const fromRows = Object.values(response[ii].toObject());
                    console.log(fromRows);
                    for (let iii = 0; iii < fromRows.length; iii++) {
                        if (fromRows[iii] != undefined || fromRows[iii] != null || fromRows[iii] != "") {
                            if (!userdata.includes(fromRows[iii])) {
                                userdata.push(fromRows[iii]);
                            }
                        }
                    }
                    await userdata[ii].delete();
                    await tiktokCommentsUsernameSheet.addRow(userdata);
             
                    let data = {
                        data: userdata,
                        state: true,
                        code: 200
                        };
             
                        resolve (data);                \
                }
            }
        });
    }); 
}
