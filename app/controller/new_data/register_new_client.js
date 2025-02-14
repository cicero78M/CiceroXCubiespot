import { mkdirSync, writeFileSync } from "fs";
import { encrypted } from "../../module/crypto.js";

export async function registerClientData(clientName, clientType) {
    let data;

    return new Promise((resolve, reject) => {
        try {

            if(["COM", "RES"].includes(clientType)){

                let clientData = new Object();
                        
                clientData.CLIENT_ID = encrypted(clientName);
                clientData.TYPE = encrypted(clientType);
                clientData.STATUS = encrypted("FALSE");
                clientData.INSTAGRAM = encrypted("");
                clientData.TIKTOK = encrypted("");
                clientData.INSTA_STATE = encrypted("FALSE");
                clientData.TIKTOK_STATE = encrypted("FALSE");
                clientData.SUPERVISOR = encrypted("");
                clientData.OPERATOR = encrypted("");
                clientData.GROUP = encrypted("");
                clientData.SECUID = encrypted("");
                clientData.INSTA_2 = encrypted("");
                clientData.INSTA_2_STATE = encrypted("FALSE");

            
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

                data = {
                    data: `${clientName} Registred`,
                    state: true,
                    code: 200
                };
    
                resolve (data);   
        
            } else {
                data = {
                    data: `Only Receive "RES" / "COM"`,
                    state: true,
                    code: 201
                };
    
                reject (data);            }
            
        } catch (error) {

            data = {
                data: error,
                message: 'Register Client Data Error',
                state: false,
                code: 303
            };
    
            reject (data);
            
        }
    });
}