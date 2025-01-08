import express, { response } from 'express';
const app = express();

import { readFileSync } from 'fs';
const ciceroKey = JSON.parse (readFileSync('ciceroKey.json'));

import wwebjs from 'whatsapp-web.js';
const { Client, LocalAuth } = wwebjs;

import qrcode from 'qrcode-terminal';

import figlet from 'figlet';
const { textSync } = figlet;

import { set } from 'simple-banner';
import { schedule } from 'node-cron';

import { saveContacts } from './app/database/saveContact.js';
import { myData } from './app/database_query/myData.js';
import { infoView } from './app/view/info_view.js';
import { propertiesView } from './app/view/properties_view.js';
import { usernameAbsensi } from './app/database_query/usernameAbsensi.js';
import { sheetDoc } from './app/database_query/sheetDoc.js';
import { pushUserClient } from './app/database/pushUserClient.js';
import { addNewUser } from './app/database/addNewUser.js';
import { updateUsername } from './app/database/updateUsername.js';
import { setSecuid } from './app/database/secuidTiktok.js';
import { sendResponse } from './app/view/sendWA.js';
import { editProfile } from './app/database/editUserProfile.js';
import { instaUserData } from './app/scrapping/insta_follow/request_rewards.js';
import { newRowsData } from './app/database/new_query/sheet_query.js';
import { tiktokItemsBridges } from './app/scrapping/tiktok_scrapping/tiktok_items_bridge.js';
import { getTiktokPost } from './app/scrapping/tiktok_scrapping/generate_tiktok_post.js';
import { newReportTiktok } from './app/reporting/tiktok_report.js';
import { newReportInsta } from './app/reporting/insta_report.js';
import { getInstaPost } from './app/scrapping/insta_scrapping/generate_insta_post.js';
import { getInstaLikes } from './app/scrapping/insta_scrapping/generate_insta_likes.js';
import { clientRegister } from './app/database/client_register/client_register.js';
import { instaClientInfo } from './app/scrapping/insta_follow/generate_insta_client_info.js';
import { schedullerAllSocmed } from './app/reporting/scheduller_all_socmed.js';
import { instaUserFollowing } from './app/scrapping/insta_follow/generate_official_followers.js';
import { postInstaFollowersOfficial } from './app/scrapping/insta_follow/post_insta_official_follower.js';

//Routing Port 
const port = ciceroKey.port;

//Express Routing
app.listen(port, () => {
    console.log(`Cicero System Start listening on port >>> ${port}`)
});

//WWEB JS Client Constructor
export const client = new Client({
    authStrategy: new LocalAuth({
        clientId: ciceroKey.waSession,
    }),
});

//WWEB Client Initializing
console.log('Initializing...');
client.initialize();

//WWeB Authenticate Checking
client.on('authenthicated', (session)=>{
    console.log(+JSON.stringify(session));
});

//WWEB If Authenticate Failure
client.on('auth_failure', msg => {
    console.error('AUTHENTICATION FAILURE', msg);
});

//WWEB If Disconected
client.on('disconnected', (reason) => {
    console.log('Client was logged out', reason);
});
//WWeb Ready
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

    //Server Life Send Msg
    schedule('*/10 * * * *', async () =>  {
        //Date Time
        let d = new Date();
        let localDate = d.toLocaleDateString("en-US", {
            timeZone: "Asia/Jakarta"
        });
        let hours = d.toLocaleTimeString("en-US", {
            timeZone: "Asia/Jakarta"
        });     
        let time = localDate+" >> "+hours;

        console.log(time+' '+ciceroKey.waSession+' <<<System Alive>>>');
        client.sendMessage('6281235114745@c.us', ciceroKey.waSession+' <<<System Alive>>>');
    });

    // Reload Tiktok every hours until 22
    schedule('30 6-21 * * *', async () => {
        schedullerAllSocmed("routine");
    });

    // Reload Tiktok every hours until 22
    schedule('00 15,18,21 * * *', async () => {
        schedullerAllSocmed("report");
    });

});

client.on('qr', qr => {
    //Pairing WA Center
    qrcode.generate(qr, {small: true});
});

let rejectCalls = true;
client.on('call', async (call) => {
    console.log('Call received, rejecting. GOTO Line 261 to disable', call);
    if (rejectCalls) await call.reject();
});

client.on('message', async (msg) => {
    //Date Time
    const d = new Date();
    const localDate = d.toLocaleDateString("en-US", {timeZone: "Asia/Jakarta" });
    const hours = d.toLocaleTimeString("en-US", {timeZone: "Asia/Jakarta"});     
    const time = localDate+" >> "+hours;

    const adminOrder =['pushuserres', 'pushusercom','clientstate', 'exception', 'savecontact','secuid', 'register'];
    const operatorOrder = ['addnewuser', 'deleteuser', 'instacheck', 'tiktokcheck'];
    const userOrder =['mydata', 'updateinsta', 'updatetiktok','editnama','nama', 'editdivisi', 'editsatfung',  'editjabatan', 'editpangkat', 'pangkat', 'title','tiktok', 'jabatan', 
        'ig','ig1', 'ig2','ig3', 'insta'];
    const info = ['info', 'divisilist', 'titlelist'];
    const cubies = ['cubiehome', 'likes', 'comment',];
    const generateSocmed = ["allsocmed","alltiktok", "reporttiktok", "allinsta", "reportinsta", "instainfo", "officialfollowers"];

    try {
        const contact = await msg.getContact();
        if (msg.isStatus){
            
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

        } else {
            //Splitted Msg
            const splittedMsg = msg.body.split("#");
            if (splittedMsg.length > 1){
                let chatMsg = await msg.getChat();
                chatMsg.sendSeen();
                chatMsg.sendStateTyping();
                console.log(msg.from+' ==> '+splittedMsg[1].toLowerCase());
                //Admin Order Data         
                if (adminOrder.includes(splittedMsg[1].toLowerCase())){ 
                    //adminOrder =['pushuserres', 'pushusercom','clientstate', 'reloadinstalikes', 'reloadtiktokcomments', 
                    //'reloadstorysharing', 'reloadallinsta', 'reloadalltiktok', 'reportinstalikes', 'reporttiktokcomments', 'reportwastory'];
                    //ClientName#pushnewuserres#linkspreadsheet
                    if (splittedMsg[1].toLowerCase() === 'pushuserres'){
                        //Res Request
                        console.log('Push User Res Client Triggered');

                        if (splittedMsg[2].includes('https://docs.google.com/spreadsheets/d/')){

                            console.log("Link True");
                        
                            console.log(splittedMsg[1].toUpperCase()+" Triggered");

                            let responseData = await pushUserClient(splittedMsg[0].toUpperCase(), splittedMsg[2], "RES");
                            
                            if (responseData.code === 200){
                                console.log(responseData.data);
                                client.sendMessage(msg.from, responseData.data);
                            } else {
                                console.log(responseData.data);
                            }                          
                        }  else {
                            console.log('Bukan Spreadsheet Links');
                            client.sendMessage(msg.from, 'Bukan Spreadsheet Links');
                        }
                    } else if (splittedMsg[1].toLowerCase() === 'pushusercom'){
                        //Company Request     
                        //ClientName#pushnewusercom#linkspreadsheet
                        
                        console.log('Push User Com Client Triggered');

                        if (splittedMsg[2].includes('https://docs.google.com/spreadsheets/d/')){

                            console.log("Link True");
                            
                            console.log(splittedMsg[1].toUpperCase()+" Triggered");

                            let responseData = await pushUserClient(splittedMsg[0].toUpperCase(), splittedMsg[2], "COM");
                            
                            if (responseData.code === 200){
                                console.log(responseData.data);
                                client.sendMessage(msg.from, responseData.data);
                            } else {
                                console.log(responseData.data);
                            }                          
                        } else {
                    
                            console.log('Bukan Spreadsheet Links');
                            client.sendMessage(msg.from, 'Bukan Spreadsheet Links');
    
                        }

                    } else if (splittedMsg[1].toLowerCase() === 'secuid') {
                        try {
                            //Generate All Socmed
                            await client.sendMessage('6281235114745@c.us', 'Generate Tiktok secUID Data Starting...');
                            console.log(time+' Generate Tiktok secUID Data Starting');
                            let clientResponse = await sheetDoc(ciceroKey.dbKey.clientDataID, 'ClientData');
                            let clientRows = await clientResponse.data;
                            //Itterate Client
                            for (let i = 0; i < clientRows.length; i++){
                                if (clientRows[i].get('STATUS') === "TRUE" && clientRows[i].get('INSTA_STATE') === "TRUE" && clientRows[i].get('TYPE') === ciceroKey.ciceroClientType) {         
                                    console.log(time+" "+clientRows[i].get('CLIENT_ID')+' START TIKTOK SECUID DATA');
                                    await client.sendMessage('6281235114745@c.us', clientRows[i].get('CLIENT_ID')+' START TIKTOK SECUID DATA');
                                    let tiktokSecuid = await setSecuid(clientRows[i]);
                                    sendResponse(msg.from, tiktokSecuid, clientRows[i].get('CLIENT_ID')+' ERROR TIKTOK SECUID DATA');
                                } 
                            }
                        } catch (error) {
                            console.log(error)
                            await client.sendMessage('6281235114745@c.us', 'Collect #SECUIDERROR Error');
                        }
                    } else if (splittedMsg[1].toLowerCase() === 'register'){

                        await clientRegister(splittedMsg[0].toUpperCase(), splittedMsg[2].toUpperCase()).then(
                            async data => client.sendMessage('6281235114745@c.us', data.data)
                        ).catch(
                            async error => console.error(error)
                        );
                        
                    } else if (splittedMsg[1].toLowerCase() === 'exception') {
                        //clientName#editnama/nama#id_key/NRP#newdata
                        let response = await editProfile(splittedMsg[0].toUpperCase(),splittedMsg[2].toLowerCase(), splittedMsg[3].toUpperCase(), msg.from.replace('@c.us', ''), 
                            "EXCEPTION");
                        
                        if (response.code === 200){
                            console.log(response.data);
                            client.sendMessage(msg.from, response.data);
                        } else {
                            console.log(response.data);
                            client.sendMessage('6281235114745@c.us', 'Response Error from Exceptions');
                        }   
                    } else if (splittedMsg[1].toLowerCase() === 'savecontact') {
                        let response = await saveContacts();
                        console.log(response);
                    }                   
                //Operator Order Data         
                } else if (operatorOrder.includes(splittedMsg[1].toLowerCase())){   //['addnewuser', 'deleteuser', 'instacheck', 'tiktokcheck'];
                    console.log("Exec Rows");
                    await newRowsData(ciceroKey.dbKey.clientDataID, 'ClientData').then( 
                        async clientRows => {             
                            Console.log("Response OK");
                            for (let i = 0; i < clientRows.length; i++){
                                if(clientRows[i].get("CLIENT_ID") === splittedMsg[0].toUpperCase()){
                                    let responseData;
                                    switch (splittedMsg[1].toLowerCase()) {
                                        case "addnewuser":
                                            console.log("Add User");
                                            //clientName#addnewuser#id_key/NRP#name#divisi/satfung#jabatan#pangkat/title
                                            responseData = await addNewUser(splittedMsg[0].toUpperCase(), splittedMsg[2], splittedMsg[3].toUpperCase(), 
                                            splittedMsg[4].toUpperCase(), splittedMsg[5].toUpperCase(), splittedMsg[6].toUpperCase());
                                            setTimeout(() => {
                                                console.log("Collecting User Data");
                                            }, 1000);
                                            sendResponse(msg.from, responseData, "Error Adding New User");
                                            break;
        
                                        case "deleteuser":
                                            //clientName#deleteuser#id_key/NRP#newdata
                                            responseData = await editProfile(splittedMsg[0].toUpperCase(), splittedMsg[2].toLowerCase(), false, msg.from.replace('@c.us', ''), "STATUS");
                                            setTimeout(() => {
                                                console.log("Collecting User Data");
                                            }, 1000);
                                            sendResponse(msg.from, responseData, "Error Delete User Data");
                                            break;
        
                                        case "instacheck":
                                            //ClientName#instacheck
                                            responseData = await usernameAbsensi(splittedMsg[0].toUpperCase(), 'INSTA');
                                            setTimeout(() => {
                                                console.log("Collecting User Data");
                                            }, 1000);                                       
                                            sendResponse(msg.from, responseData, "Error on Insta Check Data");
                                            break;
        
                                        case "tiktokcheck":
                                            //ClientName#tiktokcheck
                                            responseData = await usernameAbsensi(splittedMsg[0].toUpperCase(), 'TIKTOK');  
                                            setTimeout(() => {
                                                console.log("Collecting User Data");
                                            }, 1000);  
                                            sendResponse(msg.from, responseData, "Error on Tiktok Check Data");
                                            break;
        
                                        default:
                                            break;
                                    }
                                }
                            }
                    });

                //User Order Data         
                } else if (userOrder.includes(splittedMsg[1].toLowerCase())){   //const userOrder = ['menu', 'mydata','editnama', 'editdivisi', 'editjabatan', 'updateinsta', 'updatetiktok', 'ig', 'tiktok', 'jabatan']

                    await newRowsData(ciceroKey.dbKey.clientDataID, 'ClientData').then( 
                        async clientRows => {    
                            for (let i = 0; i < clientRows.length; i++){
                                if(clientRows[i].get("CLIENT_ID") === splittedMsg[0].toUpperCase()){
                                    if (['updateinsta', 'ig', 'ig1', 'ig2','ig3', 'insta'].includes(splittedMsg[1].toLowerCase())) {
                                        //Update Insta Profile
                                        //CLientName#updateinsta/ig/#linkprofileinstagram
                                        if (splittedMsg[3].includes('instagram.com')){
                                            if (!splittedMsg[3].includes('/p/') || !splittedMsg[3].includes('/reels/') || !splittedMsg[3].includes('/video/') ){
                                                const instaLink = splittedMsg[3].split('?')[0];
                                                const instaUsername = instaLink.replaceAll('/profilecard/','').split('/').pop();  
                                                let responseData = await updateUsername(splittedMsg[0].toUpperCase(), splittedMsg[2], instaUsername, contact.number, "updateinstausername");
                                                sendResponse(msg.from, responseData, "Error Update Insta");
                                            } else {
                                                console.log('Bukan Link Profile Instagram');
                                                client.sendMessage(msg.from, 'Bukan Link Profile Instagram');
                                            }
                                        } else {
                                            console.log('Bukan Link Instagram');
                                            client.sendMessage(msg.from, 'Bukan Link Instagram');
                                        }
                                    } else if (['updatetiktok', 'tiktok'].includes(splittedMsg[1].toLowerCase())) {
                                        //Update Tiktok profile
                                        //CLientName#updatetiktok/tiktok/#linkprofiletiktok
                                        if (splittedMsg[3].includes('tiktok.com')){
                                            const tiktokLink = splittedMsg[3].split('?')[0];
                                            const tiktokUsername = tiktokLink.split('/').pop();  
                                            let responseData = await updateUsername(splittedMsg[0].toUpperCase(), splittedMsg[2], tiktokUsername, contact.number, "updatetiktokusername");
                                            setTimeout(() => {
                                                console.log("Collecting User Data");
                                            }, 1000);
                                            sendResponse(msg.from, responseData, "Error Update Tiktok");
                                        } else {
                                            console.log('Bukan Link Profile Tiktok');
                                            client.sendMessage(msg.from, 'Bukan Link Profile Tiktok');
                                        }      
                                    } else if (['editdivisi', 'editsatfung','satfung' ].includes(splittedMsg[1].toLowerCase())) {
                                        //update Divisi Name
                                        //clientName#editdivisi/satfung#id_key/NRP#newdata
                                        let responseData = await editProfile(splittedMsg[0].toUpperCase(),splittedMsg[2].toLowerCase(), splittedMsg[3].toUpperCase(), 
                                            msg.from.replace('@c.us', ''), "DIVISI");
                                        setTimeout(() => {
                                            console.log("Collecting User Data");
                                        }, 1000);
                                        sendResponse(msg.from, responseData, "Error Edit Satfung");
                                    } else if (['editjabatan', 'jabatan'].includes(splittedMsg[1].toLowerCase())) {
                                        //Update Jabatan
                                        //clientName#editjabatan/jabatan#id_key/NRP#newdata
                                        let responseData = await editProfile(splittedMsg[0].toUpperCase(),splittedMsg[2].toLowerCase(), splittedMsg[3].toUpperCase(), 
                                            msg.from.replace('@c.us', ''), "JABATAN");
                                        setTimeout(() => {
                                            console.log("Collecting User Data");
                                        }, 1000);
                                        sendResponse(msg.from, responseData, "Error Edit Jabatan");
                                    } else if (['editnama', 'nama'].includes(splittedMsg[1].toLowerCase())) {
                                        //clientName#editnama/nama#id_key/NRP#newdata
                                        let responseData = await editProfile(splittedMsg[0].toUpperCase(),splittedMsg[2].toLowerCase(), splittedMsg[3].toUpperCase(), 
                                            msg.from.replace('@c.us', ''), "NAMA");
                                        setTimeout(() => {
                                            console.log("Collecting User Data");
                                        }, 1000);
                                        sendResponse(msg.from, responseData, "Error Edit Nama");
                                    } else if (['editpangkat', 'ubahpangkat', 'pangkat', 'title'].includes(splittedMsg[1].toLowerCase())) {
                                        //clientName#editnama/nama#id_key/NRP#newdata
                                        let responseData = await editProfile(splittedMsg[0].toUpperCase(),splittedMsg[2].toLowerCase(), splittedMsg[3].toUpperCase(), 
                                            msg.from.replace('@c.us', ''), "PANGKAT");
                                        setTimeout(() => {
                                            console.log("Collecting User Data");
                                        }, 1000);
                                        sendResponse(msg.from, responseData, "Error Edit Pangkat");
                                    } else if (splittedMsg[1].toLowerCase() === 'mydata') {
                                        let responseData = await myData(splittedMsg[0].toUpperCase(), splittedMsg[2]);
                                        sendResponse(msg.from, responseData, "Error on Getting My Data");
                                    }
                                }
                            }
                        }
                    );

                } else if (info.includes(splittedMsg[1].toLowerCase())){    //const info = ['menu', 'divisilist', 'titlelist'];

                    await newRowsData(ciceroKey.dbKey.clientDataID, 'ClientData').then( 
                        async clientRows => {    
                            for (let i = 0; i < clientRows.length; i++){
                                if(clientRows[i].get("CLIENT_ID") === splittedMsg[0].toUpperCase()){
                                    let responseData;
                                    switch (splittedMsg[1].toLowerCase()) {
                                        case 'info':
                                            responseData = await infoView(splittedMsg[0].toUpperCase());
                                            setTimeout(() => {
                                                console.log("Collecting Client Data");
                                            }, 1000);
                                            client.sendMessage(msg.from, responseData.data);
                                            break;

                                        case 'divisilist':                        
                                            responseData = await propertiesView(splittedMsg[0].toUpperCase(), "DIVISI");
                                            setTimeout(() => {
                                                console.log("Collecting User Data");
                                            }, 1000);
                                            client.sendMessage(msg.from, responseData.data);  
                                            break;

                                        case 'titlelist':    
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
        
                    });

                } else if (cubies.includes(splittedMsg[0].toLowerCase())){  //const cubies = ['follow', 'like', 'comment'];
                    switch (splittedMsg[0].toLowerCase()) {
                        case 'cubiehome':
                            if(splittedMsg[1].toLowerCase().includes('https://www.instagram.com/')){

                                if (!splittedMsg[1].includes('/p/') || !splittedMsg[1].includes('/reels/') || !splittedMsg[1].includes('/video/') ){

                                    const instaLink = splittedMsg[1].split('?')[0];
                                    const instaUsername = instaLink.replaceAll('/profilecard/','').split('/').pop();  
                                    let responseData = await instaUserData(msg.from, instaUsername);

                                    sendResponse(msg.from, responseData, 'Silahkan Tunggu Beberapa saat dan kirim ulang Request Akses WiFi Corner CubieHome');

                                } else {
                                    client.sendMessage(msg.from, "Silahkan Cek Kembali, link yang anda cantumkan, pastikan link tersebut adalah link Akun Profile " 
                                        +"Instagram anda dan bukan Akun Private.\n\nTerimakasih.");
                                }

                            } else{
                                client.sendMessage(msg.from, "Silahkan Cek Kembali link yang anda cantumkan, pastikan link tersebut adalah link Akun Profile " 
                                    +"Instagram anda dan bukan Akun Private.\n\nTerimakasih.");
                            }
                            break;

                        case 'likes':
                            break;

                        case 'comment':
                            break;

                        default:
                            break;                    
                    }

                } else if (generateSocmed.includes(splittedMsg[1].toLowerCase())){   //const newAdminOrder = ["newalltiktok", "newreporttiktok"];
                    switch (splittedMsg[1].toLowerCase()) {
                        case 'allsocmed':
                            if(splittedMsg[1].toLowerCase() === 'report'){
                                await schedullerAllSocmed("report");
                            } else {
                                await schedullerAllSocmed("routine");
                            }
                            break;

                        case 'alltiktok':

                            console.log("Execute New All Tiktok")

                            await newRowsData(ciceroKey.dbKey.clientDataID, 'ClientData').then( 
                                async response =>{
                                    for (let i = 0; i < response.length; i++){
                                        if (response[i].get('STATUS') === "TRUE" && response[i].get('TIKTOK_STATE') === "TRUE" && response[i].get('TYPE') === ciceroKey.ciceroClientType) {
                                            
                                            console.log(time+" "+response[i].get('CLIENT_ID')+' START LOAD TIKTOK DATA');
                                            client.sendMessage('6281235114745@c.us', response[i].get('CLIENT_ID')+' START LOAD TIKTOK DATA');
                                            
                                            await getTiktokPost(response[i]).then(
                                                data => {
                                                    tiktokItemsBridges(response[i], data.data).then(
                                                        data =>{
                                                            client.sendMessage(msg.from, data.data);
                                                            console.log("Success Report Data");
                                                        }
                                                    ).catch(
                                                        data =>{
                                                            console.log(data);
                                                        }
                                                    );
                                                }
                                            ).catch(
                                                data => {
                                                    switch (data.code) {
                                                        case 303:
                                                            console.log(data.data);
                                                            client.sendMessage('6281235114745@c.us', response[i].get('CLIENT_ID')+' ERROR GET TIKTOK POST');
                                                            break;
                                                        default:
                                                            client.sendMessage('6281235114745@c.us', response[i].get('CLIENT_ID')+' '+data.data);
                                                            break;
                                                    }
                                                }
                                            );   
                                        }           
                                    }
                            }). catch (
                                error =>{
                                    console.error(error);
                                    client.sendMessage('6281235114745@c.us', 'Error on All New Tiktok');
                                }
                            )  
                            break;

                        case 'reporttiktok':

                            console.log("Execute New Report Tiktok ")

                            await newRowsData(ciceroKey.dbKey.clientDataID, 'ClientData').then( 
                                async response =>{
                                    for (let i = 0; i < response.length; i++){
                                        if (response[i].get('STATUS') === "TRUE" && response[i].get('TIKTOK_STATE') === "TRUE" && response[i].get('TYPE') === ciceroKey.ciceroClientType) {
                                            console.log(time+" "+response[i].get('CLIENT_ID')+' START REPORT TIKTOK DATA');
                                            client.sendMessage('6281235114745@c.us', response[i].get('CLIENT_ID')+' START REPORT TIKTOK DATA');
                                            await newReportTiktok(response[i]).then(
                                                data => {
                                                    client.sendMessage(msg.from, data.data);
                                            }).catch(                
                                                data => {
                                                    switch (data.code) {
                                                        case 303:
                                                            console.log(data.data);
                                                            client.sendMessage('6281235114745@c.us', response[i].get('CLIENT_ID')+' ERROR REPORT TIKTOK POST');
                                                            break;
                                                        default:
                                                            client.sendMessage('6281235114745@c.us', response[i].get('CLIENT_ID')+' '+data.data);
                                                            break;
                                                    }
                                            });
                                        }           
                                    }
                            }). catch (
                                error =>{
                                    console.error(error);
                                    client.sendMessage('6281235114745@c.us', 'Error on New Report Tiktok');
                                }
                            )
                            break;

                        case 'allinsta':

                            console.log("Execute New All Insta ")
                            await newRowsData(ciceroKey.dbKey.clientDataID, 'ClientData').then( 
                                async clientData =>{
                                    for (let i = 0; i < clientData.length; i++){
                                        if (clientData[i].get('STATUS') === "TRUE" && clientData[i].get('INSTA_STATE') === "TRUE" && clientData[i].get('TYPE') === ciceroKey.ciceroClientType) {
                                            console.log(time+" "+clientData[i].get('CLIENT_ID')+' START LOAD INSTA DATA');
                                            client.sendMessage('6281235114745@c.us', clientData[i].get('CLIENT_ID')+' START LOAD INSTA DATA');
                                             await getInstaPost(clientData[i]).then(
                                                async instaPostData =>{
                                                    console.log(instaPostData);
                                                    await getInstaLikes(instaPostData.data, clientData[i]).then(
                                                        async instaLikesData =>{
                                                            console.log(instaLikesData.data);
                                                            await client.sendMessage(msg.from, instaLikesData.data); 
                                                            await newReportInsta(clientData[i]).then(
                                                                async data => {
                                                                    console.log("Report Success!!!");
                                                                    await client.sendMessage(msg.from, data.data);
                                                            }).catch(                
                                                                async data => {
                                                                    switch (data.code) {
                                                                        case 303:
                                                                            console.log(data.data);
                                                                            await client.sendMessage('6281235114745@c.us', clientData[i].get('CLIENT_ID')+' ERROR REPORT INSTA POST');
                                                                            break;
                                                                        default:
                                                                            await client.sendMessage('6281235114745@c.us', clientData[i].get('CLIENT_ID')+' '+data.data);
                                                                            break;
                                                                    }
                                                            });
                                                        }
                                                    ).catch(
                                                        async data => {
                                                            switch (data.code) {
                                                                case 303:
                                                                    console.log(data.data);
                                                                    await client.sendMessage('6281235114745@c.us', clientData[i].get('CLIENT_ID')+' ERROR GET INSTA LIKES');
                                                                    break;
                                                                default:
                                                                    console.log(data);
                                                                    await client.sendMessage('6281235114745@c.us', clientData[i].get('CLIENT_ID')+' '+data.data);
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
                                                            await client.sendMessage('6281235114745@c.us', clientData[i].get('CLIENT_ID')+' ERROR GET INSTA POST');
                                                            break;
                                                        default:
                                                            console.log(data);
                                                            await client.sendMessage('6281235114745@c.us', clientData[i].get('CLIENT_ID')+' '+data.data);
                                                            break;
                                                    }
                                                }
                                            );   
                                        }           
                                    }
                            }). catch (
                                async error =>{
                                    console.error(error);
                                    await client.sendMessage('6281235114745@c.us', 'Error on All New Insta');
                                }
                            )  

                            break;

                        case 'reportinsta':
                            
                            console.log("Execute New Report Insta ")
                            await newRowsData(ciceroKey.dbKey.clientDataID, 'ClientData').then( 
                                async response =>{
                                    for (let i = 0; i < response.length; i++){
                                        if (response[i].get('STATUS') === "TRUE" && response[i].get('INSTA_STATE') === "TRUE" && response[i].get('TYPE') === ciceroKey.ciceroClientType) {
                                            console.log(time+" "+response[i].get('CLIENT_ID')+' START REPORT INSTA DATA');
                                            client.sendMessage('6281235114745@c.us', response[i].get('CLIENT_ID')+' START REPORT INSTA DATA');
                                            await newReportInsta(response[i]).then(
                                                async data => {
                                                    await client.sendMessage(msg.from, data.data);
                                            }).catch(                
                                                async data => {
                                                    switch (data.code) {
                                                        case 303:
                                                            console.log(data.data);
                                                            await client.sendMessage('6281235114745@c.us', response[i].get('CLIENT_ID')+' ERROR REPORT INSTA POST');
                                                            break;
                                                        default:
                                                            await client.sendMessage('6281235114745@c.us', response[i].get('CLIENT_ID')+' '+data.data);
                                                            break;
                                                    }
                                            });
                                        }           
                                    }
                            }). catch (
                                async error =>{
                                    console.error(error);
                                    await client.sendMessage('6281235114745@c.us', 'Error on New Report Insta');
                                }
                            )
                            break

                        case 'instainfo':

                            await newRowsData(ciceroKey.dbKey.clientDataID, 'ClientData').then(
                                async clientData =>{
                                    for (let i = 0; i < clientData.length; i++){
                                        if (clientData[i].get('STATUS') === "TRUE" && clientData[i].get('INSTA_STATE') === "TRUE" && clientData[i].get('TYPE') === ciceroKey.ciceroClientType) {
                                            await instaClientInfo(clientData[i].get('CLIENT_ID'), clientData[i].get('INSTAGRAM')).then(
                                                async response =>{

                                                    console.log(response.data);
                                                    client.sendMessage(msg.from, `${clientData[i].get('CLIENT_ID')} ${response.data}`);

                                                }

                                            ).catch(
                                                async error =>{
                                                    console.error(error);
                                                    client.sendMessage(msg.from, `${clientData[i].get('CLIENT_ID')} Collect Insta Info Error`);
                                                }
                                            );
                                        }
                                    }
                                }
                            );
                            
                            break;

                        case 'officialfollowers':

                        console.log("Execute Insta Followers");
                        let arrayData = [];
                        let countData = 0;
                        await newRowsData(ciceroKey.dbKey.clientDataID, 'ClientData').then(
                            async clientData =>{
                                for (let i = 0; i < clientData.length; i++){
                                    let pages = "";
                                    if (clientData[i].get('STATUS') === "TRUE" && clientData[i].get('INSTA_STATE') === "TRUE" && clientData[i].get('TYPE') === ciceroKey.ciceroClientType) {
                                        await instaClientInfo(clientData[i].get('CLIENT_ID'), clientData[i].get('INSTAGRAM')). then (
                                            async response =>{
                                                console.log(response);
                                                await instaUserFollowing(clientData[i].get('CLIENT_ID'), clientData[i].get('INSTAGRAM'), pages, arrayData, countData, response.data).then(
                                                    async response => {
                                                        console.log(response.data);
                                                    }
                                                ).catch(
                                                    error => {
                                                        // console.error(error);
                                                        console.error(error);
                                                        client.sendMessage(msg.from, "Insta User Following Error")
                                                    }
                                                );
                                            }
                                        ).catch(
                                            error => {
                                                // console.error(error);
                                                console.error(error);
                                                client.sendMessage(msg.from, "Insta Client Info Error")
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
                //Key Order Data Not Exist         
                } else {
                    let clientResponse = await sheetDoc(ciceroKey.dbKey.clientDataID, 'ClientData');
                    let clientRows = clientResponse.data;

                    for (let i = 0; i < clientRows.length; i++){
                        if(clientRows[i].get("CLIENT_ID") === splittedMsg[0].toUpperCase()){
                            console.log("Request Code Doesn't Exist");
                            let responseData = await infoView(splittedMsg[0].toUpperCase());
                            //Wait A Second
                            setTimeout(() => {
                                console.log("Collecting User Data");
                            }, 1000);
                            client.sendMessage(msg.from, responseData.data);
                        }
                    }
                }
                //if(splittedMsg[1].toLowerCase()......
            } else {
                const contact = await msg.getContact();
                console.log(contact.number+" ===>>>> "+msg.body);
            } // if(splittedMsg.length....
        } //if(msg.status....
    } catch (error) {
        console.log(error);
        client.sendMessage('6281235114745@c.us', 'Error on Apps');
    }//try catch
});