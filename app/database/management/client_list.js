import { readFileSync  } from "fs";
import { decrypted } from "../../../json_data_file/crypto";

export async function dataView() {    
    return new Promise(async (resolve, reject) => {
        try {
            
            console.log("Collecting Client Data");

            let data = [];
            data = JSON.parse(readFileSync('json_data_file/client_data/client_data.json'));

            let response =  {

                data: 
                `Name : ${decrypted(data.CLIENT_ID)}
                
                Type : ${decrypted(data.TYPE)}
                State : ${decrypted(data.STATUS)}
                Insta : ${decrypted(data.INSTAGRAM)}
                Insta State : ${decrypted(data.INSTA_STATE)}
                Tiktok : ${decrypted(data.TIKTOK)}
                Tiktok State : ${decrypted(data.TIKTOK_STATE)}
                Secuid : ${decrypted(data.SECUID)}
                Supervisor : ${decrypted(data.SUPERVISOR)}
                Operator : ${decrypted(data.OPERATOR)}
                Group : ${decrypted(data.GROUP)}
                `,
                state: true,
                code: 200
            } 

            resolve (response);
            
        } catch (error) {
            let response = {
                data: error,
                state: false,
                code: 303
            }
            reject (response)            
        }
    });
}