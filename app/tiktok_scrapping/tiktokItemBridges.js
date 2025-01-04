import { getTiktokComments } from "./getTiktokComments.js";
import { postTiktokUserComments } from "./postTiktokUserComments.js";

export async function tiktokItemsBridges(clientName, items) {
    
    return new Promise(async (resolve, reject) => {
    
        try {
            for (let i = 0; i < items.length; i++) {
                await getTiktokComments(items[i])
                    .then (async response =>{
                        await postTiktokUserComments(clientName, items[i], response)
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
        
        
