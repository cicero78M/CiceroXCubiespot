/*******************************************************************************
 * 
 * This Function Create a new Client ID and Properties on Client Sheet Database.
 * As a Child of Create Client Function
 * 
 */
import { GoogleSpreadsheet } from "google-spreadsheet";
import { ciceroKey, googleAuth } from "../new_query/sheet_query.js";

export async function createClientID(clientName, type) {

    return new Promise(async (resolve, reject) => {

        const typeList = ["RES", "COM"];
        let response;
        let data;
        
        try {

            const sheetDoc = new GoogleSpreadsheet(ciceroKey.dbKey.clientDataID, googleAuth); //Google Auth
            await sheetDoc.loadInfo();
            const sheetName = sheetDoc.sheetsByTitle['ClientData'];
            const sheetRows = await sheetName.getRows();    

            if (typeList.includes(type)) {
                let isExist = false;
                for (let i = 0; i < sheetRows.length; i++) {
                    if (sheetRows[i].get('CLIENT_ID') === clientName) {
                        isExist = true;
                        data = sheetRows[i];
                    }
                }
                if (isExist) {
                    response = {
                        data: `${data.get("CLIENT_ID")} is Exist}, Client Type :  ${data.get("TYPE")},  Status : ${data.get("STATUS")}`,
                        state: true,
                        code: 210
                    };
                    reject (response);
                } else {
                    await clientSheet.addRow({ CLIENT_ID: clientName, TYPE: type, STATUS: true });
                    response = {
                        data: `${clientName} Created, Client Type :  ${type},  Status : TRUE`,
                        state: true,
                        code: 200
                    };
                    resolve (response);
                }
            } else {
                response = {
                    data: `Creating Client Fail, the system received "RES" / "COM" type only`,
                    state: true,
                    code: 211
                };
                reject (response);
            }
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