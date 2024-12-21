/*******************************************************************************
 * 
 * This Function Create a new User Data Base Sheet Name and Properties / Headers.
 * As a Child of Create Client Function
 * 
 */

import { readFileSync } from 'fs';

const ciceroKeys = JSON.parse (readFileSync('ciceroKey.json'));

//Google Spreadsheet
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

const googleAuth = new JWT({
  // env var values here are copied from service account credentials generated by google
  // see "Authentication" section in docs for more info
  email: ciceroKeys.client_email,
  key: ciceroKeys.private_key,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

export async function userHeaders(clientName) {
    let response;
    //User DataBase Headers
    try {

        const userDoc = new GoogleSpreadsheet(ciceroKeys.dbKey.userDataID, googleAuth); //Google Auth
        userDoc.loadInfo;

        await userDoc.addSheet({
            title: clientName, headerValues: ['ID_KEY', 'NAMA', 'TITLE', 'DIVISI', 'JABATAN', 'STATUS',
                'WHATSAPP', 'INSTA', 'TIKTOK']
        });

        response = {
            data: 'Create User Data Sheet ' + clientName,
            state: true,
            code: 200
        };

        return response;

    } catch (error) {

        response = {
            data: 'Create User Data Sheet Error',
            state: false,
            code: 303
        };

        return response;
    }
}