import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "fs";
import { client } from "../../../app.js";
import { decrypted, encrypted } from "../../../json_data_file/crypto.js";


export async function postTiktokUserComments(clientName, items, userdata) {

    let hasShortcode = false;
    let encryptedData = [];

    console.log("Post Data Username Tiktok Engagement" );
    client.sendMessage('6281235114745@c.us', "Post Data Username Tiktok Engagement");

    return new Promise(async (resolve, reject) => { 
        try {

            let tiktokCommentsDir = readdirSync(`json_data_file/tiktok_data/tiktok_engagement/tiktok_comments/${clientName}`);
            
            for (let i = 0; i < tiktokCommentsDir.length; i++) {
                if (items === (tiktokCommentsDir[i]).replace(".json", "")) {
                    
                    hasShortcode = true;
                    encryptedData = [];
                
                    let tiktokComments = await JSON.parse(readFileSync(`json_data_file/tiktok_data/tiktok_engagement/tiktok_comments/${clientName}/${items}.json`));

                    for (let ii = 0; ii < tiktokComments.length; ii++) {
                        if (decrypted(tiktokComments[ii]) != undefined || decrypted(tiktokComments[ii]) != null || decrypted(tiktokComments[ii]) != "") {
                            if (!userdata.includes(decrypted(tiktokComments[ii]))) {
                                userdata.push(decrypted(tiktokComments[ii]));
                            }
                        }
                    }


                    for (let ii = 0; ii < userdata.length; ii++) {
                        encryptedData.push(encrypted(userdata[ii]));
                    }

                        
                    try {
    
                        writeFileSync(`json_data_file/tiktok_data/tiktok_engagement/tiktok_comments/${clientName}/${items}.json`, JSON.stringify(encryptedData));
                    
                    } catch (error) {
            
                        mkdirSync(`json_data_file/tiktok_data/tiktok_engagement/tiktok_comments/${clientName}`);
                        writeFileSync(`json_data_file/tiktok_data/tiktok_engagement/tiktok_comments/${clientName}/${items}.json`, JSON.stringify(encryptedData));
                
                    }   


                }
            }



            if(!hasShortcode){


                for (let i = 0; i < userdata.length; i++){
                    encryptedData.push(encrypted(userdata[i]));
                }

                try {
  
                    writeFileSync(`json_data_file/tiktok_data/tiktok_engagement/tiktok_comments/${clientName}/${items}.json`, JSON.stringify(encryptedData));
                
                } catch (error) {
          
                  mkdirSync(`json_data_file/tiktok_data/tiktok_engagement/tiktok_comments/${clientName}`);
                  writeFileSync(`json_data_file/tiktok_data/tiktok_engagement/tiktok_comments/${clientName}/${items}.json`, JSON.stringify(encryptedData));
                
                }                  
            }
            
            let data = {
                data: `${clientName} Adding Tiktok Username to ${items}`,
                state: true,
                code: 200
            };

            resolve (data);        
            
        } catch (error) {
            let data = {
                    data: error,
                    state: true,
                    code: 303
                };
            reject (data);
        }
    }); 
}