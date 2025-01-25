//Google Spreadsheet
import { clientData } from '../../../json_data_file/client_data/read_client_data_from_json.js';
import { decrypted, encrypted } from '../../../json_data_file/crypto.js';
import {writeFileSync } from "fs";

export async function setSecuid(clientValue) {

    return new Promise(async (resolve, reject) => {
        try {

            const clientName = decrypted(clientValue.CLIENT_ID);
            let tiktokAccount = decrypted(clientValue.TIKTOK);
    
            let responseInfo = await tiktokUserInfoAPI(tiktokAccount.replaceAll('@', ''));
            const secUid = await responseInfo.data.userInfo.user.secUid;
            const encryptedSecuid = encrypted(secUid)
    
            console.log(secUid);
    
            let isClient = false;
            clientData().then(
                clientRows =>{
    
                    for (let i = 0; i < clientRows.length; i++) {
                        if (decrypted(clientRows[i].CLIENT_ID) === clientName) {
                            isClient = true;
    
                            clientRows[i].SECUID = encryptedSecuid;
    
                            writeFileSync(`json_data_file/client_data/client_data.json`, JSON.stringify(clientRows));
                            writeFileSync(`json_data_file/client_data/${clientName}.json`, JSON.stringify(clientRows[i]));
    
                            let response = {
                                data: 'Secuid State with Tiktok Account : ' + tiktokAccount + ' set SECUID to : ' + secUid,
                                state: true,
                                code: 200
                            };
                
                            console.log('Return Success');

                            resolve (response);
                        }
                    }
    
                    if (!isClient) {
                        let responseData = {
                            data: 'No Data with Client_ID : ' + clientName,
                            state: true,
                            code: 201
                        };
                        console.log('Return Success');
                        resolve (responseData);
                    }
    
    
                }
            )
    
        } catch (error) {
    
            let responseData = {
                data: 'Data Error',
                state: false,
                code: 303
            };
    
            console.log(error);
            reject (responseData);
        } 
    });
}