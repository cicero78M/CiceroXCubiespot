import { GoogleSpreadsheet } from "google-spreadsheet";
import { googleAuth } from "../database/new_query/sheet_query.js";
import { clientData } from "../restore/client_data/read_client_data_from_json.js";

export async function clientDataBackup() {    
    
    //Date Time
    let d = new Date();
    let localDate = d.toLocaleDateString("en-US", {timeZone: "Asia/Jakarta"});
    let data;
    
    return new Promise(async (resolve, reject) => {
        try {
            clientData().then(
                async response =>{ 

                    const sheetDoc = new GoogleSpreadsheet(
                        process.env.clientDataID, 
                        googleAuth
                    ); //Google Auth
                    await sheetDoc.loadInfo();
                    const newSheet = await sheetDoc.addSheet({ 
                        title: localDate, 
                        headerValues: ['CLIENT_ID','TYPE',	'STATUS','INSTAGRAM','TIKTOK','INSTA_STATE','TIKTOK_STATE','SUPERVISOR','OPERATOR','GROUP',	'SECUID', 'INSTA_2', 'INSTA_2_STATE']
                    });

                    await newSheet.addRows(response.data);
                }
            );

            data = {
                data: "Success Back Up Client Data",
                state: true,
                code: 200
            };

            resolve (data);        

        } catch (error) {
            data = {
                data: error,
                message: "Error Client Data Backup",
                state: false,
                code: 303
            };
            
            reject (data);        
        }
    });
}