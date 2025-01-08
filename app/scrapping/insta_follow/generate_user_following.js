import { instaFollowingAPI } from "../../socialMediaAPI/insta_API.js";

export async function generateFollowing(username, pages, countData, totalData) {

    let response = await instaUserFollowing(username, pages, countData, totalData);
    return response;

}




async function instaUserFollowing(username, pages, countData, totalData) {

    console.log("Execute insta user following");
            let stateFoll = false;
            try {

                await instaFollowingAPI(username, pages).then(
                    async response => {
                        let dataFollowing = response.data.data.items;
                        let pagination = response.data.pagination_token;
                        let count = response.data.data.count ;

                        for (let i = 0; i < dataFollowing; i++ ){
                            console.log(dataFollowing[i].username);
                            if (dataFollowing[i].username === 'cubiehome'){
                                stateFoll = true;
                                                      
                            }
                        }

                        let totalValue = countData + count;

                        if (stateFoll === false){
                            
                            console.log('execute');
                            if(totalData > totalValue){
                                console.log("Under Total");
 
                                setTimeout(async () => {
                                    instaUserFollowing(username, pagination, totalValue, totalData);
                                }, 2000);
 
                            } else {
                                console.log("done");

                                if (stateFoll === false){
    
                                    let responseData =  {
                                        data: true,
                                        code: 200,
                                        state: true
                                    }                
                                    return responseData;   
                
                                } else {
                
                                    let responseData =  {
                                        data: false,
                                        code: 200,
                                        state: true
                                    }                
                                    return responseData;
                                }
                                
                            }
                        }            
                    }
                );
            } catch (error) {
                let responseData = {
                    data: error,
                    code: 303,
                    state: false
                }
                return responseData;   
            } 
        
}