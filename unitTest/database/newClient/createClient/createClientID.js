/*******************************************************************************
 * 
 * This Function Create a new Client ID and Properties on Client Sheet Database.
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

export async function createClientID(clientName, type) {

    let response;
    //Adding Client DataBase
    try {

        const clientDoc = new GoogleSpreadsheet(ciceroKeys.dbKey.clientDataID, googleAuth); //Google Auth
        await clientDoc.loadInfo();

        const clientSheet = clientDoc.sheetsByTitle['ClientData'];

        if (['COM', 'RES'].includes(type)) {

            const clientRows = await clientSheet.getRows();

            let isExist = false;

            for (let i = 0; i < clientRows.length; i++) {
                if (clientRows[i].get('CLIENT_ID') === clientName) {
                    isExist = true;
                }
            }

            if (isExist) {
                response = {
                    data: 'Client Name is Exist :' + clientName + '\nType : ' + type + '\nStatus : false',
                    state: true,
                    code: 200
                };

                return response;

            } else {

                await clientSheet.addRow({ CLIENT_ID: clientName, TYPE: type, STATUS: false });

                response = {
                    data: 'Success Add Client Name : ' + clientName + '\nType : ' + type + '\nStatus : false',
                    state: true,
                    code: 200
                };

                return response;

            }

        } else {

            response = {
                data: 'Failing Add Client Name : ' + clientName + '\nType : ' + type + '\nStatus : false',
                state: true,
                code: 200
            };

            return response;
        }


    } catch (error) {

        console.log(error);

        response = {
            data: 'Error  Add Client Name : ' + clientName,
            state: false,
            code: 303
        };

        return response;
    }
}