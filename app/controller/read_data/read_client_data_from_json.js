import { readdirSync, readFileSync  } from "fs";
import { logsSave } from "../../view/logs_whatsapp.js";

export async function clientData() {    

    logsSave("Execute Client Data")

    let data;

    return new Promise(async (resolve, reject) => {
        try {
            
            let clientList = [];

            clientDir = readdirSync('json_data_file/client_data');

            clientDir.forEach(element => {

                clientList.push(JSON.parse(readFileSync(`json_data_file/client_data/${element}`)));
                
            });




            // clientList = JSON.parse(readFileSync('json_data_file/client_data/client_data.json'));
            
            data = {
                data: clientList,
                state: true,
                code: 200
              };

            resolve (data);
            
        } catch (error) {
            data = {
                data: error,
                message:"Client Data Error",
                state: false,
                code: 303
            };
            reject (data);         
        }
    });
}