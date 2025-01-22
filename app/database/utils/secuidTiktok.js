//Google Spreadsheet
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { decrypted, encrypted } from '../../../json_data_file/crypto.js';

export async function setSecuid(clientValue) {

    try {

        const clientName = decrypted(clientValue.get('CLIENT_ID'));
        let tiktokAccount = decrypted(clientValue.get('TIKTOK'));

        let responseInfo = await tiktokUserInfoAPI(tiktokAccount.replaceAll('@', ''));
        const secUid = await responseInfo.data.userInfo.user.secUid;
        const encryptedSecuid = encrypted(secUid)
        console.log(secUid);

        const clientDoc = new GoogleSpreadsheet(ciceroKey.dbKey.clientDataID, googleAuth); //Google Auth
        await clientDoc.loadInfo(); // loads document properties and worksheets

        const clientSheet = clientDoc.sheetsByTitle['ClientData_Enc'];
        const clientRows = await clientSheet.getRows();

        let isClient = false;

        for (let i = 0; i < clientRows.length; i++) {
            if (decrypted(clientRows[i].get('CLIENT_ID')) === clientName) {
                isClient = true;
                
                clientRows[i].assign({ SECUID: encryptedSecuid });; // Update State Value
                await clientRows[i].save(); //save update

                let response = {
                    data: 'Secuid State with Tiktok Account : ' + tiktokAccount + ' set SECUID to : ' + secUid,
                    state: true,
                    code: 200
                };

                console.log('Return Success');
                return response;
            }
        }

        if (!isClient) {
            let responseData = {
                data: 'No Data with Client_ID : ' + clientName,
                state: true,
                code: 201
            };
            console.log('Return Success');
            return responseData;
        }
    } catch (error) {

        let responseData = {
            data: 'Data Error',
            state: false,
            code: 303
        };

        console.log(error);
        return responseData;
    }
}