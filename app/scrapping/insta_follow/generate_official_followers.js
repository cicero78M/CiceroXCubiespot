import { client } from "../../../app.js";
import { tiktokCommentAPI } from "../../socialMediaAPI/tiktok_API.js";

export async function getTiktokComments(items) {

    console.log('Execute Generate Tiktok Comments');
    client.sendMessage('6281235114745@c.us', "Execute Generate Tiktok Comments");

    let cursorNumber = 0;
    let switchPoint = 0;

    let newDataUsers = [];    
    
    newDataUsers.push(items);

    return new Promise((resolve, reject) =>{
        
        forLoopGetComments(items, cursorNumber);

        async function forLoopGetComments(items, cursorNumber) {    

            let dataUser = 0;
            await tiktokCommentAPI(items, cursorNumber).then ( response =>{

                const total = response.data.total+100;
                console.log(total);

                let commentItems = response.data.comments;
    
                for (let ii = 0; ii < commentItems.length; ii++) {
                    if (commentItems[ii].user.unique_id != undefined || commentItems[ii].user.unique_id != null || commentItems[ii].user.unique_id != "") {
                        if (!newDataUsers.includes(commentItems[ii].user.unique_id)) {
                            newDataUsers.push(commentItems[ii].user.unique_id);
                            dataUser++
                        }
                    }
                }
    
                if (response.data.has_more === 1){    
                    setTimeout(async() => {
                        console.log('next data '+response.data.cursor);
                        forLoopGetComments(items, response.data.cursor);
                    }, 1200);
                } else {    
                    if(total === response.data.cursor){
                        if (switchPoint === 0){

                            switchPoint = 1;
                            setTimeout(async () => {
                                console.log('next data '+response.data.cursor);
                                forLoopGetComments(items, response.data.cursor);
                            }, 1200);

                        } else {
                            let data = {
                                data: newDataUsers,
                                state: true,
                                code: 200
                            };
                            resolve (data); 
                        }
                    } else {
                        if(total > 400){
                            if (dataUser != 0){
                                setTimeout(async () => {
                                    console.log('next data '+response.data.cursor);
                                    forLoopGetComments(items, response.data.cursor);
                                }, 1200);
                            } else {
                                let data = {
                                    data: newDataUsers,
                                    state: true,
                                    code: 200
                                  };
                                resolve (data);                        }
                        } else {
                            setTimeout(async () => {
                                console.log('next data over 400 '+response.data.cursor);
                                forLoopGetComments(items, response.data.cursor);
                            }, 1200);                    
                        }
                    }
                }
            }). catch (error => {
                let data = {
                    data: error,
                    state: false,
                    code: 303
                  };
                reject (data);              
            });
        }
    });   
}

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

        const responseFollowing = await instaUserFollowing(username); 
        let isFollowing =  await responseFollowing.data;
        console.log(isFollowing);


        if (!isDataExist){

            await instaProfileSheet.addRow({
                WHATSAPP: from, USERNAME: username, isPRIVATE:responseInfo.data.data.is_private, isBUSSINESS:responseInfo.data.data.is_business, isVERIFIED:responseInfo.data.data.is_verified,
                CATEGORY:responseInfo.data.data.category, CONTACT:responseInfo.data.data.contact_phone_number, EMAIL:responseInfo.data.data.public_email, FULL_NAME:responseInfo.data.data.full_name,	
                FOLLOWER:responseInfo.data.data.follower_count, FOLLOWING:responseInfo.data.data.following_count, isFOLLOWING: isFollowing, MEDIA_COUNT:responseInfo.data.data.media_count,
                BIOGRAPHY:responseInfo.data.data.biography
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
                    data: `Hi, Selamat Siang ${responseInfo.data.data.full_name}\n\nSistem Kami membaca bahwa kamu belum Follow Akun Instagram @cubiehome,\n\nSilahkan Follow Akun Instagram Kami untuk mendapatkan Akses *GRATIS* ke WiFi Corner CubieHome dan tawaran menarik lainnya dari Cubie Home.\n\nhttps://www.instagram.com/cubiehome\n\nTerimakasih`,
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