//Google Spreadsheet
import { decrypted, encrypted } from './crypto.js';
import {writeFileSync } from "fs";
import { clientData } from '../controller/read_data/read_client_data_from_json.js';

export async function setSecuid(clientValue) {

    let data;

    return new Promise(async (resolve, reject) => {
        try {

            const clientName = decrypted(clientValue.CLIENT_ID);
            let tiktokAccount = decrypted(clientValue.TIKTOK);
    
            let responseInfo = await tiktokUserInfoAPI(tiktokAccount.replaceAll('@', ''));
            const secUid = await responseInfo.data.userInfo.user.secUid;
            const encryptedSecuid = encrypted(secUid)
        
            let isClient = false;
            clientData().then(
                response =>{

                    let clientRows = response.data;
    
                    for (let i = 0; i < clientRows.length; i++) {
                        if (decrypted(clientRows[i].CLIENT_ID) === clientName) {
                            isClient = true;
    
                            clientRows[i].SECUID = encryptedSecuid;
    
                            writeFileSync(`json_data_file/client_data/client_data.json`, JSON.stringify(clientRows));
                            writeFileSync(`json_data_file/client_data/${clientName}.json`, JSON.stringify(clientRows[i]));
    
                            data = {
                                data: 'Secuid State with Tiktok Account : ' + tiktokAccount + ' set SECUID to : ' + secUid,
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
                }
            ).catch(
                error => reject (error)
            );
    
        } catch (error) {
    
            data = {
                data: error,
                message: "Set Secuid Error",
                state: false,
                code: 303
            };
    
            reject (data);
        } 
    });
}