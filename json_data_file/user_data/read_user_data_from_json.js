import { readFileSync } from "fs";
import { decrypted } from "../crypto.js";

export async function userData(clientName) {    
    return new Promise(async (resolve, reject) => {
        try {
            let data = [];

            data = JSON.parse(readFileSync(`json_data_file/user_data/${clientName}.json`));

            console.log(data);
            
            let client = [];
        
            for (let i = 0; i < data.length; i++){
                
                let userData = new Object();

                userData.ID_KEY = await decrypted(data[i].ID_KEY);
                userData.NAMA = await decrypted(data[i].NAMA);
                userData.TITLE = await decrypted(data[i].TITLE);
                userData.DIVISI = await decrypted(data[i].DIVISI);
                userData.JABATAN = await decrypted(data[i].JABATAN);
                userData.STATUS = await decrypted(data[i].STATUS);
                userData.WHATSAPP = await decrypted(data[i].WHATSAPP);
                userData.INSTA = await decrypted(data[i].INSTA);
                userData.TIKTOK = await decrypted(data[i].TIKTOK);
                userData.EXCEPTION = await decrypted(data[i].EXCEPTION);
                client.push(userData);
        
            }    
            resolve (client);
        } catch (error) {
            reject (error)            
        }
    });
}