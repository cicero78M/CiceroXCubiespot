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

                userData.ID_KEY = decrypted(data[i].ID_KEY);
                userData.NAMA = decrypted(data[i].NAMA);
                userData.TITLE = decrypted(data[i].TITLE);
                userData.DIVISI = decrypted(data[i].DIVISI);
                userData.JABATAN = decrypted(data[i].JABATAN);
                userData.STATUS = decrypted(data[i].STATUS);
                userData.WHATSAPP = decrypted(data[i].WHATSAPP);
                userData.INSTA = decrypted(data[i].INSTA);
                userData.TIKTOK = decrypted(data[i].TIKTOK);
                userData.EXCEPTION = decrypted(data[i].EXCEPTION);
                client.push(userData);
        
            }    
            resolve (client);
        } catch (error) {
            reject (error)            
        }
    });
}