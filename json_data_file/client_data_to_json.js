import { ciceroKey, newRowsData } from "../app/database/new_query/sheet_query.js";

export async function clientData2Json() {

    await newRowsData(
        ciceroKey.dbKey.clientDataID, 
        'ClientData'
    ).then(
        async data => {
            console.log(data);
            for (let i = 0; i < data.length; i++){
                console.log(data[i].get("STATUS"));
            };
        }
    );
}