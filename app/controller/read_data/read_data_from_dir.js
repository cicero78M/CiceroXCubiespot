import { readdirSync, readFileSync } from "fs";
import { decrypted } from "../../module/crypto.js";
import { logsSave } from "../../view/logs_whatsapp.js";

export async function readUser(clientName) {   
    
    logsSave(`${clientName} User Data`); 
    
    return new Promise(async (resolve, reject) => {
        try {
            let client = new Array();

            let dataProfile = readdirSync(`json_data_file/user_data/${clientName}`);

            dataProfile.forEach(element => {
                
                let fromJson = JSON.parse(readFileSync(`json_data_file/user_data/${clientName}/${element}`));
                
                let userData = new Object();

                if (decrypted(fromJson.STATUS) === "TRUE"){

                    userData.ID_KEY = decrypted(fromJson.ID_KEY);
                    userData.NAMA = decrypted(fromJson.NAMA);
                    userData.TITLE = decrypted(fromJson.TITLE);
                    userData.DIVISI = decrypted(fromJson.DIVISI);
                    userData.JABATAN = decrypted(fromJson.JABATAN);
                    userData.STATUS = decrypted(fromJson.STATUS);
                    userData.WHATSAPP = decrypted(fromJson.WHATSAPP);
                    userData.INSTA = decrypted(fromJson.INSTA);
                    userData.TIKTOK = decrypted(fromJson.TIKTOK);
                    userData.EXCEPTION = decrypted(fromJson.EXCEPTION);

                    client.push(userData);
                }
            });
            
            let data = {
                data: client,
                message:"Success Load Data User",
                state: true,
                code: 200
            };    
            
            resolve (data);  

        } catch (error) {
            let data = {
                data: error,
                message:"Read User Error",
                state: false,
                code: 303
            };
            reject (data);          
        }
    });
}