//Google Spreadsheet
import { GoogleSpreadsheet } from 'google-spreadsheet';

export async function setSecuid(clientValue) {

    try {

        const clientName = clientValue.get('CLIENT_ID');
        let tiktokAccount = clientValue.get('TIKTOK');

        let responseInfo = await tiktokUserInfoAPI(tiktokAccount.replaceAll('@', ''));
        const secUid = await responseInfo.data.userInfo.user.secUid;
        console.log(secUid);

        const clientDoc = new GoogleSpreadsheet(ciceroKey.dbKey.clientDataID, googleAuth); //Google Auth
        await clientDoc.loadInfo(); // loads document properties and worksheets

        const clientSheet = clientDoc.sheetsByTitle['ClientData'];
        const clientRows = await clientSheet.getRows();

        let isClient = false;

        for (let i = 0; i < clientRows.length; i++) {
            if (clientRows[i].get('CLIENT_ID') === clientName) {
                isClient = true;
                clientRows[i].assign({ SECUID: secUid });; // Updae State Value
                await clientRows[i].save(); //save update

                let response = {
                    data: 'Secuid State with Tiktok Account : ' + tiktokAccount + ' set SECUID to : ' + secUid,
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
                data: 'No Data with Client_ID : ' + clientName,
                state: true,
                code: 201
            };
            console.log('Return Success');
            clientDoc.delete;

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