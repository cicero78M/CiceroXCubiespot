import { readFileSync  } from "fs";

export async function clientDataView() {    
    return new Promise(async (resolve, reject) => {
        try {
            
            console.log("Collecting Client Data");

            let data = [];
            data = JSON.parse(readFileSync('json_data_file/client_data/client_data.json'));

            resolve (data);
            
        } catch (error) {
            reject (error)            
        }
    });
}