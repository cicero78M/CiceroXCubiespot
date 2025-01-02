import { ciceroKey, googleAuth } from "../database_query/sheetDoc.js";
import { instaInfoAPI } from "../socialMediaAPI/instaAPI.js";
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { instaUserFollowing } from "./collectInstaFollow.js";

export async function instaUserData(from, username) {
    try {
        const responseInfo = await instaInfoAPI(username);
        console.log(responseInfo);
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

        const responseFollowing = await instaUserFollowing(username); 
        let isFollowing =  await responseFollowing.data;
        console.log(isFollowing);


        if (!isDataExist){

            await instaProfileSheet.addRow({
                WHATSAPP: from, USERNAME: username, isPRIVATE:responseInfo.data.is_private, isBUSSINESS:responseInfo.data.is_business, isVERIFIED:responseInfo.data.is_verified,
                CATEGORY:responseInfo.data.category, CONTACT:responseInfo.data.contact_phone_number, EMAIL:responseInfo.data.public_email, FULL_NAME:responseInfo.data.full_name,	
                FOLLOWER:responseInfo.data.follower_count, FOLLOWING:responseInfo.data.following_count, isFOLLOWING: isFollowing, MEDIA_COUNT:responseInfo.data.media_count,
                BIOGRAPHY:responseInfo.data.biography
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
                    data: `Hi, Selamat Siang ${responseInfo.data.data.full_name}\n\nSistem Kami sudah membaca bahwa kamu belum Follow Akun Instagram @cubiehome,\n\nSilahkan Follow Akun Instagram Kami untuk mendapatkan Akses ke WiFi Corner CubieHome dan tawaran menarik lainnya dari Cubie Home.\n\nhttps//www.instagram.com/cubiehome\n\nTerimakasih`,
                    code: 200,
                    state: true
                }
                return responseData;
            }
        } else {
            let responseData = {
                data: 'Data Base Terisi',
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