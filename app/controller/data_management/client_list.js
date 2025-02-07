import { decrypted } from "../../module/crypto.js";
import { logsSave } from "../../view/logs_whatsapp.js";

export async function clientDataView(data) {    
    return new Promise(async (resolve, reject) => {
        try {
            
            logsSave("Collecting Client Data");

            console.log();

            if (decrypted(data.TYPE) === process.env.APP_CLIENT_TYPE){

                
                let response =  {

                    data: 
                    `Client : ${decrypted(data.CLIENT_ID)}
    
                    Account Type : ${decrypted(data.TYPE)}
                    State : ${decrypted(data.STATUS)}
                    Insta Primary: ${decrypted(data.INSTAGRAM)}
                    Insta Primary State : ${decrypted(data.INSTA_STATE)}
                    Insta Secondary : ${decrypted(data.INSTA_2)}
                    Insta Secondary State : ${decrypted(data.INSTA_2_STATE)}
                    Tiktok Primary : ${decrypted(data.TIKTOK)}
                    Tiktok Primary State : ${decrypted(data.TIKTOK_STATE)}
                    tiktok Secuid : ${decrypted(data.SECUID)}
                    Supervisor : ${decrypted(data.SUPERVISOR)}
                    Operator : ${decrypted(data.OPERATOR)}
                    Group : ${decrypted(data.GROUP)}
                    `,
                    state: true,
                    code: 200
                } 

                resolve (response);
            }
            
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