import { client } from "../../../app.js";
import { newReportTiktok } from "../../reporting/newTiktokReport.js";
import { getTiktokComments } from "./getTiktokComments.js";
import { postTiktokUserComments } from "./postTiktokUserComments.js";

export async function tiktokItemsBridges(clientValue, items) {

    console.log("Execute Tiktok Bridging");
    client.sendMessage('6281235114745@c.us', "Execute Tiktok Bridging");

    return new Promise(async (resolve, reject) => {
        try {        
            for (let i = 0; i < items.length; i++) {
                await getTiktokComments(items[i])
                .then (async response =>{
                    await postTiktokUserComments(clientValue.get('CLIENT_ID'), items[i], response.data)
                    .then(async data => {
                        console.log(data);
                        await client.sendMessage('6281235114745@c.us', data.data);
                    }).catch(error => reject (error));               
                }).catch(error => reject (error));
            }

            await newReportTiktok(clientValue).then(
                data => {
                    resolve (data)
            }).catch(                
                data => {
                    reject (data)
            });
        
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