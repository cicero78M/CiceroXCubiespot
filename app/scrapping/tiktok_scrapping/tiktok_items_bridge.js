import { client } from "../../../app.js";
import { decrypted } from "../../../json_data_file/crypto.js";
import { newReportTiktok } from "../../reporting/tiktok_report.js";
import { logsResponse } from "../../responselogs/logs_modif.js";
import { getTiktokComments } from "./generate_tiktok_comments.js";
import { postTiktokUserComments } from "./post_username_comment_tiktok_data.js";

export async function tiktokItemsBridges(clientValue, items) {

    logsResponse("Execute Tiktok Bridging");
    client.sendMessage('6281235114745@c.us', "Execute Tiktok Bridging");

    return new Promise(async (resolve, reject) => {
        try {        
            for (let i = 0; i < items.length; i++) {
                
                await getTiktokComments(items[i])
                .then (async response =>{
                    await postTiktokUserComments(decrypted(clientValue.CLIENT_ID), items[i], response.data)
                    .then(async data => {
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