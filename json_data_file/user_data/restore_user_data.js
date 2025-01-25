import { newRowsData } from "../../app/database/new_query/sheet_query.js";
import { mkdirSync, writeFileSync } from 'fs'
import { decrypted } from "../crypto.js";

export async function restoreUserData(clientID) {
       
    //Date Time
    let d = new Date();
    let localDate = d.toLocaleDateString("en-US", {timeZone: "Asia/Jakarta"});

    return new Promise(async (resolve, reject) => {

        try {
            await newRowsData(
                process.env.userDataID, 
                `${clientID}_${localDate}`
            ).then(
                async data =>{
                    
                    for (let i = 0; i < data.length; i++){
        
                        let userData = new Object();

                        userData.ID_KEY = data[i].get("ID_KEY");
                        userData.NAMA = data[i].get("NAMA");
                        userData.TITLE = data[i].get("TITLE");
                        userData.DIVISI = data[i].get("DIVISI");
                        userData.JABATAN = data[i].get("JABATAN");
                        userData.STATUS = data[i].get("STATUS");
                        userData.WHATSAPP = data[i].get("WHATSAPP");
                        userData.INSTA = data[i].get("INSTA");
                        userData.TIKTOK = data[i].get("TIKTOK");
                        userData.EXCEPTION = data[i].get("EXCEPTION");

                        try {

                            writeFileSync(`json_data_file/user_data/${clientID}/${decrypted(data[i].get("ID_KEY"))}.json`, JSON.stringify(userData));
                            resolve (`${data[i].get("ID_KEY")} JSON Data Successfully Added.`);

                        } catch (error) {

                            mkdirSync(`json_data_file/user_data/${clientID}`);
                            writeFileSync(`json_data_file/user_data/${clientID}/${decrypted(data[i].get("ID_KEY"))}.json`, JSON.stringify(userData));
                            
                        }
                    }
                }
            );

        } catch (error) {
            reject (error)
        }
    });
}