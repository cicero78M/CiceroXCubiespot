import { ciceroKey, newRowsData } from "../../app/database/new_query/sheet_query.js";
import { encrypted } from "../crypto.js";
import { mkdirSync, writeFileSync } from 'fs'

export async function transferUserData(clientID) {
    return new Promise(async (resolve, reject) => {

        try {
            await newRowsData(
                ciceroKey.dbKey.userDataID, 
                clientID
            ).then(
                async data =>{
                    
                    for (let i = 0; i < data.length; i++){
        
                        let userData = new Object();

                        userData.ID_KEY = encrypted(data[i].get("ID_KEY"));
                        userData.NAMA = encrypted(data[i].get("NAMA"));
                        userData.TITLE = encrypted(data[i].get("TITLE"));
                        userData.DIVISI = encrypted(data[i].get("DIVISI"));
                        userData.JABATAN = encrypted(data[i].get("JABATAN"));
                        userData.STATUS = encrypted(data[i].get("STATUS"));
                        userData.WHATSAPP = encrypted(data[i].get("WHATSAPP"));
                        userData.INSTA = encrypted(data[i].get("INSTA"));
                        userData.TIKTOK = encrypted(data[i].get("TIKTOK"));
                        userData.EXCEPTION = encrypted(data[i].get("EXCEPTION"));

                        try {

                            writeFileSync(`json_data_file/user_data/${clientID}/${data[i].get("ID_KEY")}.json`, JSON.stringify(userData));
                            resolve (`${data[i].get("ID_KEY")} JSON Data Successfully Added.`);

                        } catch (error) {

                            mkdirSync(`json_data_file/user_data/${clientID}`);
                            writeFileSync(`json_data_file/user_data/${clientID}/${data[i].get("ID_KEY")}.json`, JSON.stringify(userData));
                            
                        }
                    }
                }
            );

        } catch (error) {
            reject (error)
        }
    });
}