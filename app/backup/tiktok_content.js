import { client } from '../../app.js';
import { decrypted } from '../../json_data_file/crypto.js';
import { readdirSync, readFileSync } from 'fs';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { googleAuth } from '../database/new_query/sheet_query.js';
import { logsSave } from '../responselogs/logs_modif.js';
  
export async function tiktokContentBackup(clientValue) {

    return new Promise(
        async (resolve, reject) => {
        
            try {

                logsSave("Execute Report Tiktok");
                client.sendMessage(
                    '6281235114745@c.us', 
                    "Execute Report Tiktok"
                );
            
                //Date Time
                let d = new Date();
                let localDate = d.toLocaleDateString("en-US", {timeZone: "Asia/Jakarta"});

                let shortcodeList = [];
      
                const clientName = decrypted(clientValue.CLIENT_ID);

                if (decrypted(clientValue.TIKTOK_STATE)) {
                    if (clientName !== "PONOROGO"){

                        let tiktokContentDir = readdirSync(`json_data_file/tiktok_data/tiktok_content/${clientName}`);

                        for (let i = 0; i < tiktokContentDir.length; i++) {
    
                            let contentItems = JSON.parse(readFileSync(`json_data_file/tiktok_data/tiktok_content/${clientName}/${tiktokContentDir[i]}`));
    
                                                            // console.log(contentItems);
    
                            let itemDate = new Date(Number(decrypted(contentItems.TIMESTAMP)) * 1000);
                            let dateNow = itemDate.toLocaleDateString("en-US", {timeZone: "Asia/Jakarta"});
    
                            // console.log(itemDate.toLocaleDateString("en-US", {timeZone: "Asia/Jakarta"}));
                            // console.log(localDate);
    
                            if ( dateNow === localDate) {
                                shortcodeList.push(contentItems);

                            }   
                        }

                    }
                                      

        
                    if (shortcodeList.length >= 1) {   
                        const sheetDoc = new GoogleSpreadsheet(
                            process.env.tiktokOfficialID, 
                            googleAuth
                        ); //Google Auth
            
                        await sheetDoc.loadInfo();
                        const sheetName = sheetDoc.sheetsByTitle[`${clientName}_BACKUP`];
                        await sheetName.addRows(shortcodeList);
            
                        let data = {
                            data: `${clientName} Added Tiktok Content Data`,
                            state: true,
                            code: 200
                          };
            
                          resolve (data);

                    } else {
                        let responseData = {
                            data: 'Tidak ada Konten Data untuk di Olah',
                            state: true,
                            code: 201
                        };
                        console.log(responseData.data);
                        reject (responseData);
                    }
                } else {   
                    let responseData = {
                        data: 'Your Client ID has Expired, Contacts Developers for more Informations',
                        state: true,
                        code: 201
                    };
                    console.log(responseData.data);               
                    reject (responseData);
                }
            } catch (error) {
                let responseData = {
                    data: error,
                    message: "Tiktok Backup Fail No Data",
                    state: false,
                    code: 303
                };
                reject (responseData);
            }
        }
    );
}