import { ciceroKey, newRowsData } from "../app/database/new_query/sheet_query.js";

export async function clientData2Json() {
    
    await newRowsData(
        ciceroKey.dbKey.clientDataID, 
        'ClientData'
    ).then(
        response => console.log(response)
    );
}