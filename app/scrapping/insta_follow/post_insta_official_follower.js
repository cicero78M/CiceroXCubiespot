import { GoogleSpreadsheet } from "google-spreadsheet";
import { client } from "../../../app.js";
import { googleAuth } from "../../database/new_query/sheet_query.js";
import { logsSave } from "../../responselogs/logs_modif.js";

export async function postInstaFollowersOfficial(clientName, array) {

    return new Promise(async (resolve, reject) => {
        logsSave("Post Data Username Official Followers" );
        client.sendMessage('6281235114745@c.us', "Post Data Username Official Followers");
        
        try {
    
            let userdata =[]; 
            let childrenArray = [];
    
            const instaOfficialFollowerDoc = new GoogleSpreadsheet(process.env.instaOfficialFollowers, googleAuth); //Google Authentication for instaLikes Username DB
            await  instaOfficialFollowerDoc.loadInfo(); // loads document properties and worksheets            
            let instaOfficialFollowerSheet = instaOfficialFollowerDoc.sheetsByTitle[clientName];

            await instaOfficialFollowerSheet.getRows().then ( 
                async response =>{
                    for (let i = 0; i < response.length; i++) {
                        if (!userdata.includes(response[i].get("USERNAME"))) {
                            userdata.push(response[i].get("USERNAME"));
                        }
                    }
                    for (let i = 0; i < array.length; i++) {
                        if (!userdata.includes(array[i].username)) {
                            childrenArray.push({USERNAME:array[i].username,	INSTA_ID:array[i].id,	isPRIVATE:array[i].is_private,	isVERIFIED:array[i].is_verified, FULL_NAME:array[i].full_name});
                        }
                    }
                    await instaOfficialFollowerSheet.addRows(childrenArray);
                    

                    let data = {
                        data: `Insta Official Follower Accounts Added`,
                        code: 200,
                        state: true
                    };
                    
                    logsSave (`Insta Official Follower Accounts Added`);
                    resolve(data);
                }
            );
            
        } catch (error) {
            let data = {
                data: error,
                state: true,
                code: 303
            };
            logsSave (data.data);
            reject (data);
        }
    });
}