/*******************************************************************************
 * 
 * This Function Create a new Client ID and Properties on Client Sheet Database.
 * As a Child of Create Client Function
 * 
 */
import { GoogleSpreadsheet } from "google-spreadsheet";
import { googleAuth } from "../new_query/sheet_query.js";
import { encrypted } from "../../../json_data_file/crypto.js";

export async function createClientID(clientName, type) {

    return new Promise(
        async (
            resolve, 
            reject
        ) => {

            const typeList = [
                "RES",
                "COM"
            ];
            let response;
            let data;
            
            try {

                const sheetDoc = new GoogleSpreadsheet(
                    process.env.clientDataID, 
                    googleAuth
                ); //Google Auth
                await sheetDoc.loadInfo();
                const sheetName = sheetDoc.sheetsByTitle[
                    'ClientData'
                ];
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
                            code: 201
                        };
                        reject (response);

                    } else {
                        
                        await sheetName.addRow({
                            CLIENT_ID: encrypted(clientName), 
                            TYPE: encrypted(type), 
                            STATUS: encrypted(true) 
                        });
                        
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
                        code: 201
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
        }
    );
}