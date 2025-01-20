import { readFileSync } from "fs";
import { decrypted } from "../crypto.js";

export async function clientData() {    
    return new Promise(async (resolve, reject) => {
        try {
            let data = [];
            data = JSON.parse(readFileSync('json_data_file/client_data/client_data.json'));

            resolve (data);

        } catch (error) {
            reject (error)            
        }
    });
}