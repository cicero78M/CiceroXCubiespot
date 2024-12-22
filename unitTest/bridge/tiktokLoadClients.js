import { readFileSync } from 'fs';

import { collectTiktokComments } from '../collecting/tiktok/collectTiktokEngagements.js';
import { sheetDoc as _sheetDoc } from '../queryData/sheetDoc.js';
import { reportTiktokComments as _reportTiktokComments } from '../reporting/tiktok/reportTiktokComments.js';


const ciceroKey = JSON.parse (readFileSync('ciceroKey.json'));

export async function tiktokLoadClients(typeOrg) {

    let responseList = [];

    let clientResponse = await _sheetDoc(ciceroKey.dbKey.clientDataID, 'ClientData');
    let clientRows = clientResponse.data;

    for (let i = 0; i < clientRows.length; i++) {

        if (clientRows[i].get('STATUS') === "TRUE" && clientRows[i].get('TIKTOK_STATE') === "TRUE" && clientRows[i].get('TYPE') === typeOrg) {

            let responseLoad = await collectTiktokComments(clientRows[i].get('CLIENT_ID'));

            if (responseLoad.code === 200) {

                responseList.push(responseLoad);

                let responseReport = await _reportTiktokComments(clientRows[i].get('CLIENT_ID'));

                if (responseReport.code === 202) {

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
}