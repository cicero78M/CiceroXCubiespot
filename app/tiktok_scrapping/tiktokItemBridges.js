import { client } from "../../app";
import { getTiktokComments } from "./getTiktokComments";
import { postTiktokUserComments } from "./postTiktokUserComments";

export async function tiktokItemsBridges(clientName, items) {
    

    return new Promise((resolve, reject) => {
        try {

            for (let i = 0; i < items.length; i++) {

                getTiktokComments(items[i]).then (async response =>{
        
                    client.sendMessage('6281235114745@c.us', `Get Tiktok Comment ${clientName}, with Code ${items[i]}`);
                    await postTiktokUserComments(clientName, items[i], response).then(output =>{
                        client.sendMessage('6281235114745@c.us', `Post Username Tiktok Comment ${clientName}, with Code ${items[i]}`);

                        let data = {
                            data: output,
                            state: true,
                            code: 200
                          };

                        resolve(data);
             
                    }).catch(error => {

                        console.error(error);
                        let data = {
                            data: error,
                            state: false,
                            code: 303
                            };
                        reject (data);        
                    })
                }).catch(error =>{
                    console.error(error)
                    let data = {
                        data: error,
                        state: false,
                        code: 303
                        };
                    reject (data);
                });
              } 
            
        } catch (error) {

            console.error(error)        
            let data = {
                data: error,
                state: false,
                code: 303
                };
            reject (data);

        }
    })
    
    
}
        
        
