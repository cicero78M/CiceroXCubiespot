import { mkdirSync, writeFileSync } from "fs";
import { encrypted } from "../../../json_data_file/crypto.js";
import { logsResponse } from "../../responselogs/response_view.js";
export async function registerClientData(clientName, clientType) {

    if(["COM", "RES"].includes(clientType)){

        let clientData = new Object();
                
        clientData.CLIENT_ID = encrypted(clientName);
        clientData.TYPE = encrypted(clientType);
        clientData.STATUS = encrypted("TRUE");
        clientData.INSTAGRAM = encrypted("");
        clientData.TIKTOK = encrypted("");
        clientData.INSTA_STATE = encrypted("FALSE");
        clientData.TIKTOK_STATE = encrypted("FALSE");
        clientData.SUPERVISOR = encrypted("");
        clientData.OPERATOR = encrypted("");
        clientData.GROUP = encrypted("");
        clientData.SECUID = encrypted("");
    
        try {
            writeFileSync(`json_data_file/client_data/${clientName}.json`, JSON.stringify(clientData));
        } catch (error) {
            mkdirSync(`json_data_file/client_data/${clientName}`);
            writeFileSync(`json_data_file/client_data/${clientName}.json`, JSON.stringify(clientData));
        }
    
        clientData().then(
            async clientRows =>{
    
                await clientRows.push(clientData);
                writeFileSync(`json_data_file/client_data/client_data.json`, JSON.stringify(clientRows));
            
            }
        )

    } else {
        logsResponse("Client Type Only Receive \"COM\" & \"RES\"");
    }

}