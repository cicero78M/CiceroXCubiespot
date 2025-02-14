import { mkdirSync, writeFileSync } from "fs";
import { encrypted } from "../../module/crypto.js";
import { clientData } from "../read_data/read_client_data_from_json.js";

export async function registerClientData(clientName, clientType) {
    let data;

    return new Promise((resolve, reject) => {
        try {

            if(["COM", "RES"].includes(clientType)){

                let dataSet = new Object();
                        
                dataSet.CLIENT_ID = encrypted(clientName);
                dataSet.TYPE = encrypted(clientType);
                dataSet.STATUS = encrypted("FALSE");
                dataSet.INSTAGRAM = encrypted("");
                dataSet.TIKTOK = encrypted("");
                dataSet.INSTA_STATE = encrypted("FALSE");
                dataSet.TIKTOK_STATE = encrypted("FALSE");
                dataSet.SUPERVISOR = encrypted("");
                dataSet.OPERATOR = encrypted("");
                dataSet.GROUP = encrypted("");
                dataSet.SECUID = encrypted("");
                dataSet.INSTA_2 = encrypted("");
                dataSet.INSTA_2_STATE = encrypted("FALSE");

            
                try {
                    writeFileSync(`json_data_file/client_data/${clientName}.json`, JSON.stringify(dataSet));
                } catch (error) {
                    mkdirSync(`json_data_file/client_data/${clientName}`);
                    writeFileSync(`json_data_file/client_data/${clientName}.json`, JSON.stringify(dataSet));
                }
            
                clientData().then(
                    async response =>{

                        let clientRows = response.data;
            
                        await clientRows.push(dataSet);
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

            console.log(error);

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