import { GoogleSpreadsheet } from "google-spreadsheet";
import { ciceroKey, googleAuth } from "../database_query/sheetDoc.js";

export async function postTiktokUserComments(clientName, items, newDataUsers) {

    let dataCleaning = [];
    let hasShortcode = false;

    const tiktokCommentsUsernameDoc = new GoogleSpreadsheet(ciceroKey.dbKey.tiktokCommentUsernameID, googleAuth); //Google Authentication for instaLikes Username DB
    await  tiktokCommentsUsernameDoc.loadInfo(); // loads document properties and worksheets            
    let tiktokCommentsUsernameSheet = tiktokCommentsUsernameDoc.sheetsByTitle[clientName];
    tiktokCommentsUsernameSheet.getRows().then (response =>{

        for (let ii = 0; ii < response.length; ii++) {
            if (response[ii].get('SHORTCODE') === items) {
                hasShortcode = true;
                const fromRows = Object.values(response[ii].toObject());

                for (let iii = 0; iii < fromRows.length; iii++) {
                    if (fromRows[iii] !== undefined || fromRows[iii] !== null || fromRows[iii] !== "") {
                        if (!newDataUsers.includes(fromRows[iii])) {
                            newDataUsers.push(fromRows[iii]);
                        }
                    }
                }

                for (let iv = 0; iv < newDataUsers.length; iv++) {
                    if (newDataUsers[iv] != '' || newDataUsers[iv] != null || newDataUsers[iv] != undefined) {
                        if (!dataCleaning.includes(newDataUsers[iv])) {
                            dataCleaning.push(newDataUsers[iv]);
                        }
                    }
                }
        
                console.log(clientName + ' Update Data');


                response[ii].delete();
                tiktokCommentsUsernameSheet.addRow(dataCleaning);
                updateData++; 
                
                console.log("done");
            }
        }
    });  
}
