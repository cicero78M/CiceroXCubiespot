/*******************************************************************************
 * 
 * This Function Create a new Insta Official Data Sheet and Properties / Headers.
 * As a Child of Create Client Function
 * 
 */

import { GoogleSpreadsheet } from "google-spreadsheet";
import { googleAuth } from "../new_query/sheet_query.js";

export async function createDataSheet(clientName, sheetID, headerValues, sheetName) {
    let response;
    return new Promise(async (resolve, reject) => {
        try {
            const instaOfficialDoc = new GoogleSpreadsheet(sheetID, googleAuth); //Google Authentication for InstaOfficial DB            
            await instaOfficialDoc.loadInfo(); // loads document properties and worksheets    
            await instaOfficialDoc.addSheet({
                title: clientName, headerValues: headerValues
            });
            response = {
                data: 'Create Data Sheet ' + sheetName,
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