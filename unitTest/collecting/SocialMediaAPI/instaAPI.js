const axios = require('axios');

const fs = require('fs');
const ciceroKey = JSON.parse (fs.readFileSync('ciceroKey.json'));

const headers = {
  'x-cache-control': 'no-cache',
  'x-rapidapi-key': ciceroKey.instaKey.instakeyAPI,
  'x-rapidapi-host': ciceroKey.instaKey.instahostAPI
}


module.exports = {  

    instaLikesAPI: async function instaLikesAPI(key){
        //Insta Likes API
        let options = {
            method: 'GET',
            url: ciceroKey.instaKey.instahostLikes,
            params: {
            code_or_id_or_url: key
            },
            headers: headers
        };

        try {
            let response = await axios.request(options);

            let data = {
                data : response.data,
                code : 200,
                state : true
            }
            
            return data;        
        
        } catch (error) {

            let data = {
                data : error,
                code : 303,
                state : false
            }
            
           return data;         
        }
    },

    
    instaPostAPI : async function instaPostAPI(key){
    //Insta Post API
        let options = {
            method: 'GET',
            url: ciceroKey.instaKey.instahostContent,
            params: {
            username_or_id_or_url: key
            },
            headers: headers
        };

        try {
            let response = await axios.request(options);

            let data = {
                data : response.data,
                code : 200,
                state : true
            }
            
            
            return data;

        } catch (error) {
            let data = {
                data : error,
                code : 303,
                state : false
            }
            
        
            return data;  
        }
    }

}