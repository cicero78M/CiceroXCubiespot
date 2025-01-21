import { clientData } from "../../json_data_file/client_data/read_client_data_from_json.js";
import { googleAuth } from "../database/new_query/sheet_query.js";

export async function clientDataBackup() {    
    
  //Date Time
  let d = new Date();
  let localDate = d.toLocaleDateString("en-US", {timeZone: "Asia/Jakarta"});
  
    return new Promise(async (resolve, reject) => {
        try {
            clientData().then(
                async response =>{ 

                    const sheetDoc = new GoogleSpreadsheet(
                        process.env.clientDataID, 
                        googleAuth
                    ); //Google Auth
                    await sheetDoc.loadInfo();
                    const newSheet = await sheetDoc.addSheet({ title: localDate });

                    await newSheet.addRows(response);

                }
            );

            resolve ("Success");
            
        } catch (error) {
            reject (error)            
        }
    });
}