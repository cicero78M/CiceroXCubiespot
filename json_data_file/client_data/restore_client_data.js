import { mkdirSync, writeFileSync } from "fs";
import { newRowsData } from "../../app/database/new_query/sheet_query.js";
import { decrypted } from "../crypto.js";


export async function restoreClientData() {

    await newRowsData(
        process.env.clientDataID, 
        'ClientData_Enc'
    ).then(async data => {
      let client = [];

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

                client.push(clientData);

                
                try {
                  writeFileSync(`json_data_file/client_data/${decrypted(data[i].get("CLIENT_ID"))}.json`, JSON.stringify(clientData));
                } catch (error) {
                  mkdirSync(`json_data_file/client_data/${decrypted(data[i].get("CLIENT_ID"))}`);
                  writeFileSync(`json_data_file/client_data/${decrypted(data[i].get("CLIENT_ID"))}.json`, JSON.stringify(clientData));
                } 

            };
            
            writeFileSync('json_data_file/client_data/client_data.json', JSON.stringify(client));

    });

}