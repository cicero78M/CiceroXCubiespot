import { getTiktokComments } from "./getTiktokComments.js";
import { postTiktokUserComments } from "./postTiktokUserComments.js";

export async function tiktokItemsBridges(clientName, items) {

    console.log("Execute Bridging");
    
    return new Promise(async (resolve, reject) => {
    
        try {
            for (let i = 0; i < items.length; i++) {
                await getTiktokComments(items[i])
                    .then (async response =>{
                        console.log(response.data);
                        await postTiktokUserComments(clientName, items[i], response.data)
                            .then(data => resolve(data))
                            .catch(error => reject (error));
                    }).catch(error => reject (error));
            }
            
            
        } catch (error) {
            let data = {
                data: error,
                state: false,
                code: 303
                };
            reject (data);
        }
    });
}
        
        
