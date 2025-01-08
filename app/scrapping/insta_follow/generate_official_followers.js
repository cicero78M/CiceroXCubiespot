import { instaFollowersAPI } from "../../socialMediaAPI/insta_API.js";
import { postInstaFollowersOfficial } from "./post_insta_official_follower.js";

export async function instaOffcialFollower(clientName, username, pages, arrayData, countData, totalData) {

    console.log("Execute insta user following");
    return new Promise(
        async (resolve, reject) => {

            try {
                await instaFollowersAPI(username, pages).then(
                    async response => {

                        let pagination = response.data.pagination_token;
                        let count = response.data.data.count ;

                        let followersList = await arrayData.concat(response.data.data.items);

                        let totalValue = countData + count;

                        console.log(totalValue);

                        if(totalData > totalValue){

                            console.log("Under Total");
                            setTimeout(async () => {
                                await instaOffcialFollower(clientName, username, pagination, followersList, totalValue, totalData);
                            }, 2000);
    
                        } else {

                            await postInstaFollowersOfficial(clientName, followersList).then(
                                async response => {
                                    
                                    console.log(response);

                                    let responseData =  {
                                        data: "Insta Follower API Done!!",
                                        code: 200,
                                        state: true
                                    }                

                                    resolve (responseData);
                           
                                }
                            );

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
        }
    );
}