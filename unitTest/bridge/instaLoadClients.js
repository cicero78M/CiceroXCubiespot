const fs = require('fs');

const sheetDoc = require('../queryData/sheetDoc');
const collectInstaLikes = require('../collecting/insta/collectInstaLikes');
const reportInstaLikes = require('../reporting/insta/reportInstaLikes');

const ciceroKey = JSON.parse (fs.readFileSync('ciceroKey.json'));

module.exports = { 
    instaLoadClients: async function instaLoadClients(typeOrg){

        let responseList = [];

        let clientResponse = await sheetDoc.sheetDoc(ciceroKey.dbKey.clientDataID, 'ClientData');
        let clientRows = clientResponse.data;

        for (let i = 0; i < clientRows.length; i++){

            if(clientRows[i].get('STATUS')  === "TRUE" && clientRows[i].get('INSTA_STATE') === "TRUE" && clientRows[i].get('TYPE') === typeOrg){

                responseLoad = await collectInstaLikes.collectInstaLikes(clientRows[i].get('CLIENT_ID'));
                            
                if (responseLoad.code === 200){
                    responseList.push(responseLoad);

                    let responseReport = await reportInstaLikes.reportInstaLikes(clientRows[i].get('CLIENT_ID'));
                    
                    if (responseReport.code === 200){
                        responseList.push(responseReport);
                    } else {
                        console.log(responseReport.data);
                    } 

                } else {
                    console.log(responseLoad.data);
                }  

            } 
        }
       
        console.log('Return Success');
        return responseList;
    },
}