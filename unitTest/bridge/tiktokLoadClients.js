const fs = require('fs');

const collectTiktokEngagements = require('../collecting/tiktok/collectTiktokEngagements');
const sheetDoc = require('../queryData/sheetDoc');
const reportTiktokComments = require('../reporting/tiktok/reportTiktokComments');

const ciceroKey = JSON.parse (fs.readFileSync('ciceroKey.json'));

module.exports = { 
    tiktokLoadClients: async function tiktokLoadClients(typeOrg){

        let responseList = [];

        let clientResponse = await sheetDoc.sheetDoc(ciceroKey.dbKey.clientDataID, 'ClientData');
        let clientRows = clientResponse.data;

        for (let i = 0; i < clientRows.length; i++){

            if(clientRows[i].get('STATUS')  === "TRUE" && clientRows[i].get('TIKTOK_STATE') === "TRUE" && clientRows[i].get('TYPE') === typeOrg){

                responseLoad = await collectTiktokEngagements.collectTiktokComments(clientRows[i].get('CLIENT_ID'));
                            
                if (responseLoad.code === 200){
                    responseList.push(responseLoad);

                    let responseReport = await reportTiktokComments.reportTiktokComments(clientRows[i].get('CLIENT_ID'));
                    
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