import { ciceroKey, newRowsData } from "../app/database/new_query/sheet_query.js";

export async function clientData2Json() {

    await newRowsData(
        ciceroKey.dbKey.clientDataID, 
        'ClientData'
    ).then(
        async response => {
            for (let i = 0; i < response.lenght; i++){
                console.log(await response[i]);
            };
        }
    );
}