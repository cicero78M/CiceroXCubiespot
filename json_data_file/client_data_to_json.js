import { newRowsData } from "../app/database/new_query/sheet_query.js";

export async function clientData2Json() {
    newRowsData(
        ciceroKey.dbKey.clientDataID, 
        'ClientData'
    ).then(
        response => console.log(response)
    );
}