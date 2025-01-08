import { instaFollowingAPI } from "../../socialMediaAPI/insta_API.js";

export async function instaUserFollowing(clientName, username, pages, countData, totalData) {

    console.log("Execute insta user following");
    return new Promise(
        async (resolve, reject) => {

            try {
                await instaFollowingAPI(username, pages).then(
                    async response => {

                        let pagination = response.data.pagination_token;
                        let count = response.data.data.count ;

                        for (let i = 0; i < response.data.data.items; i++ ){

                        }
                        
                        let totalValue = countData + count;

                        console.log(totalValue);

                        if(totalData > totalValue){

                            console.log("Under Total");
                            setTimeout(async () => {
                                await instaUserFollowing(clientName, username, pagination, totalValue, totalData);
                            }, 2000);
    
                        } else {

                            console.log(response);

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
        }
    );
}