/***************************************************************
 *  
 * This Function Execute on New Client Request by Administrator.
 * The Whatsapp Order is newClientName#createclient
 * The System automaticaly create Data sheet Name and Headers :
 * Create UserData Sheet and Headers.
 * Create Client ID on Client ID Data Sheet.
 * Create Insta Official Data Sheet and Headers.
 * Create Insta User Likes Data Sheet adn Headers.
 * Create Tiktok Official Data Sheet and Headers.
 * Create TIktok User Comments Data Sheet and Headers.
 * 
 */

const userHeaders = require('./createClient/userHeaders');
const createClientID = require('./createClient/createClientID');
const instaOfficialHeaders = require('./createClient/instaOfficialHeaders');
const instaUserLikesHeaders = require('./createClient/instaUserLikesHeaders');
const tiktokOfficialHeaders = require('./createClient/tiktokOfficialHeaders');
const tiktokUserCommentsHeader = require('./createClient/tiktokUserCommentsHeaders');

module.exports = {
    //Add New Client to Database Client ID  
    createClient: async function createClient(clientName, type){
        let responseData =[];
        let response;

        //User Database Headers
        response = await userHeaders.userHeaders(clientName);
        responseData.push(response);

        //Create ClientID
        response = await createClientID.createClientID(clientName, type);
        responseData.push(response);

        //Create Insta Official Headers
        response = await instaOfficialHeaders.instaOfficialHeaders(clientName);
        responseData.push(response);

        //Create Insta Likes Headers
        response = await instaUserLikesHeaders.instaUserLikesHeaders(clientName);
        responseData.push(response);

        //Create Tiktok Official Headers
        response = await tiktokOfficialHeaders.tiktokOfficialHeaders(clientName);
        responseData.push(response);

        //Create Tiktok Comment Headers
        response = await tiktokUserCommentsHeader.tiktokUserCommentsHeaders(clientName);
        responseData.push(response);

        return responseData;
    }
}