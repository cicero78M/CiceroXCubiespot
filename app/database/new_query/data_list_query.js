import { ciceroKey, newRowsData } from './sheet_query.js';

export async function newListValueData(clientName, keyValue) {

    let listValue = [];

    return new Promise(async (resolve) => {
        await newRowsData(ciceroKey.dbKey.userDataID, clientName).then( response => {        
            for (let i = 0; i < response.length; i++){
                if(!listValue.includes(response[i].get(keyValue))){
                  listValue.push(response[i].get(keyValue)); 
                }
            }

            resolve (listValue);
            
        }).catch(

            async response => {   
                setTimeout(() => {
                    console.error(response);
                    console.log ("Re-Try");
                }, 4000);

                await newRowsData(ciceroKey.dbKey.userDataID, clientName);
        }); 
    });
}