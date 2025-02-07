import { readdirSync, readFileSync  } from "fs";
import { logsSave } from "../../view/logs_whatsapp.js";

export async function clientData() {    

    logsSave("Execute Client Data")

    let data;

    return new Promise(async (resolve, reject) => {
        try {
            
            let clientList = [];

            clientDir = JSON.parse(readdirSync('json_data_file/client_data'));

            console.log(clientDir);



            // clientList = JSON.parse(readFileSync('json_data_file/client_data/client_data.json'));
            
            // data = {
            //     data: clientList,
            //     state: true,
            //     code: 200
            //   };

            // resolve (data);
            
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