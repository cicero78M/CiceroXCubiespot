import { ciceroKey, newRowsData } from "../app/database/new_query/sheet_query.js";
import { readFileSync, writeFileSync } from "fs";
import { encrypted } from "./crypto.js";

let client = [];

export async function clientData2Json() {

    await newRowsData(
        ciceroKey.dbKey.clientDataID, 
        'ClientData'
    ).then(async data => {
            for (let i = 0; i < data.length; i++){

                let clientData = new Object();

                console.log(encrypted(data[i].get("CLIENT_ID")));
                
                clientData.CLIENT_ID = encrypted(data[i].get("CLIENT_ID"));
                clientData.TYPE = encrypted(data[i].get("TYPE"));
                clientData.STATUS = encrypted(data[i].get("STATUS"));
                clientData.INSTAGRAM = encrypted(data[i].get("INSTAGRAM"));
                clientData.TIKTOK = encrypted(data[i].get("TIKTOK"));
                clientData.INSTA_STATE = encrypted(data[i].get("INSTA_STATE"));
                clientData.TIKTOK_STATE = encrypted(data[i].get("TIKTOK_STATE"));
                clientData.SUPERVISOR = encrypted(data[i].get("SUPERVISOR"));
                clientData.OPERATOR = encrypted(data[i].get("OPERATOR"));
                clientData.GROUP = encrypted(data[i].get("GROUP"));
                clientData.SECUID = encrypted(data[i].get("SECUID"));

                client.push(clientData);

            //    console.log(client);                
            };
    });

    console.log(JSON.parse(readFileSync('json_data_file/client_data.json')));    
    writeFileSync('json_data_file/client_data.json', JSON.stringify(client));

}