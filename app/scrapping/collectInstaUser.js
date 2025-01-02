import { ciceroKey, googleAuth } from "../database_query/sheetDoc.js";
import { instaInfoAPI } from "../socialMediaAPI/instaAPI.js";
import { GoogleSpreadsheet } from 'google-spreadsheet';

export async function instaUserData(from, username) {
    try {
        const responseInfo = await instaInfoAPI(username);
        let isDataExist = false;

        const instaProfileDoc = new GoogleSpreadsheet(ciceroKey.dbKey.instaProfileData, googleAuth); //Google Authentication for InstaOfficial DB  
        await instaProfileDoc.loadInfo(); // loads document properties and worksheets
        const instaProfileSheet = instaProfileDoc.sheetsByTitle["PROFILE"];
        let instaProfileRows = await instaProfileSheet.getRows();

        for (let i = 0; i < instaProfileRows.length; i++){
            if(instaProfileRows[i].get("USERNAME") === username){
                console.log(instaProfileRows[i].get("USERNAME"));
                isDataExist = true;               
            }               
        }

        

        if (!isDataExist){
            instaProfileSheet.addRow({
                WHATSAPP: from, USERNAME: username, isPRIVATE:responseInfo.data.data.is_private, isBUSSINESS:responseInfo.data.data.is_business, isVERIFIED:responseInfo.data.data.is_verified,
                CATEGORY:responseInfo.data.data.category, CONTACT:responseInfo.data.data.contact_phone_number, EMAIL:responseInfo.data.data.public_email, FULL_NAME:responseInfo.data.data.full_name,	
                FOLLOWER:responseInfo.data.data.follower_count, FOLLOWING:responseInfo.data.data.following_count, MEDIA_COUNT:responseInfo.data.data.media_count,
                BIOGRAPHY:responseInfo.data.data.biography
            });
            let responseData = {
                data: responseInfo,
                code: 200,
                state: true
            }
            return responseData;
        } else {
            let responseData = {
                data: responseInfo,
                code: 201,
                state: true
            }
            return responseData;
        }
    
    } catch (error) {
        let responseData = {
            data: error,
            code: 303,
            state: false
        }
        return responseData;
    }

}