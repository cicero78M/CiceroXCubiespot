import { readFileSync } from "fs";
import { decrypted } from "../crypto.js";

export async function userData() {    
    return new Promise(async (resolve, reject) => {
        try {
            let data = [];
            data = JSON.parse(readFileSync('json_data_file/user_data/client_data.json'));

            console.log(data.length);
            
            let client = [];
        
            for (let i = 0; i < data.length; i++){
                
                let userData = new Object();
                userData.ID_KEY = await decrypted(data[i].get("ID_KEY"));
                userData.NAMA = await decrypted(data[i].get("NAMA"));
                userData.TITLE = await decrypted(data[i].get("TITLE"));
                userData.DIVISI = await decrypted(data[i].get("DIVISI"));
                userData.JABATAN = await decrypted(data[i].get("JABATAN"));
                userData.STATUS = await decrypted(data[i].get("STATUS"));
                userData.WHATSAPP = await decrypted(data[i].get("WHATSAPP"));
                userData.INSTA = await decrypted(data[i].get("INSTA"));
                userData.TIKTOK = await decrypted(data[i].get("TIKTOK"));
                userData.EXCEPTION = await decrypted(data[i].get("EXCEPTION"));
        
                client.push(clientData);
        
            }
            
            resolve (client);
        } catch (error) {
            reject (error)            
        }
    });
}