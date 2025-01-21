import { readFileSync,  } from "fs";

export async function clientData() {    
    return new Promise(async (resolve, reject) => {
        try {
            let data = [];
            data = JSON.parse(readFileSync('json_data_file/client_data/client_data.json'));
            console.log(data.length);

            resolve (data);
            
        } catch (error) {
            reject (error)            
        }
    });
}