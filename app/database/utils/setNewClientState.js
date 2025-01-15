//Google Spreadsheet
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { ciceroKey, googleAuth } from '../new_query/sheet_query.js';
import { decrypted, encrypted } from '../../../json_data_file/crypto.js';

export async function setNewClientState(clientName, newstate) {

    try {

        const clientDoc = new GoogleSpreadsheet(ciceroKey.dbKey.clientDataID, googleAuth); //Google Auth
        await clientDoc.loadInfo(); // loads document properties and worksheets

        const clientSheet = clientDoc.sheetsByTitle['ClientData_Enc'];
        const clientRows = await clientSheet.getRows();

        let isClient = false;

        for (let i = 0; i < clientRows.length; i++) {
            if (decrypted(clientRows[i].get('CLIENT_ID')) === clientName) {
                isClient = true;
                clientRows[i].assign({ STATUS: encrypted(newstate) });; // Updae State Value
                await clientRows[i].save(); //save update

                let response = {
                    message: 'Client State with Client_ID : ' + sheetName + ' set status to : ' + state,
                    state: true,
                    code: 200
                };

                console.log('Return Success');
                return response;
            }
        }

        if (!isClient) {
            let responseData = {
                message: 'No Data with Client_ID : ' + clientName,
                state: true,
                code: 200
            };

            console.log('Return Success');
            return responseData;
        }
    } catch (error) {

        let responseData = {
            message: 'Data Error',
            state: false,
            code: 303
        };

        console.log(error);
        return responseData;
    }
}