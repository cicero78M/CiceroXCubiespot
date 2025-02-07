import { mkdirSync, writeFileSync } from "fs";
import { encrypted } from "../../module/crypto.js";
import { newRowsData } from "../../module/sheet_query.js";

export async function pushUserRes(clientName, sheetID) {
    return new Promise(async (resolve, reject) => {
        try {
            await newRowsData(sheetID, clientName)
            .then(
                async response =>{
                    let client = [];

                    let responseList = response.data; 
                    
                    for (let i = 0; i < data.data.length; i++){
        
                        let userData = new Object();
    
                        userData.ID_KEY =  encrypted(responseList[i].get("NRP"));
                        userData.NAMA =  encrypted(responseList[i].get("NAMA"));
                        userData.TITLE =  encrypted(responseList[i].get("PANGKAT"));
                        userData.DIVISI =  encrypted(responseList[i].get("SATFUNG"));
                        userData.JABATAN =  encrypted(responseList[i].get("JABATAN"));
                        userData.STATUS =  encrypted("TRUE");
                        userData.WHATSAPP =  encrypted("");
                        userData.INSTA =  encrypted("");
                        userData.TIKTOK =  encrypted("");
                        userData.EXCEPTION =  encrypted("FALSE");

                        try {
                            writeFileSync(`json_data_file/user_data/${clientName}/${responseList[i].get("NRP")}.json`, JSON.stringify(userData));
                        } catch (error) {
                            mkdirSync(`json_data_file/user_data/${clientName}`)
                            writeFileSync(`json_data_file/user_data/${clientName}/${responseList[i].get("NRP")}.json`, JSON.stringify(userData));
                        }

    
                    };

                    let data = {
                        data: `${clientName} JSON Data Successfully Added.`,
                        state: true,
                        code: 200
                    };
          
                    resolve (data);
                }
            )
        } catch (error) {
            let data = {
                data: error,
                message:"Push User Data Error",
                state: false,
                code: 303
            };
            reject (data);        
        } 
    });
}

export async function pushUserCom(clientName, sheetID) {
    return new Promise(async (resolve, reject) => {
        try {
            await newRowsData(sheetID, clientName)
            .then(
                async response =>{

                    let responseLiset = response.data;
                    
                    for (let i = 0; i < responseLiset.length; i++){
        
                        let userData = new Object();
    
                        userData.ID_KEY =  encrypted(responseLiset[i].get("ID_KEY"));
                        userData.NAMA =  encrypted(responseLiset[i].get("NAMA"));
                        userData.TITLE =  encrypted(responseLiset[i].get("TITLE"));
                        userData.DIVISI =  encrypted(responseLiset[i].get("DIVISI"));
                        userData.JABATAN =  encrypted(responseLiset[i].get("JABATAN"));
                        userData.STATUS =  encrypted("TRUE");
                        userData.WHATSAPP =  encrypted("");
                        userData.INSTA =  encrypted("");
                        userData.TIKTOK =  encrypted("");
                        userData.EXCEPTION =  encrypted("FALSE");

                        try {
                            writeFileSync(`json_data_file/user_data/${clientName}/${responseLiset[i].get("ID_KEY")}.json`, JSON.stringify(userData));
                        } catch (error) {
                            mkdirSync(`json_data_file/user_data/${clientName}`)
                            writeFileSync(`json_data_file/user_data/${clientName}/${responseLiset[i].get("ID_KEY")}.json`, JSON.stringify(userData));
                        }
    
                    };

                    let data = {
                        data: `${clientName} JSON Data Successfully Added.`,
                        state: true,
                        code: 200
                    };
          
                    resolve (data);                }
            )
        } catch (error) {
            let data = {
                data: error,
                message:"Push User Data Error",
                state: false,
                code: 303
              };
              reject (data);        
            } 
    });
}