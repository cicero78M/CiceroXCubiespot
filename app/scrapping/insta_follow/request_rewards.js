import { GoogleSpreadsheet } from "google-spreadsheet";
import { instaInfoAPI } from "../../socialMediaAPI/insta_API.js";
import { ciceroKey, googleAuth } from "../../database/new_query/sheet_query.js";
import { instaUserFollowing } from "./generate_user_following.js";

export async function requestVoucer(from, username) {
    try {
        const responseInfo = await instaInfoAPI(username);

        let pages = "";
        let countData = 0;
        
        let isDataExist = false;
        let isFollowing = "FALSE";

        await instaUserFollowing(username, pages, countData, responseInfo.data.data.following_count).then(
            async response =>{
                if(response.data){
                    isFollowing =  "TRUE";
                }
            }
        );

        const instaProfileDoc = new GoogleSpreadsheet(ciceroKey.dbKey.instaProfileData, googleAuth); //Google Authentication for InstaOfficial DB  
        await instaProfileDoc.loadInfo(); // loads document properties and worksheets
        const instaProfileSheet = instaProfileDoc.sheetsByTitle["PROFILE"];
        let instaProfileRows = await instaProfileSheet.getRows();

        for (let i = 0; i < instaProfileRows.length; i++){
            if(instaProfileRows[i].get("USERNAME") === username){
                console.log(instaProfileRows[i].get("USERNAME"));

                instaProfileRows[i].assign({isFOLLOWING : isFollowing

                });
                instaProfileRows[i].save();

                isDataExist = true;  
          
                if (isFollowing === "TRUE"){

                    let responseData = {
                        data: `Hi, Selamat Siang ${responseInfo.data.data.full_name}\n\nSelamat, Sistem Kami sudah membaca bahwa kamu sudah Follow Akun Instagram @cubiehome,\n\nBerikut Login dan Password yang bisa kamu gunakan untuk mengakses Wifi Corner CubieHome\n\nUser : Username\nPassword : xxxxxx`,
                        code: 200,
                        state: true
                    }
     
                    return responseData;
    
                } else {
                    
                    let responseData = {
                        data: `Hi, Selamat Siang ${responseInfo.data.data.full_name}\n\nSistem Kami membaca bahwa kamu belum Follow Akun Instagram @cubiehome,\n\nSilahkan Follow Akun Instagram Kami untuk mendapatkan Akses *GRATIS* ke WiFi Corner CubieHome dan tawaran menarik lainnya dari Cubie Home.\n\nhttps://www.instagram.com/cubiehome\n\nTerimakasih`,
                        code: 200,
                        state: true
                    }
     
                    return responseData;
                }      
                
            }               
        }                

        if (!isDataExist){

            await instaProfileSheet.addRow({
                WHATSAPP: from, USERNAME: username, 
                isPRIVATE:responseInfo.data.data.is_private, 
                isBUSSINESS:responseInfo.data.data.is_business, 
                isVERIFIED:responseInfo.data.data.is_verified, 
                CATEGORY:responseInfo.data.data.category, 
                CONTACT:responseInfo.data.data.contact_phone_number, 
                EMAIL:responseInfo.data.data.public_email, 
                FULL_NAME:responseInfo.data.data.full_name,	
                FOLLOWER:responseInfo.data.data.follower_count, 
                FOLLOWING:responseInfo.data.data.following_count,
                MEDIA_COUNT:responseInfo.data.data.media_count,
                BIOGRAPHY:responseInfo.data.data.biography, 
                isFOLLOWING : isFollowing
            });

            if (isFollowing === "TRUE"){

                let responseData = {
                    data: `Hi, Selamat Siang ${responseInfo.data.data.full_name}\n\nSelamat, Sistem Kami sudah membaca bahwa kamu sudah Follow Akun Instagram @cubiehome,\n\nBerikut Login dan Password yang bisa kamu gunakan untuk mengakses Wifi Corner CubieHome\n\nUser : Username\nPassword : xxxxxx`,
                    code: 200,
                    state: true
                }
 
                return responseData;

            } else {
                
                let responseData = {
                    data: `Hi, Selamat Siang ${responseInfo.data.data.full_name}\n\nSistem Kami membaca bahwa kamu belum Follow Akun Instagram @cubiehome,\n\nSilahkan Follow Akun Instagram Kami untuk mendapatkan Akses *GRATIS* ke WiFi Corner CubieHome dan tawaran menarik lainnya dari Cubie Home.\n\nhttps://www.instagram.com/cubiehome\n\nTerimakasih`,
                    code: 200,
                    state: true
                }
 
                return responseData;
            }
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