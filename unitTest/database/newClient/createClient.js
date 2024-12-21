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

import { userHeaders as _userHeaders } from './createClient/userHeaders.js';
import { createClientID as _createClientID } from './createClient/createClientID';
import { instaOfficialHeaders as _instaOfficialHeaders } from './createClient/instaOfficialHeaders';
import { instaUserLikesHeaders as _instaUserLikesHeaders } from './createClient/instaUserLikesHeaders';
import { tiktokOfficialHeaders as _tiktokOfficialHeaders } from './createClient/tiktokOfficialHeaders';
import { tiktokUserCommentsHeaders } from './createClient/tiktokUserCommentsHeaders';

export async function createClient(clientName, type) {
    let responseData = [];
    let response;

    //User Database Headers
    response = await _userHeaders(clientName);
    responseData.push(response);

    //Create ClientID
    response = await _createClientID(clientName, type);
    responseData.push(response);

    //Create Insta Official Headers
    response = await _instaOfficialHeaders(clientName);
    responseData.push(response);

    //Create Insta Likes Headers
    response = await _instaUserLikesHeaders(clientName);
    responseData.push(response);

    //Create Tiktok Official Headers
    response = await _tiktokOfficialHeaders(clientName);
    responseData.push(response);

    //Create Tiktok Comment Headers
    response = await tiktokUserCommentsHeaders(clientName);
    responseData.push(response);

    return responseData;
}