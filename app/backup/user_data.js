import { GoogleSpreadsheet } from "google-spreadsheet";
import { clientData } from "../../json_data_file/client_data/read_client_data_from_json.js";
import { googleAuth } from "../database/new_query/sheet_query.js";
import { decrypted } from "../../json_data_file/crypto.js";
import { readdirSync, readFileSync } from "fs";

export async function userDataBackup() {    
    
  //Date Time
  let d = new Date();
  let localDate = d.toLocaleDateString("en-US", {timeZone: "Asia/Jakarta"});
  
    return new Promise(async (resolve, reject) => {
        try {
            clientData().then(
                async response =>{ 

                    for (let i = 0; i < response.length; i++){

                        let userData = []

                        let data = readdirSync(`json_data_file/user_data/${decrypted(response[i].CLIENT_ID)}`);
        
                        for (let ii = 0; ii < data.length; ii++){
                            
                            
                            userData.push(JSON.parse(readFileSync(`json_data_file/user_data/${decrypted(response[i].CLIENT_ID)}/${data[ii]}`)));

                        } 
                        
                        let sheetDoc = new GoogleSpreadsheet(
                            process.env.userDataID, 
                            googleAuth
                        ); //Google Auth
                        await sheetDoc.loadInfo();
                        let newSheet = await sheetDoc.addSheet({ 
                            title: `${decrypted(response[i].CLIENT_ID)}_${localDate}`, 
                            headerValues: ['ID_KEY','NAMA',	'TITLE','DIVISI','JABATAN','STATUS','WHATSAPP','INSTA','TIKTOK','EXCEPTION']
                        });
    
                        await newSheet.addRows(userData);
    
                        console.log(`${decrypted(response[i].CLIENT_ID)}_${localDate} Backed Up`);    

                    }       
                }
            );

            resolve ("Success");
            
        } catch (error) {
            reject (error)            
        }
    });
}