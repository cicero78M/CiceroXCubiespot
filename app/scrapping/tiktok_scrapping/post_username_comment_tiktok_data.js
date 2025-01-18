import { GoogleSpreadsheet } from "google-spreadsheet";
import { client } from "../../../app.js";
import { ciceroKey, googleAuth } from "../../database/new_query/sheet_query.js";


export async function postTiktokUserComments(clientName, items, userdata) {

    let hasShortcode = false;

    console.log("Post Data Username Tiktok Engagement" );
    client.sendMessage('6281235114745@c.us', "Post Data Username Tiktok Engagement");

    return new Promise(async (resolve, reject) => { 
        try {
            let tiktokCommentsUsernameDoc;
            let tiktokCommentsUsernameSheet;
           try {
                tiktokCommentsUsernameDoc = new GoogleSpreadsheet(ciceroKey.dbKey.tiktokCommentUsernameID, googleAuth); //Google Authentication for instaLikes Username DB
                await  tiktokCommentsUsernameDoc.loadInfo(); // loads document properties and worksheets            
                tiktokCommentsUsernameSheet = tiktokCommentsUsernameDoc.sheetsByTitle[clientName];
           } catch (error) {

            setTimeout(() => {
                console.log("Await");
            }, 10000);

            tiktokCommentsUsernameDoc = new GoogleSpreadsheet(ciceroKey.dbKey.tiktokCommentUsernameID, googleAuth); //Google Authentication for instaLikes Username DB
            await  tiktokCommentsUsernameDoc.loadInfo(); // loads document properties and worksheets            
            tiktokCommentsUsernameSheet = tiktokCommentsUsernameDoc.sheetsByTitle[clientName];
           }
            
            await tiktokCommentsUsernameSheet.getRows().then ( async response =>{

                for (let ii = 0; ii < response.length; ii++) {

                    
                    if (response[ii].get('SHORTCODE') === items) {
                        hasShortcode = true;

                        const fromRows = Object.values(response[ii].toObject());

                        for (let iii = 0; iii < fromRows.length; iii++) {
                            if (fromRows[iii] != undefined || fromRows[iii] != null || fromRows[iii] != "") {
                                if (!userdata.includes(fromRows[iii])) {
                                    userdata.push(fromRows[iii]);
                                }
                            }
                        }
                        await response[ii].delete();
                        await tiktokCommentsUsernameSheet.addRow(userdata);
                    }
                }

                if(!hasShortcode){
                    await tiktokCommentsUsernameSheet.addRow(userdata);                        
                }

                let data = {
                    data: `${clientName} Adding Tiktok Username to ${items}`,
                    state: true,
                    code: 200
                };

                resolve (data);  
            });


            
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