//Google Spreadsheet
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { googleAuth } from '../database_query/sheetDoc.js';
import { tiktokUserInfoAPI } from '../socialMediaAPI/tiktokAPI.js';

export async function setSecuid(clientValue) {

    try {

        const clientName = clientValue.get('CLIENT_ID');

        const clientDoc = new GoogleSpreadsheet(ciceroKeys.dbKey.clientDataID, googleAuth); //Google Auth
        await clientDoc.loadInfo(); // loads document properties and worksheets

        const clientSheet = clientDoc.sheetsByTitle['ClientData'];
        const clientRows = await clientSheet.getRows();

        let isClient = false;

        for (let i = 0; i < clientRows.length; i++) {
            if (clientRows[i].get('CLIENT_ID') === clientName) {

                //Collect Content Shortcode from Official Account
                let tiktokAccount = clientValue.get('TIKTOK');

                let responseInfo = await tiktokUserInfoAPI(tiktokAccount.replaceAll('@', ''));
                const secUid = await responseInfo.data.userInfo.user.secUid;

                isClient = true;
                clientRows[i].assign({ SECUID: secUid });; // Updae State Value
                await clientRows[i].save(); //save update

                let response = {
                    message: 'Client State with Client_ID : ' + sheetName + ' set status to : ' + state,
                    state: true,
                    code: 200
                };

                clientDoc.delete;
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
            clientDoc.delete;

            return responseData;
        }
    } catch (error) {

        let responseData = {
            message: 'Data Error',
            state: false,
            code: 303
        };

        console.log(error);
        targetDoc.delete;

        return responseData;
    }
}