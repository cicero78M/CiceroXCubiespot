import { GoogleSpreadsheet } from "google-spreadsheet";
import { googleAuth } from "../database/new_query/sheet_query.js";
import { decrypted } from "../encryption/crypto.js";
import { readdirSync, readFileSync } from "fs";
import { logsSave } from "../responselogs/logs_modif.js";
import { clientData } from "../restore/client_data/read_client_data_from_json.js";

export async function userDataBackup() {    
    
  //Date Time
  let d = new Date();
  let localDate = d.toLocaleDateString("en-US", {timeZone: "Asia/Jakarta"});
  let data;
  
    return new Promise(async (resolve, reject) => {
        try {
            clientData().then(
                async response =>{ 

                    let clientData = response.data;

                    for (let i = 0; i < clientData.length; i++){

                        let userData = []

                        let data = readdirSync(`json_data_file/user_data/${decrypted(clientData[i].CLIENT_ID)}`);
        
                        for (let ii = 0; ii < data.length; ii++){
                            userData.push(JSON.parse(readFileSync(`json_data_file/user_data/${decrypted(clientData[i].CLIENT_ID)}/${data[ii]}`)));
                        } 
                        
                        let sheetDoc = new GoogleSpreadsheet(
                            process.env.userDataID, 
                            googleAuth
                        ); //Google Auth
                        await sheetDoc.loadInfo();
                        let newSheet = await sheetDoc.addSheet({ 
                            title: `${decrypted(clientData[i].CLIENT_ID)}_${localDate}`, 
                            headerValues: ['ID_KEY','NAMA',	'TITLE','DIVISI','JABATAN','STATUS','WHATSAPP','INSTA','TIKTOK','EXCEPTION', 'INSTA_2', 'INSTA_2_STATE']
                        });
    
                        await newSheet.addRows(userData);
    
                        logsSave(`${decrypted(clientData[i].CLIENT_ID)}_${localDate} Backed Up`);    

                    }       
                }
            );


            data = {
                data: "Success Back Up User Data",
                state: true,
                code: 200
            };

            resolve (data);     

        } catch (error) {
            data = {
                data: error,
                message: "User Data Backup Error",
                state: false,
                code: 303
            };
            
            reject (data);         
        }
    });
}