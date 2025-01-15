import { encrypted } from "../../../json_data_file/crypto";
import { newRowsData } from "../new_query/sheet_query";

export async function pushUserRes(clientName, sheetID) {
    return new Promise(async (resolve, reject) => {
        try {
            await newRowsData(sheetID, clientName)
            .then(
                async data =>{
                    let client = [];
                    
                    for (let i = 0; i < data.length; i++){
        
                        let userData = new Object();
    
                        userData.ID_KEY = await encrypted(data[i].get("NRP"));
                        userData.NAMA = await encrypted(data[i].get("NAMA"));
                        userData.TITLE = await encrypted(data[i].get("PANGKAT"));
                        userData.DIVISI = await encrypted(data[i].get("SATFUNG"));
                        userData.JABATAN = await encrypted(data[i].get("JABATAN"));
                        userData.STATUS = await encrypted("TRUE");
                        userData.WHATSAPP = await encrypted("");
                        userData.INSTA = await encrypted("");
                        userData.TIKTOK = await encrypted("");
                        userData.EXCEPTION = await encrypted("FALSE");
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
    
                        userData.ID_KEY = await encrypted(data[i].get("ID_KEY"));
                        userData.NAMA = await encrypted(data[i].get("NAMA"));
                        userData.TITLE = await encrypted(data[i].get("TITLE"));
                        userData.DIVISI = await encrypted(data[i].get("DIVISI"));
                        userData.JABATAN = await encrypted(data[i].get("JABATAN"));
                        userData.STATUS = await encrypted("TRUE");
                        userData.WHATSAPP = await encrypted("");
                        userData.INSTA = await encrypted("");
                        userData.TIKTOK = await encrypted("");
                        userData.EXCEPTION = await encrypted("FALSE");
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