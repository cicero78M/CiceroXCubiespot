import { encrypted } from "../../../json_data_file/crypto.js";
import { newRowsData } from "../new_query/sheet_query.js";

export async function pushUserRes(clientName, sheetID) {
    return new Promise(async (resolve, reject) => {
        try {
            await newRowsData(sheetID, clientName)
            .then(
                async data =>{
                    let client = [];
                    
                    for (let i = 0; i < data.length; i++){
        
                        let userData = new Object();
    
                        userData.ID_KEY =  encrypted(data[i].get("NRP"));
                        userData.NAMA =  encrypted(data[i].get("NAMA"));
                        userData.TITLE =  encrypted(data[i].get("PANGKAT"));
                        userData.DIVISI =  encrypted(data[i].get("SATFUNG"));
                        userData.JABATAN =  encrypted(data[i].get("JABATAN"));
                        userData.STATUS =  encrypted("TRUE");
                        userData.WHATSAPP =  encrypted("");
                        userData.INSTA =  encrypted("");
                        userData.TIKTOK =  encrypted("");
                        userData.EXCEPTION =  encrypted("FALSE");
                        client.push(userData);
    
                    };

                    writeFileSync(`json_data_file/user_data/${clientName}.json`, JSON.stringify(client));
                    resolve (`${clientName} JSON Data Successfully Added.`);
                }
            )
        } catch (error) {
            reject (error);
        } 
    });
}

export async function pushUserCom(clientName, sheetID) {
    return new Promise(async (resolve, reject) => {
        try {
            await newRowsData(sheetID, clientName)
            .then(
                async data =>{
                    let client = [];
                    
                    for (let i = 0; i < data.length; i++){
        
                        let userData = new Object();
    
                        userData.ID_KEY =  encrypted(data[i].get("ID_KEY"));
                        userData.NAMA =  encrypted(data[i].get("NAMA"));
                        userData.TITLE =  encrypted(data[i].get("TITLE"));
                        userData.DIVISI =  encrypted(data[i].get("DIVISI"));
                        userData.JABATAN =  encrypted(data[i].get("JABATAN"));
                        userData.STATUS =  encrypted("TRUE");
                        userData.WHATSAPP =  encrypted("");
                        userData.INSTA =  encrypted("");
                        userData.TIKTOK =  encrypted("");
                        userData.EXCEPTION =  encrypted("FALSE");
                        client.push(userData);
    
                    };

                    writeFileSync(`json_data_file/user_data/${clientName}.json`, JSON.stringify(client));
                    resolve (`${clientName} JSON Data Successfully Added.`);
                }
            )
        } catch (error) {
            reject (error);
        } 
    });
}