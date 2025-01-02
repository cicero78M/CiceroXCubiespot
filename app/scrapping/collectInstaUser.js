import { ciceroKey, googleAuth } from "../database_query/sheetDoc.js";
import { instaFollowingAPI } from "../socialMediaAPI/instaAPI.js";
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { instaUserFollowing } from "./collectInstaFollow.js";

export async function instaUserData(from, username) {
    try {
        let isDataExist = false;
        const isFollowing = await instaFollowingAPI(username); 
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

            let responseInfo = await instaUserFollowing(username);

            instaProfileSheet.addRow({
                WHATSAPP: from, USERNAME: username, isPRIVATE:responseInfo.data.data.is_private, isBUSSINESS:responseInfo.data.data.is_business, isVERIFIED:responseInfo.data.data.is_verified,
                CATEGORY:responseInfo.data.data.category, CONTACT:responseInfo.data.data.contact_phone_number, EMAIL:responseInfo.data.data.public_email, FULL_NAME:responseInfo.data.data.full_name,	
                FOLLOWER:responseInfo.data.data.follower_count, FOLLOWING:responseInfo.data.data.following_count, MEDIA_COUNT:responseInfo.data.data.media_count,
                BIOGRAPHY:responseInfo.data.data.biography, isFOLLOWING : isFollowing
            });

            if (isFollowing){
                let responseData = {
                    data: `Hi, Selamat Siang ${responseInfo.data.data.full_name}\n\nSelamat, Sistem Kami sudah membaca bahwa kamu sudah Follow Akun Instagram @cubiehome,\n\nBerikut Login dan Password yang bisa kamu gunakan untuk mengakses Wifi Corner CubieHome\n\nUser : Username\nPassword : xxxxxx`,
                    code: 200,
                    state: true
                }
                return responseData;
            } else {
                let responseData = {
                    data: `Hi, Selamat Siang ${responseInfo.data.data.full_name}\n\nSelamat, Sistem Kami sudah membaca bahwa kamu belum Follow Akun Instagram @cubiehome,\n\nSilahkan Follow Akun Instagram Kami untuk mendapatkan Akses ke WiFi Corner CubieHome dan tawaran menarik lainnya dari Cubie Home.\n\nhttps//www.instagram.com/cubiehome\n\nTerimakasih`,
                    code: 200,
                    state: true
                }
                return responseData;
            }
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