import { logsSave } from "../view/logs_whatsapp.js";
import { readUser } from "../controller/read_data/read_data_from_dir.js";

export async function newListValueData( clientName, keyValue) {
    logsSave("Exec "+ keyValue+" List Value")
    let data;
    let listValue = [];

    return new Promise(
        async (resolve, reject) => {
            await readUser(clientName).then(
                async response =>{

                    let userData = await response.data;

                    userData.forEach(element => {
                        if (element[keyValue] !== ""){
                            if (!listValue.includes(element[keyValue])){
                                listValue.push(element[keyValue]); 
                            }   
                        }
     
                    });

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