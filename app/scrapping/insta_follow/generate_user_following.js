import { instaFollowingAPI } from "../../socialMediaAPI/insta_API.js";

export async function instaUserFollowing(username, pages, countData, totalData) {

    new Promise(async (resolve) => {

        let data = await generateFollowing(username, pages, countData, totalData);

        resolve (data);


        async function generateFollowing(username, pages, countData, totalData) {

            console.log("Execute insta user following");
    
                    try {
                        await instaFollowingAPI(username, pages).then(
                            async response => {
                                let stateFoll = false;
                                let dataFollowing = response.data.data.items;
                                let pagination = response.data.pagination_token;
                                let count = response.data.data.count ;
    
                                for (let i = 0; i < dataFollowing; i++ ){
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
                                            await generateFollowing(username, pagination, totalValue, totalData);
                                        }, 1000);
    
                                    } else {
    
                                        console.log("resolve true")
                                        
                                        let responseData =  {
                                            data: false,
                                            code: 200,
                                            state: true
                                        }                
                                        console.log(responseData);    
                                        return responseData;
    
                                    }
    
                                } else {
    
                                    let responseData =  {
                                        data: true,
                                        code: 200,
                                        state: true
                                    }
    
                                    return responseData;  
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
    });        
}
