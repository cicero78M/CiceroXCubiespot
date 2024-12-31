import { ciceroKey, googleAuth } from "../database_query/sheetDoc.js";
import { instaInfoAPI } from "../socialMediaAPI/instaAPI.js";
import { GoogleSpreadsheet } from 'google-spreadsheet';


export async function collectFollowing(from, username) {
    
    const instaProfileDoc = new GoogleSpreadsheet(ciceroKey.dbKey.instaProfileData, googleAuth); //Google Authentication for InstaOfficial DB
   
    await instaProfileDoc.loadInfo(); // loads document properties and worksheets
    const instaProfileSheet = instaProfileDoc.sheetsByTitle["PROFILE"];

    instaInfoAPI(username).then(async (responseInfo) => {
        console.log(responseInfo.data.is_private);
        instaProfileSheet.addRow({
            WHATSAPP: from, USERNAME: username, isPRIVATE:responseInfo.data.is_private, isBUSSINESS:responseInfo.data.is_business, isVERIFIED:responseInfo.data.is_verified,
            CATEGORY:responseInfo.data.category, CONTACT:responseInfo.data.contact_phone_number, EMAIL:responseInfo.data.public_email, FULL_NAME:responseInfo.data.full_name,	
            FOLLOWER:responseInfo.data.follower_count, FOLLOWING:responseInfo.data.following_count, MEDIA_COUNT:responseInfo.data.media_count,
            BIOGRAPHY:responseInfo.data.biography
        });
        console.log(responseInfo);
        let data = {
            data: "Success Load Data",
            code: 200,
            state: false
        };

        return data;
    });
}