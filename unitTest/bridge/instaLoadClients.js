import { readFileSync } from 'fs';

import { sheetDoc as _sheetDoc } from '../queryData/sheetDoc';
import { collectInstaLikes as _collectInstaLikes } from '../collecting/insta/collectInstaLikes';
import { reportInstaLikes as _reportInstaLikes } from '../reporting/insta/reportInstaLikes';

const ciceroKey = JSON.parse (readFileSync('ciceroKey.json'));

export async function instaLoadClients(typeOrg) {

    let responseList = [];

    let clientResponse = await _sheetDoc(ciceroKey.dbKey.clientDataID, 'ClientData');
    let clientRows = clientResponse.data;

    for (let i = 0; i < clientRows.length; i++) {

        if (clientRows[i].get('STATUS') === "TRUE" && clientRows[i].get('INSTA_STATE') === "TRUE" && clientRows[i].get('TYPE') === typeOrg) {

            responseLoad = await _collectInstaLikes(clientRows[i].get('CLIENT_ID'));

            if (responseLoad.code === 200) {

                let responseReport = await _reportInstaLikes(clientRows[i].get('CLIENT_ID'));

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