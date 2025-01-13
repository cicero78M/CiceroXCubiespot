import { writeFileSync } from "fs";
import { encrypted } from "../crypto.js";
import { ciceroKey, newRowsData } from "../../app/database/new_query/sheet_query.js";

let client = [];

export async function clientData2Json() {

    await newRowsData(
        ciceroKey.dbKey.clientDataID, 
        'ClientData'
    ).then(async data => {
            for (let i = 0; i < data.length; i++){

                let clientData = new Object();
                
                clientData.CLIENT_ID = await encrypted(data[i].get("CLIENT_ID"));
                clientData.TYPE = await encrypted(data[i].get("TYPE"));
                clientData.STATUS = await encrypted(data[i].get("STATUS"));
                clientData.INSTAGRAM = await encrypted(data[i].get("INSTAGRAM"));
                clientData.TIKTOK = await encrypted(data[i].get("TIKTOK"));
                clientData.INSTA_STATE = await encrypted(data[i].get("INSTA_STATE"));
                clientData.TIKTOK_STATE = await encrypted(data[i].get("TIKTOK_STATE"));
                clientData.SUPERVISOR = await encrypted(data[i].get("SUPERVISOR"));
                clientData.OPERATOR = await encrypted(data[i].get("OPERATOR"));
                clientData.GROUP = await encrypted(data[i].get("GROUP"));
                clientData.SECUID = await encrypted(data[i].get("SECUID"));

                client.push(clientData);

            };
    });

    writeFileSync('json_data_file/client_user_data/client_data.json', JSON.stringify(client));
}