import { writeFileSync } from "fs";
import { decrypted, encrypted } from '../../module/crypto.js';
import { clientData } from "../read_data/read_client_data_from_json.js";

export async function updateClientData(clientName, newvalue, type) {

    let data;

    return new Promise((resolve, reject) => {

        try {

            clientData().then(response =>{

                let isClient = false;

                let clientRows = response.data;

                for (let i = 0; i < clientRows.length; i++) {

                    if (decrypted(clientRows[i].CLIENT_ID) === clientName) {
        
                        isClient = true;
                        switch (type) {
                            case "clientstate":
                                clientRows[i].STATUS = encrypted(newvalue);
                                break;
                            case "insta":
                                clientRows[i].INSTAGRAM = encrypted(newvalue);
                                break;
                            case "tiktok":
                                clientRows[i].TIKTOK = encrypted(newvalue);
                                break;
                            case "instastate":
                                clientRows[i].INSTA_STATE = encrypted(newvalue);
                                break;
                            case "tiktokstate":
                                clientRows[i].TIKTOK_STATE = encrypted(newvalue);
                                break;
                            case "super":
                                clientRows[i].SUPERVISOR = encrypted(`${newvalue}@c.us`);
                                break;
                            case "opr":
                                clientRows[i].OPERATOR = encrypted(`${newvalue}@c.us`);
                                break;
                            case "insta2":
                                clientRows[i].INSTA_2 = encrypted(newvalue);
                                break;                                
                            case "insta2state":
                                clientRows[i].INSTA_2_STATE = encrypted(newvalue);
                                break; 
                            default:
                                break;
                        }

                        writeFileSync(`json_data_file/client_data/${clientName}.json`, JSON.stringify(clientRows[i]));

                        data = {
                            data: 'Client State with Client_ID : ' + clientName + ' set status to : ' + newvalue,
                            state: true,
                            code: 200
                        };
        
                        resolve (data);
                    }
                }
        
                if (!isClient) {
                    data = {
                        data: 'No Data with Client_ID : ' + clientName,
                        state: true,
                        code: 201
                    };
        
                    reject (data);
                }
            });
        } catch (error) {
    
            data = {
                data: error,
                message: 'Update Client Data Error',
                state: false,
                code: 303
            };
    
            reject (data);
        }  
    });
}