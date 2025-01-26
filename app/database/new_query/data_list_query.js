import { readUser } from "../../../json_data_file/user_data/read_data_from_dir.js";
import { logsSave } from "../../responselogs/logs_modif.js";

export async function newListValueData( clientName, keyValue) {
    logsSave("Exec List Value")
    return new Promise(
        async (resolve, reject) => {

            let listValue = [];
        
            await readUser(clientName).then(
            data =>{
                    
                    for (let i = 0; i < data.length; i++) {            
                        
                        if (!listValue.includes(data[i][keyValue])){
                            listValue.push(data[i][keyValue]); 

                        }
                        
                        data = {
                            data: listValue,
                            state: true,
                            code: 200
                        };      

                        resolve (data);                    }                   
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