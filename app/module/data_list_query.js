import { logsSave } from "../view/logs_whatsapp.js";
import { readUser } from "../controller/read_data/read_data_from_dir.js";

export async function newListValueData( clientName, keyValue) {
    logsSave("Exec "+ keyValue+" List Value")
    let data;
    return new Promise(
        async (resolve, reject) => {
            let listValue = [];
            await readUser(clientName).then(
                response =>{
                    let userData = response.data;
                    
                    for (let i = 0; i < userData.length; i++) {        
                        
                        if (!listValue.includes(userData[i][keyValue])){
                            listValue.push(userData[i][keyValue]); 
                        }                
                    }    

                    data = {
                        data: listValue,
                        state: true,
                        code: 200
                    };      

                    resolve (data);
                }
            ).catch(
                error =>{
                    data = {
                        data: error,
                        message:"New List Value Data Error",
                        state: false,
                        code: 303
                    };

                    reject (data);   
                } 
            )
        }
    );
}