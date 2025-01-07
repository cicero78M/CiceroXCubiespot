import { instaFollowersAPI } from "../../socialMediaAPI/insta_API.js";

export async function instaUserFollowing(clientName, username, pages) {

    console.log("Execute insta user following");
    return new Promise(async (resolve, reject) => {
        try {
            await instaFollowersAPI(username, pages).then(
                async response => {

                    let pagination = response.data.pagination_token;

                    if(response.data.pagination_token != null){

                        await postInstaFollowersOfficial(clientName, response.data.data.items).then(
                                async response => {
                                    console.log(response.data);
                                    client.sendMessage(msg.from, response.data);
                                    await instaUserFollowing(clientName, username, pagination, childrenArray);
                                });
                    } else {
                        let responseData =  {
                            data: childrenArray,
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