import { ciceroKey, newRowsData } from "../../app/database/new_query/sheet_query.js";
import { encrypted } from "../crypto.js";
import { writeFileSync } from 'fs'

export async function transferUserData(clientID) {
    return new Promise(async (resolve, reject) => {

        try {
            await newRowsData(
                ciceroKey.dbKey.userDataID, 
                clientID
            ).then(
                async data =>{
                    let client = [];
                    
                    for (let i = 0; i < data.length; i++){
        
                        let userData = new Object();
                        userData.ID_KEY = await encrypted(data[i].get("ID_KEY"));
                        userData.NAMA = await encrypted(data[i].get("NAMA"));
                        userData.TITLE = await encrypted(data[i].get("TITLE"));
                        userData.DIVISI = await encrypted(data[i].get("DIVISI"));
                        userData.JABATAN = await encrypted(data[i].get("JABATAN"));
                        userData.STATUS = await encrypted(data[i].get("STATUS"));
                        userData.WHATSAPP = await encrypted(data[i].get("WHATSAPP"));
                        userData.INSTA = await encrypted(data[i].get("INSTA"));
                        userData.TIKTOK = await encrypted(data[i].get("TIKTOK"));
                        userData.EXCEPTION = await encrypted(data[i].get("EXCEPTION"));
                        client.push(userData);
                    };
        
                    writeFileSync(`json_data_file/user_data/${clientID}.json`, JSON.stringify(client));
                    resolve (`${clientID} JSON Data Successfully Added.`);
                }
            );
        } catch (error) {
            reject (error)
        }
    });
}