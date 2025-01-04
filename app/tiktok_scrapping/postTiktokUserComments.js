import { GoogleSpreadsheet } from "google-spreadsheet";
import { ciceroKey, googleAuth } from "../database_query/sheetDoc.js";

let hasShortcode = false;


export async function postTiktokUserComments(clientName, items, data) {
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
                            if (!data.includes(fromRows[iii])) {
                                data.push(fromRows[iii]);
                            }
                        }
                    }


                    response[ii].assign(data);
                    await response[ii].save();
                    
                    resolve (data.length);   
                }
            }
        });
    }); 
}
