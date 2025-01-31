import { decrypted } from "../../encryption/crypto.js";
import { logsSave } from "../../responselogs/logs_modif.js";

export async function clientDataView(data) {    
    return new Promise(async (resolve, reject) => {
        try {
            
            logsSave("Collecting Client Data");
            let response =  {

                data: 
                `Client : ${decrypted(data.CLIENT_ID)}

                Type : ${decrypted(data.TYPE)}
                State : ${decrypted(data.STATUS)}
                Insta : ${decrypted(data.INSTAGRAM)}
                Insta State : ${decrypted(data.INSTA_STATE)}
                Insta 2nd : ${decrypted(data.INSTA_2)}
                Insta 2nd State : ${decrypted(data.INSTA_2_STATE)}
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