import { GoogleSpreadsheet } from "google-spreadsheet";
import { ciceroKey, googleAuth } from "../database_query/sheetDoc.js";

export async function postTiktokUserComments(clientName, items, newDataUsers) {

    
    const tiktokCommentsUsernameDoc = new GoogleSpreadsheet(ciceroKey.dbKey.tiktokCommentUsernameID, googleAuth); //Google Authentication for instaLikes Username DB
    await  tiktokCommentsUsernameDoc.loadInfo(); // loads document properties and worksheets            
    let tiktokCommentsUsernameSheet = tiktokCommentsUsernameDoc.sheetsByTitle[clientName];

    let hasShortcode = false;

    await tiktokCommentsUsernameSheet.getRows().then ( response =>{

        for (let ii = 0; ii < response.length; ii++) {

            if (response[ii].get('SHORTCODE') === items) {
                hasShortcode = true;
                const fromRows = Object.values(response[ii].toObject());

                for (let iii = 0; iii < fromRows.length; iii++) {
                    if (fromRows[iii] != undefined || fromRows[iii] != null || fromRows[iii] != "") {
                        if (!newDataUsers.includes(fromRows[iii])) {
                            newDataUsers.push(fromRows[iii]);
                        }
                    }
                }

                return new Promise((resolve) => { 
                    resolve (newDataUsers);
                });          
            
            }
        }
        

    });

}
