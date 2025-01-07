import { GoogleSpreadsheet } from "google-spreadsheet";
import { ciceroKey, googleAuth } from "../../database/new_query/sheet_query.js";
import { instaInfoAPI } from "../../socialMediaAPI/insta_API.js";


export async function instaClientInfo(clietName, username) {

    return new Promise(async (resolve, reject) => {
        try {

            const instaClientDoc = new GoogleSpreadsheet(ciceroKey.dbKey.clientInstaProfile, googleAuth); //Google Authentication for InstaOfficial DB  
            await instaClientDoc.loadInfo(); // loads document properties and worksheets
            const instaClientSheet = instaClientDoc.sheetsByTitle["PROFILE"];
            let instaClientRows = await instaClientSheet.getRows();

            await instaInfoAPI(username).then (
                async responseInstaInfo =>{
                    isDataExist = false;   

                    for (let i = 0; i < instaClientRows.length; i++){
                        if(instaClientRows[i].get("USERNAME") === username){
                            isDataExist = true;   
                            instaClientRows[i].assign({
                                CLIENT_ID: clietName, USERNAME: username, isPRIVATE:responseInstaInfo.data.data.is_private, isBUSSINESS:responseInstaInfo.data.data.is_business, isVERIFIED:responseInfo.data.data.is_verified,
                                CATEGORY:responseInstaInfo.data.data.category, CONTACT:responseInstaInfo.data.data.contact_phone_number, EMAIL:responseInstaInfo.data.data.public_email, FULL_NAME:responseInfo.data.data.full_name,	
                                FOLLOWER:responseInstaInfo.data.data.follower_count, FOLLOWING:responseInstaInfo.data.data.following_count, MEDIA_COUNT:responseInstaInfo.data.data.media_count,
                                BIOGRAPHY:responseInstaInfo.data.data.biography
                            });

                            await instaClientRows[i].save();

                            let data = {
                                data: `Insta Official Account Updated `,
                                code: 200,
                                state: true
                            };
                    
                            resolve (data);
                        }     
                    }
                    if (!isDataExist){
                        instaClientSheet.addRow({
                            CLIENT_ID: clietName, USERNAME: username, isPRIVATE:responseInstaInfo.data.data.is_private, isBUSSINESS:responseInstaInfo.data.data.is_business, isVERIFIED:responseInfo.data.data.is_verified,
                            CATEGORY:responseInstaInfo.data.data.category, CONTACT:responseInstaInfo.data.data.contact_phone_number, EMAIL:responseInstaInfo.data.data.public_email, FULL_NAME:responseInfo.data.data.full_name,	
                            FOLLOWER:responseInstaInfo.data.data.follower_count, FOLLOWING:responseInstaInfo.data.data.following_count, MEDIA_COUNT:responseInstaInfo.data.data.media_count,
                            BIOGRAPHY:responseInstaInfo.data.data.biography
                        });
                        let data = {
                            data: `Insta Official Account Added `,
                            code: 200,
                            state: true
                        };
                        resolve (data);
                    }
                }
            );
        } catch (error) {
            let data = {
                data: error,
                code: 303,
                state: false
            };   
            reject (data);        
        }
    });
}