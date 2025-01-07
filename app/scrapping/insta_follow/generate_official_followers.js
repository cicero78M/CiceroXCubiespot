import { instaFollowersAPI } from "../../socialMediaAPI/insta_API.js";

export async function instaUserFollowing(clientName, username, pages) {

    console.log("Execute insta user following");

    return new Promise(async (resolve, reject) => {
        try {
            await instaFollowersAPI(username, pages).then(
                async response => {

                    let pagination = response.data.data.pagination_token;
                    
                    console.log(pagination);
                    if(response.data.data.pagination_token != null){

                        await postInstaFollowersOfficial(clientName, response.data.data.items).then(
                                async response => {
                                    console.log(response.data);
                                    client.sendMessage(msg.from, response.data);
                                    await instaUserFollowing(clientName, username, pagination);
                          
                                });
                    } else {
                        let responseData =  {
                            data: "Insta Follower API Done!!",
                            code: 200,
                            state: true
                        }                
                        resolve (responseData);
                    }
                }
            );
        } catch (error) {
            let responseData = {
                data: error,
                code: 303,
                state: false
            }
            reject (responseData);   
        } 
    });
}