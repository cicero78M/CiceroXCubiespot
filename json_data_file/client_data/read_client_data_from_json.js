import { readFileSync  } from "fs";
import { logsResponse } from "../../app/responselogs/response_view.js";

export async function clientData() {    
    return new Promise(async (resolve, reject) => {
        try {
            
            logsResponse("Collecting Client Data");

            let data = [];
            data = JSON.parse(readFileSync('json_data_file/client_data/client_data.json'));

            resolve (data);
            
        } catch (error) {
            reject (error)            
        }
    });
}