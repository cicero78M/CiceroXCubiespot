import { ciceroKey, newRowsData } from "../app/database/new_query/sheet_query.js";

import { readFileSync } from 'fs';

let data = readFileSync('./json_data_file/client_data.json');
let jsonData = JSON.parse(data);

export async function clientData2Json() {

    await newRowsData(
        ciceroKey.dbKey.clientDataID, 
        'ClientData'
    ).then(
        async data => {
            console.log(data);
            for (let i = 0; i < data.length; i++){

                let clientData = new Object();
                clientData.CLIENT_ID = data[i].get("CLIENT_ID");
                clientData.TYPE = data[i].get("TYPE");
                clientData.STATUS = data[i].get("STATUS");
                clientData.INSTAGRAM = data[i].get("INSTAGRAM");
                clientData.TIKTOK = data[i].get("TIKTOK");
                clientData.INSTA_STATE = data[i].get("INSTA_STATE");
                clientData.TIKTOK_STATE = data[i].get("TIKTOK_STATE");
                clientData.SUPERVISOR = data[i].get("SUPERVISOR");
                clientData.OPERATOR = data[i].get("OPERATOR");
                clientData.GROUP = data[i].get("GROUP");
                clientData.SECUID = data[i].get("SECUID");

                let client = new Object();

                console.log(client);                
            };
        }
    );
}