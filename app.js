//Route
import express from 'express';
const app = express();

//WWebjs
import wwebjs from 'whatsapp-web.js';
const { Client, LocalAuth } = wwebjs;

//.env
import 'dotenv/config';

//QR-Code
import qrcode from 'qrcode-terminal';

//Figlet
import figlet from 'figlet';
const { textSync } = figlet;

//Banner
import { set } from 'simple-banner';

//Local Dependency
import { myData } from './app/database_query/myData.js';
import { infoView } from './app/view/info_view.js';
import { propertiesView } from './app/view/properties_view.js';
import { usernameAbsensi } from './app/database_query/usernameAbsensi.js';
import { updateUsername } from './app/database/user_profile/updateUsername.js';
import { setSecuid } from './app/database/utils/secuidTiktok.js';
import { sendResponse } from './app/view/sendWA.js';
import { requestVoucer } from './app/scrapping/insta_follow/request_rewards.js';
import { tiktokItemsBridges } from './app/scrapping/tiktok_scrapping/tiktok_items_bridge.js';
import { getTiktokPost } from './app/scrapping/tiktok_scrapping/generate_tiktok_post.js';
import { newReportTiktok } from './app/reporting/tiktok_report.js';
import { newReportInsta } from './app/reporting/insta_report.js';
import { getInstaPost } from './app/scrapping/insta_scrapping/generate_insta_post.js';
import { getInstaLikes } from './app/scrapping/insta_scrapping/generate_insta_likes.js';
import { instaClientInfo } from './app/scrapping/insta_follow/generate_insta_client_info.js';
import { schedullerAllSocmed } from './app/reporting/scheduller_all_socmed.js';
import { instaOffcialFollower } from './app/scrapping/insta_follow/generate_official_followers.js';
import { adminOrder, cubiesOrder, dataBackup, dataRestore, generateSocmed, infoOrder, operatorOrder, userOrder } from './app/constant/constant.js';
import { addNewUser } from './app/database/user_profile/addNewUser.js';
import { editProfile } from './app/database/user_profile/editUserProfile.js';
import { editjabatan, editnama, edittitle, updatedivisi, updateinsta, updatetiktok } from './app/constant/update_n_order.js';
import { warningReportInsta } from './app/reporting/user_warning_insta.js';
import { warningReportTiktok } from './app/reporting/user_warning_tiktok.js';
import { schedule } from 'node-cron';
import { saveContacts } from './app/database/utils/saveContact.js';
import { restoreClientData } from './json_data_file/client_data/restore_client_data.js';
import { clientData } from './json_data_file/client_data/read_client_data_from_json.js';
import { restoreUserData } from './json_data_file/user_data/restore_user_data.js';
import { pushUserCom, pushUserRes } from './app/database/push_user_new_client/push_user_data.js';
import { decrypted } from './json_data_file/crypto.js';
import { restoreInstaContent } from './json_data_file/insta_data/insta_content/restore_insta_content_data.js';
import { restoreInstaLikes } from './json_data_file/insta_data/insta_likes/transfer_insta_likes_data.js';
import { restoreTiktokContent } from './json_data_file/tiktok_data/tiktok_content/restore_tiktok_content.js';
import { restoreTiktokComments } from './json_data_file/tiktok_data/tiktok_engagement/tiktok_comments/restore_tiktok_comments.js';
import { clientDataBackup } from './app/backup/client_data.js';
import { userDataBackup } from './app/backup/user_data.js';
import { instaContentBackup } from './app/backup/insta_content.js';
import { tiktokContentBackup } from './app/backup/tiktok_content.js';
import { instaLikesBackup } from './app/backup/insta_likes.js';
import { tiktokCommentsBackup } from './app/backup/tiktok_comment.js';

//.env
const private_key = process.env;

// Routing Port 
const port = private_key.EXPRESS_PORT;

app.listen(port, () => {
    console.log(`Cicero System Start listening on port >>> ${port}`)
});

// WWEB JS Client Constructor
export const client = new Client({
    authStrategy: new LocalAuth({
        clientId: private_key.APP_SESSION_NAME,
    }),
});

// On WWEB Client Initializing
console.log('Initializing...');
client.initialize();

// On WWeB Authenticate Checking
client.on('authenthicated', (session)=>{
    console.log(+JSON.stringify(session));
});

// On WWEB If Authenticate Failure
client.on('auth_failure', msg => {
    console.error('AUTHENTICATION FAILURE', msg);
});

// On WWEB If Disconected
client.on('disconnected', (reason) => {
    console.log('Client was logged out', reason);
});

// On Pairing with QR Code
client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

// On Reject Calls
let rejectCalls = true;
client.on('call', async (call) => {
    console.log('Call received, rejecting. GOTO Line 261 to disable', call);
    if (rejectCalls) await call.reject();
});

// On WWeb Ready
client.on('ready', () => {
    //Banner
    console.log(textSync("CICERO -X- CUBIESPOT", {
        font: "Ghost",
        horizontalLayout: "fitted",
        verticalLayout: "default",
        width: 240,
        whitespaceBreak: true,
    }));

    set("Cicero System Manajemen As A Services");
    console.log('===============================');
    console.log('===============================');
    console.log('======System Fully Loaded!=====');
    console.log('=========Enjoy the Ride========');
    console.log('===We\'ll Take Care Everything==');
    console.log('===============================');
    console.log('===============================');

    // Server Life State Warning
    schedule('*/10 * * * *',  () =>  {
        //Date Time
        let d = new Date();
        let localDate = d.toLocaleDateString("en-US", {timeZone: "Asia/Jakarta"});
        let hours = d.toLocaleTimeString("en-US", {timeZone: "Asia/Jakarta"});     
        let time = localDate+" >> "+hours;

        console.log(time+' '+ciceroKey.waSession+' <<<System Alive>>>');
        client.sendMessage('6281235114745@c.us', ciceroKey.waSession+' <<<System Alive>>>');
    });

    // Scrapping Socmed every hours until 21
    schedule('30 6-20 * * *',  () => {
        console.log("Execute Cron Job");
        schedullerAllSocmed("routine"); //Scheduler Function, routine catch generated data every hours
    });

    schedule('0 15,18,21 * * *',  () => {
        console.log("Execute Cron Job");
        schedullerAllSocmed("report"); //Scheduller Function, report catch and send generated data to Administrator and Operator
    });

    //User Warning Likes Comments Insta & Tiktok
    schedule('15 12,16,19 * * *',  () => {
        console.log("Execute Cron Job");
        clientData().then( async clientData =>{

            for (let i = 0; i < clientData.length; i++){
        
                //This Procces Tiktok Report
                if (decrypted(clientData[i].STATUS) === "TRUE" 
                && decrypted(clientData[i].TIKTOK_STATE) === "TRUE" 
                && decrypted(clientData[i].TYPE) === process.env.APP_CLIENT_TYPE) {
                    console.log(`${decrypted(clientData[i].CLIENT_ID)} START LOAD TIKTOK WARNING DATA`);
                    
                    await client.sendMessage(
                        '6281235114745@c.us', 
                        ` ${decrypted(clientData[i].CLIENT_ID)} START LOAD TIKTOK WARNING DATA`
                    );

                    await warningReportTiktok(clientData[i]).then(async response => {
                        
                        await client.sendMessage(
                            '6281235114745@c.us', 
                            response.data);

                    }).catch( async response => {
                        
                        switch (response.code){
                            case 201 : 
                                await client.sendMessage(
                                    '6281235114745@c.us', 
                                    response.data
                                );
                                    break;

                            case 303 : 
                                await client.sendMessage(
                                    '6281235114745@c.us', 
                                    'Error'
                                );
                                    break;

                            default:
                                break;
                        }

                    });
                }         

                //This process Insta Report
                if (decrypted(clientData[i].STATUS) === "TRUE" 
                && decrypted(clientData[i].INSTA_STATE) === "TRUE" 
                && decrypted(clientData[i].TYPE) === process.env.APP_CLIENT_TYPE) {
                    
                    console.log(`${decrypted(clientData[i].CLIENT_ID)} START LOAD INSTA WARNING DATA`);
                    await client.sendMessage(
                        '6281235114745@c.us', 
                        `${decrypted(clientData[i].CLIENT_ID)} START LOAD INSTA WARNING DATA`
                    );

                    await warningReportInsta(clientData[i]).then(async response => {
                            
                        await client.sendMessage(
                            '6281235114745@c.us', 
                            response.data
                        );

                    }).catch(async response => {
        
                        switch (response.code){
                            case 201 : 
                                await client.sendMessage(
                                    '6281235114745@c.us', 
                                    response.data
                                );

                                    break;
                            
                            case 303 : 
                                await client.sendMessage(
                                    '6281235114745@c.us', 
                                    'Error'
                                );

                                    break;
                    
                            default:
                                break;
                        }
                    });
                }  
            }
        });
    });
});

client.on('message', async (msg) => {
    // Date Time
    let d = new Date(); //Date Time
    let localDate = d.toLocaleDateString("en-US", {timeZone: "Asia/Jakarta" }); //Local Date
    let hours = d.toLocaleTimeString("en-US", {timeZone: "Asia/Jakarta"});  //Hours
    let time = localDate+" >> "+hours;

    try {

        const contact = await msg.getContact(); // This Catch Contact Sender. 
        
        if (msg.isStatus){ // This Catch Wa Story from Users
            
            //If Msg is WA Story
            const chat = await msg.getChat();
            chat.sendSeen();
            if (contact.pushname !== undefined){

                console.log(contact.pushname+" ===>>>> "+msg.body);
                let body = msg.body;
                let url = body.match(/\bhttps?:\/\/\S+/gi);

                if (url != null || url != undefined){
                    let splittedUrl = url[0].split('/');
                    if (splittedUrl.includes("www.instagram.com")){
                        console.log('Response Sent');
                        //client.sendMessage(msg.author, 'Terimakasih sudah berpartisipasi melakukan share konten :\n\n'+url[0]+'\n\nSelalu Semangat ya.');
                            
                        //   let rawLink;
                        /*  
                        if(url[0].includes('/?')){
                            rawLink = url[0].replaceAll('/?', '?');
                            shortcode = rawLink.split('?')[0].split('/').pop();
                        } else {
                            shortcode = url[0].split('/').pop();
                        }

                        //Report Likes from Insta Official
                        let response = await _instaSW(contact.number, shortcode);
                    
                        if (response.code === 200){
                            client.sendMessage(msg.from, response.data);
                        } else {
                            console.log(response.data);
                        }
                    */ 
                    }
                }            
            }
        } else { // This Catch Request Messages
            //Splitted Msg
            const splittedMsg = msg.body.split("#"); //this Proccess Request Order by Splitting Messages
            if (splittedMsg.length > 1){ //System response if message is user by lenght of splitted messages

                let chatMsg = await msg.getChat(); //this catch message data
                chatMsg.sendSeen(); //this send seen by bot whatsapp
                chatMsg.sendStateTyping(); //this create bot typing state 

                console.log(msg.from+' ==> '+splittedMsg[1].toLowerCase());
                
                //Admin Order Data         
                if (adminOrder.includes(splittedMsg[1].toLowerCase())){ 
                    switch(splittedMsg[1].toLowerCase()){
                        case 'pushuserres': {
                            //Res Request
                            console.log('Push User Res Client Triggered');

                            if (splittedMsg[2].includes('https://docs.google.com/spreadsheets/d/')){

                                let slicedData = splittedMsg[2].split('/');
                                let sheetID;

                                if (slicedData[slicedData.length-1].includes('edit')){
                                    sheetID = slicedData[slicedData.length-2];
                                    console.log(sheetID);
                                } else {
                                    sheetID = slicedData[slicedData.length-1];
                                    console.log(sheetID);
                                }

                                await pushUserRes(splittedMsg[0], sheetID)
                                .then(
                                    response =>
                                    console.log(response)
                                )
                                .catch(
                                    response =>
                                    console.log(response)
                                );


                                // await sendMessage(msg.from, responseData, "PUSH USER RES CLIENT ERROR");
                                                        
                            }  else {
                                
                                console.log('Bukan Spreadsheet Links');
                                
                                client.sendMessage(
                                    msg.from, 
                                    'Bukan Spreadsheet Links'
                                );

                            }
                        }
                                break;
                        case 'pushusercom': {

                            //Com Request
                            console.log('Push User Com Client Triggered');

                            if (splittedMsg[2].includes('https://docs.google.com/spreadsheets/d/')){

                                let slicedData = splittedMsg[2].split('/');
                                let sheetID;

                                if (slicedData[slicedData.length-1].includes('edit')){
                                    sheetID = slicedData[slicedData.length-2];
                                    console.log(sheetID);
                                } else {
                                    sheetID = slicedData[slicedData.length-1];
                                    console.log(sheetID);
                                }

                                await pushUserCom(splittedMsg[0], sheetID)
                                .then(
                                    response =>
                                    console.log(response)
                                )
                                .catch(
                                    response =>
                                    console.log(response)
                                );


                                // await sendMessage(msg.from, responseData, "PUSH USER RES CLIENT ERROR");
                                                        
                            }  else {
                                
                                console.log('Bukan Spreadsheet Links');
                                
                                client.sendMessage(
                                    msg.from, 
                                    'Bukan Spreadsheet Links'
                                );

                            }

                        }
                                break;                  
                        case 'exception': {//Exception
                            await editProfile(
                                splittedMsg[0].toUpperCase(),
                                splittedMsg[2].toLowerCase(), 
                                splittedMsg[3].toUpperCase(), 
                                msg.from.replace('@c.us', ''),
                                "EXCEPTION"
                            ).then(async data => 
                                await sendMessage(msg.from, data, " EXCEPTION REQUEST ERROR")
                            ).catch(async error => 
                                await sendMessage(msg.from, error, " EXCEPTION REQUEST ERROR")
                            )

                        }
                            break;
                        case 'secuid': {
                            //Generate All Socmed
                            await client.sendMessage(
                                '6281235114745@c.us', 
                                'Generate Tiktok secUID Data Starting...'
                            );
                            
                            console.log(time+' Generate Tiktok secUID Data Starting');
            
                            await clientData().then(
                                async clientData =>{
                                    //Itterate Client
                                    for (let i = 0; i < clientData.length; i++){
                                        if (decrypted(clientData[i].STATUS) === "TRUE" 
                                        && decrypted(clientData[i].INSTA_STATE) === "TRUE" 
                                        && decrypted(clientData[i].TYPE) === process.env.APP_CLIENT_TYPE) {         
                                    
                                            console.log(time+" "+decrypted(clientData[i].CLIENT_ID)+' START TIKTOK SECUID DATA');
                                        
                                            let tiktokSecuid = await setSecuid(
                                                clientData[i]
                                            );
                                            
                                            sendResponse(
                                                msg.from, 
                                                tiktokSecuid, 
                                                `${decrypted(clientData[i].CLIENT_ID)} START TIKTOK SECUID DATA`
                                            );
                                        
                                        } 
                                    }
                            });

                        }
                            break;
                        case 'savecontact': {
                            let response = await saveContacts();
                            console.log(response);
                        }
                            break;
                        default : {
                            //Execute Send Warning
                            console.log("Execute Schedule");
                            clientData().then(
                                async clientData =>{
                    
                                for (let i = 0; i < clientData.length; i++){
                            
                                    //This Procces Tiktok Report
                                    if (decrypted(clientData[i].STATUS) === "TRUE" 
                                    && decrypted(clientData[i].TIKTOK_STATE) === "TRUE" 
                                    && decrypted(clientData[i].TYPE) === process.env.APP_CLIENT_TYPE) {
                                        console.log(`${decrypted(clientData[i].CLIENT_ID)} START LOAD TIKTOK WARNING DATA`);
                                        await client.sendMessage(
                                            '6281235114745@c.us', 
                                            ` ${decrypted(clientData[i].CLIENT_ID)} START LOAD TIKTOK WARNINGDATA`
                                        );
                                        await warningReportTiktok(clientData[i]);
                                    }         
                
                                    //This process Insta Report
                                    if (decrypted(clientData[i].STATUS) === "TRUE" 
                                    && decrypted(clientData[i].INSTA_STATE) === "TRUE" 
                                    && decrypted(clientData[i].TYPE) === process.env.APP_CLIENT_TYPE) {
                                        
                                        console.log(`${decrypted(clientData[i].CLIENT_ID)} START LOAD INSTA WARNING DATA`);
                                        await client.sendMessage(
                                            '6281235114745@c.us', 
                                            `${decrypted(clientData[i].CLIENT_ID)} START LOAD INSTA WARNING DATA`
                                        );
                
                                        await warningReportInsta(clientData[i]);
                                    }  
                                }
                            });
                        }
                            break;
                    }  
   
                //Operator Order Data         
                } else if (operatorOrder.includes(splittedMsg[1].toLowerCase())){
                    console.log("Exec Rows");
                    await clientData().then(async clientData => {             
                        console.log("Response OK");
                        for (let i = 0; i < clientData.length; i++){
                            if(decrypted(clientData[i].CLIENT_ID) === splittedMsg[0].toUpperCase()){
                                let responseData;
                                switch (splittedMsg[1].toLowerCase()) {
                                    case "addnewuser"://Added New User Data Profile
                                        console.log("Add User");
                                        //clientName#addnewuser#id_key/NRP#name#divisi/satfung#jabatan#pangkat/title
                                        responseData = await addNewUser(
                                            splittedMsg[0].toUpperCase(), 
                                            splittedMsg[2], 
                                            splittedMsg[3].toUpperCase(), 
                                            splittedMsg[4].toUpperCase(), 
                                            splittedMsg[5].toUpperCase(), 
                                            splittedMsg[6].toUpperCase()
                                        );

                                        sendResponse(
                                            msg.from, 
                                            responseData, 
                                            "Error Adding New User"
                                        );

                                        break;
                                    case "deleteuser"://Delete Existing Data User
                                        //clientName#deleteuser#id_key/NRP#newdata
                                        responseData = await editProfile(
                                            splittedMsg[0].toUpperCase(), 
                                            splittedMsg[2].toLowerCase(), 
                                            false, 
                                            msg.from.replace('@c.us', ''),
                                                "STATUS"
                                            );

                                        sendResponse(
                                            msg.from, 
                                            responseData, 
                                            "Error Delete User Data"
                                        );
                                        break;
                                    case "instacheck"://Insta Username Checking Data User Not Updated
                                        //ClientName#instacheck
                                        responseData = await usernameAbsensi(
                                            splittedMsg[0].toUpperCase(), 
                                            'INSTA'
                                        );
                                                                                
                                        sendResponse(
                                            msg.from, 
                                            responseData, 
                                            "Error on Insta Check Data"
                                        );
                                        break;
                                    case "tiktokcheck"://Tiktok Checking Data User Not Updated
                                        //ClientName#tiktokcheck
                                        responseData = await usernameAbsensi(
                                            splittedMsg[0].toUpperCase(), 
                                            'TIKTOK'
                                        );
                                        
                                        sendResponse(
                                            msg.from, 
                                            responseData, 
                                            "Error on Tiktok Check Data"
                                        );
                                        break;
                                    default:
                                        break;
                                }
                            }
                        }
                    });

                //User Order Data         
                } else if (userOrder.includes(splittedMsg[1].toLowerCase())){   
                    await clientData().then(async clientData => {    
                        for (let i = 0; i < clientData.length; i++){
                            if(decrypted(clientData[i].CLIENT_ID) === splittedMsg[0].toUpperCase()){
                                if (updateinsta.includes(splittedMsg[1].toLowerCase())) {
                                    //Update Insta Profile
                                    //CLientName#updateinsta/ig/#linkprofileinstagram
                                    if (splittedMsg[3].includes('instagram.com')){
                                        if (!splittedMsg[3].includes('/p/') 
                                        || !splittedMsg[3].includes('/reels/') 
                                        || !splittedMsg[3].includes('/video/') ){
                                            
                                            const instaLink = splittedMsg[3].split('?')[0];
                                            
                                            const instaUsername = instaLink.replaceAll(
                                                '/profilecard/',
                                                ''
                                            ).split('/').pop();  
                                
                                            await updateUsername(

                                                splittedMsg[0].toUpperCase(), 
                                                splittedMsg[2], 
                                                instaUsername, 
                                                contact.number, 
                                                "INSTA"

                                            ).then(

                                                response => {
                                                    client.sendMessage(msg.from, response.data);
                                                }

                                            ).catch(

                                                response => {
                                                    if (response.code === 201){
                                                        client.sendMessage(msg.from, response.data);
                                                    } else {
                                                        client.sendMessage(msg.from, "Error");
                                                    }
                                                }

                                            );

                                        } else {

                                            console.log('Bukan Link Profile Instagram');
                                            client.sendMessage(
                                                msg.from, 
                                                'Bukan Link Profile Instagram'
                                            );

                                        }

                                    } else {

                                        console.log('Bukan Link Instagram');
                                        client.sendMessage(
                                            msg.from, 
                                            'Bukan Link Instagram'
                                        );

                                    }

                                } else if (updatetiktok.includes(splittedMsg[1].toLowerCase())) {
                                    //Update Tiktok profile
                                    //CLientName#updatetiktok/tiktok/#linkprofiletiktok
                                    if (splittedMsg[3].includes('tiktok.com')){
                                        
                                        const tiktokLink = splittedMsg[3].split('?')[0];
                                        const tiktokUsername = tiktokLink.split('/').pop();  
                                        
                                        let responseData = await updateUsername(
                                            splittedMsg[0].toUpperCase(), 
                                            splittedMsg[2], 
                                            tiktokUsername, 
                                            contact.number, 
                                            "TIKTOK"
                                        );
                                        
                                        sendResponse(
                                            msg.from, 
                                            responseData, 
                                            "Error Update Tiktok"
                                        );

                                    } else {
                                        console.log('Bukan Link Profile Tiktok');
                                        client.sendMessage(
                                            msg.from, 
                                            'Bukan Link Profile Tiktok'
                                        );
                                    }

                                } else if (updatedivisi.includes(splittedMsg[1].toLowerCase())) {
                                    //update Divisi Name
                                    //clientName#editdivisi/satfung#id_key/NRP#newdata
                                    let responseData = await editProfile(
                                        splittedMsg[0].toUpperCase(),
                                        splittedMsg[2].toLowerCase(), 
                                        splittedMsg[3].toUpperCase(), 
                                        msg.from.replace('@c.us', ''), 
                                        "DIVISI"
                                    );

                                    sendResponse(
                                        msg.from, 
                                        responseData, 
                                        "Error Edit Satfung"
                                    );

                                } else if (editjabatan.includes(splittedMsg[1].toLowerCase())) {
                                    //Update Jabatan
                                    //clientName#editjabatan/jabatan#id_key/NRP#newdata
                                    let responseData = await editProfile(
                                        splittedMsg[0].toUpperCase(),
                                        splittedMsg[2].toLowerCase(), 
                                        splittedMsg[3].toUpperCase(), 
                                        msg.from.replace('@c.us', ''), 
                                        "JABATAN"
                                    );
                                    
                                    sendResponse(
                                        msg.from, 
                                        responseData, 
                                        "Error Edit Jabatan"
                                    );

                                } else if (editnama.includes(splittedMsg[1].toLowerCase())) {
                                    //clientName#editnama/nama#id_key/NRP#newdata
                                    let responseData = await editProfile(
                                        splittedMsg[0].toUpperCase(),
                                        splittedMsg[2].toLowerCase(), 
                                        splittedMsg[3].toUpperCase(), 
                                        msg.from.replace('@c.us', ''), 
                                        "NAMA"
                                    );
                                    
                                    sendResponse(
                                        msg.from, 
                                        responseData, 
                                        "Error Edit Nama"
                                    );

                                } else if (edittitle.includes(splittedMsg[1].toLowerCase())) {
                                    //clientName#editnama/nama#id_key/NRP#newdata
                                    let responseData = await editProfile(
                                        splittedMsg[0].toUpperCase(),
                                        splittedMsg[2].toLowerCase(), 
                                        splittedMsg[3].toUpperCase(), 
                                        msg.from.replace('@c.us', ''), 
                                        "TITLE"
                                    );
                                    
                                    sendResponse(
                                        msg.from, 
                                        responseData, 
                                        "Error Edit Pangkat"
                                    );

                                } else if (splittedMsg[1].toLowerCase() === 'mydata') {
                                    let responseData = await myData(
                                        splittedMsg[0].toUpperCase(), 
                                        splittedMsg[2]
                                    );

                                    sendResponse(
                                        msg.from, 
                                        responseData, 
                                        "Error on Getting My Data"
                                    );
                                } else if (splittedMsg[1].toLowerCase() === 'whatsapp') {
                                    let responseData = await editProfile(
                                        splittedMsg[0].toUpperCase(),
                                        splittedMsg[2].toLowerCase(), 
                                        msg.from.replace('@c.us', ''), 
                                        msg.from.replace('@c.us', ''), 
                                        "WHATSAPPP"
                                    );
                                    
                                    sendResponse(
                                        msg.from, 
                                        responseData, 
                                        "Error Edit Nama"
                                    );
                                } 
                            }
                        }
                    });

                //Divisi & Title List Data
                } else if (infoOrder.includes(splittedMsg[1].toLowerCase())){    
                    await clientData().then( 
                        async clientData => {    
                            for (let i = 0; i < clientData.length; i++){
                                if(decrypted(clientData[i].CLIENT_ID) === splittedMsg[0].toUpperCase()){
                                    let responseData;
                                    switch (splittedMsg[1].toLowerCase()) {
                                        case 'info'://Order Info Request
                                            responseData = await infoView(splittedMsg[0].toUpperCase());
                                            setTimeout(() => {
                                                console.log("Collecting Client Data");
                                            }, 1000);
                                            client.sendMessage(msg.from, responseData.data);
                                            break;
                                        case 'divisilist'://Divisi List Request                        
                                            responseData = await propertiesView(
                                                splittedMsg[0].toUpperCase(), 
                                                "DIVISI"
                                            );
                                            client.sendMessage(
                                                msg.from, 
                                                responseData.data
                                            );  
                                            break;
                                        case 'titlelist'://Title List Request
                                            responseData = await propertiesView(splittedMsg[0].toUpperCase(), "TITLE");
                                            setTimeout(() => {
                                                console.log("Collecting User Data");
                                            }, 1000);
                                            client.sendMessage(msg.from, responseData.data); 
                                            break;
                                        default:
                                            break;
                                    }
                                }
                            }
                        }
                    );
                //Wifi Corner For Company
                } else if (cubiesOrder.includes(splittedMsg[0].toLowerCase())){  
                    switch (splittedMsg[0].toLowerCase()) {
                        case 'cubiehome'://Cubiehome WiFi Corner
                            if(splittedMsg[1].toLowerCase().includes('https://www.instagram.com/')){

                                if (!splittedMsg[1].includes('/p/') 
                                || !splittedMsg[1].includes('/reels/') 
                                || !splittedMsg[1].includes('/video/') ){

                                    const instaLink = splittedMsg[1].split('?')[0];
                                    const instaUsername = instaLink.replaceAll('/profilecard/','').split('/').pop();  

                                    await requestVoucer(
                                        msg.from, 
                                        instaUsername
                                    ).then(
                                        async responseData =>{                                                        
                                            sendResponse(
                                                msg.from, 
                                                responseData, 
                                                `Silahkan Tunggu Beberapa saat dan kirim ulang Request Akses WiFi Corner CubieHome`
                                            );
                                        }
                                    ).catch(
                                        response =>{console.log(response)}
                                    );


                                } else {
                                    client.sendMessage(
                                        msg.from, 
                                        `Silahkan Cek Kembali, link yang anda cantumkan, pastikan link tersebut adalah link akun profile Instagram Anda dan tidak di setting Private.
                                        
                                        Terimakasih.`
                                    );
                                }

                            } else{
                                client.sendMessage(
                                    msg.from,
                                    `Silahkan Cek Kembali, link yang anda cantumkan, pastikan link tersebut adalah link akun profile Instagram Anda dan tidak di setting Private.
                                        
                                    Terimakasih.`
                                );
                            }
                            break;
                        case 'likes':
                            break;
                        case 'comment':
                            break;
                        default:
                            break;                    
                    }

                //Generaate Social Media Data    
                } else if (generateSocmed.includes(splittedMsg[1].toLowerCase())){   
                    switch (splittedMsg[1].toLowerCase()) {
                        case 'allsocmed'://Generate & Report All Socmed Data - Content, Likes, Comment
                            if(splittedMsg[2].toLowerCase() === 'report'){
                                await schedullerAllSocmed("report");
                            } else {
                                await schedullerAllSocmed("routine");
                            }
                            break;
                        case 'alltiktok'://Generate & Report All Tiktok Data - Contents & Comments 
                            console.log("Execute New All Tiktok")
                            await clientData().then( 
                                async response =>{
                                    for (let i = 0; i < response.length; i++){
                                        if (decrypted(response[i].STATUS) === "TRUE" 
                                        && decrypted(response[i].TIKTOK_STATE) === "TRUE" 
                                        && decrypted(response[i].TYPE) === process.env.APP_CLIENT_TYPE) {
                                            
                                            console.log(time+" "+decrypted(response[i].CLIENT_ID)+' START LOAD TIKTOK DATA');
                                            client.sendMessage(
                                                '6281235114745@c.us', 
                                                decrypted(response[i].CLIENT_ID)+' START LOAD TIKTOK DATA');
                                            
                                            await getTiktokPost(
                                                response[i]
                                            ).then(
                                                data => {
                                                    tiktokItemsBridges(
                                                        response[i], 
                                                        data.data
                                                    ).then(
                                                        data =>{
                                                            client.sendMessage(
                                                                msg.from, 
                                                                data.data
                                                            );
                                                            console.log("Success Report Data");
                                                        }
                                                    ).catch(
                                                        data => console.log(data)
                                                    );
                                                }
                                            ).catch(
                                                data => {
                                                    switch (data.code) {
                                                        case 303:
                                                            console.log(data.data);
                                                            client.sendMessage(
                                                                '6281235114745@c.us', 
                                                                decrypted(response[i].CLIENT_ID)+' ERROR GET TIKTOK POST'
                                                            );
                                                            break;
                                                        default:
                                                            client.sendMessage(
                                                                '6281235114745@c.us', 
                                                                decrypted(response[i].CLIENT_ID)+' '+data.data
                                                            );
                                                            break;
                                                    }
                                                }
                                            );   
                                        }           
                                    }
                            }). catch (
                                error =>{
                                    console.error(error);
                                    client.sendMessage(
                                        '6281235114745@c.us', 
                                        'Error on All New Tiktok'
                                    );
                                }
                            )  
                            break;
                        case 'reporttiktok': //Report Tiktok Data
                            console.log("Execute New Report Tiktok ")
                            await clientData().then( 
                                async response =>{
                                    for (let i = 0; i < response.length; i++){
                                        if (decrypted(response[i].STATUS) === "TRUE" 
                                        && decrypted(response[i].TIKTOK_STATE) === "TRUE" 
                                        && decrypted(response[i].TYPE) === process.env.APP_CLIENT_TYPE) {
                                            console.log(time+" "+decrypted(response[i].CLIENT_ID)+' START REPORT TIKTOK DATA');
                                            client.sendMessage(
                                                '6281235114745@c.us', 
                                                decrypted(response[i].CLIENT_ID)+' START REPORT TIKTOK DATA'
                                            );
                                            await newReportTiktok(
                                                response[i]
                                            ).then(
                                                data => {
                                                    client.sendMessage(
                                                        msg.from, data.data
                                                    );
                                            }).catch(                
                                                data => {
                                                    switch (data.code) {
                                                        case 303:
                                                            console.log(data.data);
                                                            client.sendMessage(
                                                                '6281235114745@c.us', 
                                                                decrypted(response[i].CLIENT_ID)+' ERROR REPORT TIKTOK POST'
                                                            );
                                                            break;
                                                        default:
                                                            client.sendMessage(
                                                                '6281235114745@c.us',
                                                                decrypted(response[i].CLIENT_ID)+' '+data.data
                                                            );
                                                            break;
                                                    }
                                            });
                                        }           
                                    }
                            }). catch (
                                error =>{
                                    console.error(error);
                                    client.sendMessage(
                                        '6281235114745@c.us', 
                                        'Error on New Report Tiktok'
                                    );
                                }
                            )
                            break;
                        case 'allinsta': //Generate & Report All Insta Data
                            console.log("Execute New All Insta ")
                            await clientData().then( 
                                async clientData =>{
                                    for (let i = 0; i < clientData.length; i++){

                                        if (decrypted(clientData[i].STATUS) === "TRUE" 
                                        && decrypted(clientData[i].INSTA_STATE) === "TRUE" 
                                        && decrypted(clientData[i].TYPE) === process.env.APP_CLIENT_TYPE) {
                                        
                                            console.log(time+" "+decrypted(clientData[i].CLIENT_ID)+' START LOAD INSTA DATA');
                                            
                                            client.sendMessage(
                                                '6281235114745@c.us', 
                                                decrypted(clientData[i].CLIENT_ID)+' START LOAD INSTA DATA'
                                            );

                                            await getInstaPost(
                                                clientData[i]
                                            ).then(
                                                async instaPostData =>{
                                                    console.log(instaPostData);
                                                    
                                                    await getInstaLikes(
                                                        instaPostData.data, 
                                                        clientData[i]
                                                    ).then(
                                                        async instaLikesData =>{
                                                            console.log(instaLikesData.data);
                                                            
                                                            await client.sendMessage(
                                                                msg.from, 
                                                                instaLikesData.data
                                                            );

                                                            await newReportInsta(
                                                                clientData[i]
                                                            ).then(
                                                                async data => {
                                                                    console.log("Report Success!!!");
                                                                    await client.sendMessage(
                                                                        msg.from, 
                                                                        data.data
                                                                    );
                                                            }).catch(                
                                                                async data => {
                                                                    switch (data.code) {

                                                                        case 303:
                                                                            console.log(data.data);
                                                                            await client.sendMessage(
                                                                                '6281235114745@c.us', 
                                                                                decrypted(clientData[i].CLIENT_ID)+' ERROR REPORT INSTA POST'
                                                                            );
                                                                            break;

                                                                        default:
                                                                            await client.sendMessage(
                                                                                '6281235114745@c.us', 
                                                                                decrypted(clientData[i].CLIENT_ID)+' '+data.data
                                                                            );
                                                                            break;
                                                                    }
                                                            });
                                                        }
                                                    ).catch(
                                                        async data => {
                                                            switch (data.code) {
                                                                
                                                                case 303:
                                                                    console.log(data.data);
                                                                    await client.sendMessage(
                                                                        '6281235114745@c.us', 
                                                                        decrypted(clientData[i].CLIENT_ID)+' ERROR GET INSTA LIKES'
                                                                    );
                                                                    break;
                                                                
                                                                default:
                                                                    console.log(data);
                                                                    await client.sendMessage(
                                                                        '6281235114745@c.us', 
                                                                        decrypted(clientData[i].CLIENT_ID)+' '+data.data
                                                                    );
                                                                    break;
                                                            }
                                                        }
                                                    ); 
                                                }
                                            ).catch(
                                                async data => {
                                                    switch (data.code) {

                                                        case 303:
                                                            console.log(data.data);
                                                            await client.sendMessage(
                                                                '6281235114745@c.us', 
                                                                decrypted(clientData[i].CLIENT_ID)+' ERROR GET INSTA POST'
                                                            );
                                                            break;

                                                        default:
                                                            console.log(data);
                                                            await client.sendMessage(
                                                                '6281235114745@c.us', 
                                                                decrypted(clientData[i].CLIENT_ID)+' '+data.data
                                                            );
                                                            break;
                                                    }
                                                }
                                            );   
                                        }           
                                    }
                            }). catch (
                                async error =>{
                                    console.error(error);
                                    await client.sendMessage(
                                        '6281235114745@c.us', 
                                        'Error on All New Insta'
                                    );
                                }
                            )  
                            break;
                        case 'reportinsta'://Report Insta Data
                            console.log("Execute New Report Insta ")
                            await clientData().then( 
                                async response =>{
                                    for (let i = 0; i < response.length; i++){
                                        if (decrypted(response[i].STATUS) === "TRUE" 
                                        && decrypted(response[i].INSTA_STATE) === "TRUE" 
                                        && decrypted(response[i].TYPE) === process.env.APP_CLIENT_TYPE) {
                                            console.log(time+" "+decrypted(response[i].CLIENT_ID)+' START REPORT INSTA DATA');
                                            client.sendMessage(
                                                '6281235114745@c.us', 
                                                decrypted(response[i].CLIENT_ID)+' START REPORT INSTA DATA'
                                            );
                                            
                                            await newReportInsta(
                                                response[i]
                                            ).then(
                                                async data => {
                                                    await client.sendMessage(
                                                        msg.from, 
                                                        data.data
                                                    );
                                            }).catch(                
                                                async data => {
                                                    switch (data.code) {
                                                        case 303:
                                                            console.log(data.data);
                                                            await client.sendMessage(
                                                                '6281235114745@c.us', 
                                                                decrypted(response[i].CLIENT_ID)+' ERROR REPORT INSTA POST'
                                                            );
                                                            break;

                                                        default:
                                                            await client.sendMessage(
                                                                '6281235114745@c.us', 
                                                                decrypted(response[i].CLIENT_ID)+' '+data.data
                                                            );
                                                            break;
                                                    }
                                            });
                                        }           
                                    }
                            }). catch (
                                async error =>{
                                    console.error(error);
                                    await client.sendMessage(
                                        '6281235114745@c.us', 
                                        'Error on New Report Insta'
                                    );
                                }
                            )
                            break
                        case 'instainfo'://Collect Insta Info
                            await clientData().then(
                                async clientData =>{
                                    for (let i = 0; i < clientData.length; i++){
                                        if (decrypted(clientData[i].STATUS) === "TRUE" 
                                        && decrypted(clientData[i].INSTA_STATE) === "TRUE" 
                                        && decrypted(clientData[i].TYPE) === process.env.APP_CLIENT_TYPE) {
                                            await instaClientInfo(
                                                decrypted(clientData[i].CLIENT_ID), 
                                                decrypted(clientData[i].INSTAGRAM)
                                            ).then(
                                                async response =>{
                                                    console.log(response.data);
                                                    client.sendMessage(
                                                        msg.from, 
                                                        `${decrypted(clientData[i].CLIENT_ID)} ${response.data}`
                                                    );
                                                }
                                            ).catch(
                                                async error =>{
                                                    console.error(error);
                                                    client.sendMessage(
                                                        msg.from, 
                                                        `${decrypted(clientData[i].CLIENT_ID)} Collect Insta Info Error`
                                                    );
                                                }
                                            );
                                        }
                                    }
                                }
                            );
                            
                            break;
                        case 'officialfollowers'://Collect Insta Followers
                            console.log("Execute Insta Followers");            
                            let arrayData = [];
                            let countData = 0;    
                            await clientData().then(
                                async clientData =>{
                                    for (let i = 0; i < clientData.length; i++){
                                        let pages = "";
                                        if (decrypted(clientData[i].STATUS) === "TRUE" 
                                        && decrypted(clientData[i].INSTA_STATE) === "TRUE" 
                                        && decrypted(clientData[i].TYPE) === process.env.APP_CLIENT_TYPE) {
                                            await instaClientInfo(
                                                decrypted(clientData[i].CLIENT_ID), 
                                                decrypted(clientData[i].INSTAGRAM)
                                            ). then (
                                                async response =>{
                                                    console.log(response);
                                                    await instaOffcialFollower(
                                                        decrypted(clientData[i].CLIENT_ID), 
                                                        decrypted(clientData[i].INSTAGRAM), 
                                                        pages, 
                                                        arrayData, 
                                                        countData, 
                                                        response.data
                                                    ).then(
                                                        async response => {
                                                            console.log(response.data);
                                                        }
                                                    ).catch(
                                                        error => {
                                                            // console.error(error);
                                                            console.error(error);
                                                            client.sendMessage(
                                                                msg.from, 
                                                                "Insta User Following Checker Error"
                                                            );
                                                        }
                                                    );
                                                }
                                            ).catch(
                                                error => {
                                                    // console.error(error);
                                                    console.error(error);
                                                    client.sendMessage(
                                                        msg.from, 
                                                        "Insta Client Info Error"
                                                    );
                                                }
                                            );
                                        }
                                    }
                                }
                            );
                                break;    
                        default:
                            break;                    
                    }

                //Restore Encrypted Data
                } else if(dataRestore.includes(splittedMsg[1].toLowerCase())){
                    switch (splittedMsg[1].toLowerCase()){
                        case "restoreclientdata"://Restore Client Data
                            restoreClientData();
                            break;
                        case "restoreuserdata"://Restore User Data Base
                            clientData().then(
                                async response =>{
                                    for (let i = 0; i < response.length;i++){
                                        restoreUserData(decrypted(response[i].CLIENT_ID))
                                        .then(
                                            response => {
                                                console.log(response);
                                            }
                                        ).catch (
                                            error => console.log(error)
                                        );
                                    }
                                }
                            )
                            break;
                        case "restoreinstacontent"://Restore Insta Content Data
                            clientData().then(
                                async response =>{
                                    for (let i = 0; i < response.length;i++){
                                        restoreInstaContent(decrypted(response[i].CLIENT_ID))
                                        .then(
                                            response => {
                                                console.log(response);
                                            }
                                        ).catch (
                                            error => console.log(error)
                                        );
                                    }
                                }
                            )
                            break;
                        case "restoreinstalikes"://Restore Insta Likes Username Data
                            clientData().then(
                                async response =>{
                                    for (let i = 0; i < response.length;i++){
                                        restoreInstaLikes(decrypted(response[i].CLIENT_ID))
                                        .then(
                                            response => {
                                                console.log(response);
                                            }
                                        ).catch (
                                            error => console.log(error)
                                        );
                                    }
                                }
                            )
                            break;
                        case "restoretiktokcontent"://Restore Tiktok Contents
                            clientData().then(
                                async response =>{
                                    for (let i = 0; i < response.length;i++){
                                        restoreTiktokContent(decrypted(response[i].CLIENT_ID))
                                        .then(
                                            response => {
                                                console.log(response);
                                            }
                                        ).catch (
                                            error => console.log(error)
                                        );
                                    }
                                }
                            )
                            break;
                        case "restoretiktokcomments"://Restore Tiktok Comments Username Data
                            clientData().then(
                                async response =>{
                                    for (let i = 0; i < response.length;i++){
                                        restoreTiktokComments(decrypted(response[i].CLIENT_ID))
                                        .then(
                                            response => {
                                                console.log(response);
                                            }
                                        ).catch (
                                            error => console.log(error)
                                        );
                                    }
                                }
                            )
                            break;
                        default:
                            break;
                    }
                
                //Backup Encrypted Data
                } else if(dataBackup.includes(splittedMsg[1].toLowerCase())){
                    switch (splittedMsg[1].toLowerCase()){
                        case "backupclientdata"://Backup Encrypted Client Data
                            clientDataBackup().then(
                                response => console.log(response)
                            ).catch (
                                error => console.error(error)
                            );
                            break;
                        case "backupuserdata"://Backup Encrypted User Data
                            userDataBackup().then(
                                response => console.log(response)
                            ).catch (
                                error => console.error(error)
                            );
                            break;
                        case "backupinstacontent"://Backup Encrypted Insta Content Data
                            await clientData().then(
                                async response =>{
                                    for (let i = 0; i < response.length; i++){
                                        await instaContentBackup(response[i]).then(
                                            response => console.log(response)
                                        );
                                    }
                                }
                            ).catch (
                                error => console.error(error)
                            );

                            break;
                        case "backuptiktokcontent"://Backup Encrypted Tiktok Content Data
                            await clientData().then(
                                async response =>{
                                    for (let i = 0; i < response.length; i++){
                                        await tiktokContentBackup(response[i]).then(
                                            response => console.log(response)
                                        ).catch(
                                            error => console.error(error)
                                        );
                                    }
                                }
                            )

                            break;
                        case "backupinstalikes"://Backup Encrypted Insta Likes Username Data
                            await clientData().then(
                                async response =>{
                                    for (let i = 0; i < response.length; i++){
                                        await instaLikesBackup(response[i]).then(
                                            response => console.log(response)
                                        ).catch(
                                            error => console.error(error)
                                        );
                                    }
                                }
                            )
                            break;
                        case "backuptiktokcomments"://Backup Encrypted Tiktok Comments Username Data
                            await clientData().then(
                                async response =>{
                                    for (let i = 0; i < response.length; i++){
                                        await tiktokCommentsBackup(response[i]).then(
                                            response => console.log(response)
                                        ).catch(
                                            error => console.error(error)
                                        );
                                    }
                                }
                            ).catch (
                                error => console.error(error)
                            )

                            break;     
                        default:
                            break;
                    }

                } else {//Key Order Data Not Exist         

                    await clientData().then(
                        async clientData => {
                            
                            for (let i = 0; i < clientData.length; i++){
                                if(decrypted(clientData[i].CLIENT_ID) === splittedMsg[0].toUpperCase()){
                                    console.log("Request Code Doesn't Exist");
                                    let responseData = await infoView(
                                        splittedMsg[0].toUpperCase()
                                    );
                                    //Wait A Second
                                    client.sendMessage(
                                        msg.from, 
                                        responseData.data
                                    );
                                }
                            }
                        }
                    ).catch (
                        error => console.error(error)
                    )
                }
            //if(splittedMsg[1].toLowerCase()......
            } else {
                const contact = await msg.getContact();
                console.log(contact.number+" ===>>>> "+msg.body);
            } // if(splittedMsg.length....
        } //if(msg.status....
    } catch (error) { //Catching the Error Request
        console.log(error);
        client.sendMessage(
            '6281235114745@c.us', 
            'Error on Main Apps'
        );
    }
});