
const fs = require('fs');
const axios = require('axios');

const ciceroKey = JSON.parse (fs.readFileSync('ciceroKey.json'));

const headers = {
  'x-cache-control': 'no-cache',
  'x-rapidapi-key': ciceroKey.tiktokKey.tiktokKey,
  'x-rapidapi-host': ciceroKey.tiktokKey.tiktokHost
}

module.exports = {  

  tiktokUserInfoAPI: async function tiktokUserInfoAPI(key){
    const options = {
      method: 'GET',
      url: ciceroKey.tiktokKey.tiktokhostInfo,
      params: {
        uniqueId: key
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
    
      return data;      }
  },

  tiktokPostAPI: async function tiktokPostAPI(key, cursors){
  //Tiktok Post API
    const options = {
      method: 'GET',
      url: ciceroKey.tiktokKey.tiktokhostContent,
      params: {
        secUid: key,
        count: '50',
        cursor: cursors
      },
      headers : headers
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
    
      return data;      }
  },

  tiktokCommentAPI: async function tiktokCommentAPI(key, cursors){
    //Insta Likes API
    const options = {
      method: 'GET',
      url: ciceroKey.tiktokKey.tiktokhostComments,
      params: {
        videoId: key,
        count: '100',
        cursor: cursors
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