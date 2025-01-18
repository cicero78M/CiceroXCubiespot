import { readdirSync, readFileSync } from "fs";
import { decrypted } from "../crypto.js";

export async function userDir(clientName) {    
    return new Promise(async (resolve, reject) => {
        try {
            let data = [];

            data = readdirSync(`json_data_file/user_data/${clientName}`);

            console.log(data);
            
            let client = [];
        
            for (let i = 0; i < data.length; i++){
                
                let fromJson = JSON.parse(readFileSync(`json_data_file/user_data/${clientName}/${data[i]}`));
                
                let userData = new Object();

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

            resolve (client);
        } catch (error) {
            reject (error)            
        }
    });
}