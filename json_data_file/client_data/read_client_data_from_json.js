import { readFileSync,  } from "fs";
import { decrypted } from "../crypto.js";

export async function clientData() {    
    return new Promise(async (resolve, reject) => {
        try {
            let data = [];
            data = JSON.parse(readFileSync('json_data_file/client_data/client_data.json'));
            console.log(data.length);
            //  let client = [];
        
            // for (let i = 0; i < data.length; i++){
        
            //     let dataItems = data[i];
        
            //     let clientData = new Object();
                                
            //     clientData.CLIENT_ID = decrypted(dataItems.CLIENT_ID)
            //     clientData.TYPE =  decrypted(dataItems.TYPE);
            //     clientData.STATUS = decrypted(dataItems.STATUS);
            //     clientData.INSTAGRAM = decrypted(dataItems.INSTAGRAM);
            //     clientData.TIKTOK = decrypted(dataItems.TIKTOK);
            //     clientData.INSTA_STATE = decrypted(dataItems.INSTA_STATE);
            //     clientData.TIKTOK_STATE = decrypted(dataItems.TIKTOK_STATE);
            //     clientData.SUPERVISOR = decrypted(dataItems.SUPERVISOR);
            //     clientData.OPERATOR = decrypted(dataItems.OPERATOR);
            //     clientData.GROUP = decrypted(dataItems.GROUP);
            //     clientData.SECUID = decrypted(dataItems.SECUID);
        
            //     client.push(clientData);
                
            // }

            resolve (data);
            
        } catch (error) {
            reject (error)            
        }
    });
}