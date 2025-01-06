/*******************************************************************************
 * 
 * This Function Create a new Insta Username Likes Data Sheet and Properties / Headers.
 * As a Child of Create Client Function
 * 
 */
import { GoogleSpreadsheet } from "google-spreadsheet";
import { googleAuth } from "../new_query/sheet_query.js";

export async function createSheetHeader(clientName, sheetID) {
    
    let response;

    return new Promise(async (resolve, reject) => {

        try {

            const instaLikesUsernameDoc = new GoogleSpreadsheet(sheetID, googleAuth); //Google Authentication for instaLikes Username DB
            await instaLikesUsernameDoc.loadInfo(); // loads document properties and worksheets 
            let instaLikesUsernameSheet = await instaLikesUsernameDoc.addSheet({ title: clientName });
            await instaLikesUsernameSheet.resize({ rowCount: 1000, columnCount: 1501 });
    
            let headersRows = ['SHORTCODE'];
    
            for (let i = 1; i < 1501; i++) {
                headersRows.push('USER_' + i);
            }
    
            await instaLikesUsernameSheet.setHeaderRow(headersRows, 1);
    
            response = {
                data: 'Created Username Data Sheet ',
                state: true,
                code: 200
            };
            resolve (response);
        } catch (error) {
            response = {
                data: error,
                state: false,
                code: 303
            };
            reject (response);
        } 
    });
}