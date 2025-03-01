//Route
import express from 'express';
export const app = express();

app.set("view engine", "ejs")

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
//Files

//Local Dependency
import { myData } from './app/controller/read_data/read_my_data.js';
import { infoComView, infoResView } from './app/view/user_info_view.js';
import { propertiesView } from './app/view/properties_view.js';
import { usernameAbsensi } from './app/controller/reporting/username_absensi.js';
import { updateUsername } from './app/controller/data_updated/update_socmed_username.js';
import { setSecuid } from './app/module/get_secuid_tiktok.js';
import { tiktokItemsBridges } from './app/controller/scrapping_tiktok/tiktok_items_bridge.js';
import { getTiktokPost } from './app/controller/scrapping_tiktok/generate_tiktok_post.js';
import { newReportTiktok } from './app/controller/reporting/tiktok_report.js';
import { newReportInsta } from './app/controller/reporting/insta_report.js';
import { getInstaPost } from './app/controller/scrapping_insta/generate_insta_post.js';
import { getInstaLikes } from './app/controller/scrapping_insta/generate_insta_likes.js';
import { schedullerAllSocmed } from './app/controller/reporting/scheduller_all_socmed.js';
import { adminOrder, dataBackup, dataManagement, dataRestore, generateSocmed, infoOrder, operatorOrder, userOrder } from './app/constant/constant.js';
import { addNewUser } from './app/controller/new_data/added_user.js';
import { editProfile } from './app/controller/data_updated/edit_user_data.js';
import { editjabatan, editnama, edittitle, updatedivisi, updateinsta, updatetiktok } from './app/constant/update_n_order.js';
import { warningReportInsta } from './app/controller/reporting/user_warning_insta.js';
import { warningReportTiktok } from './app/controller/reporting/user_warning_tiktok.js';
import { schedule } from 'node-cron';
import { pushUserCom, pushUserRes } from './app/controller/new_data/added_client_users_data.js';
import { decrypted } from './app/module/crypto.js';
import { clientDataBackup } from './app/controller/data_backup/client_data.js';
import { userDataBackup } from './app/controller/data_backup/user_data.js';
import { instaContentBackup } from './app/controller/data_backup/insta_content.js';
import { tiktokContentBackup } from './app/controller/data_backup/tiktok_content.js';
import { instaLikesBackup } from './app/controller/data_backup/insta_likes.js';
import { tiktokCommentsBackup } from './app/controller/data_backup/tiktok_comment.js';
import { clientDataView } from './app/controller/data_management/client_list.js';
import { updateClientData } from './app/controller/data_updated/update_client.js';
import { registerClientData } from './app/controller/new_data/register_new_client.js';
import { logsError, logsSave, logsSend, logsUserError, logsUserSend } from './app/view/logs_whatsapp.js';
import { adminInfoView } from './app/view/admin_info_view.js';
import { oprInfoView } from './app/view/opr_info_view.js';
import { clientData } from './app/controller/read_data/read_client_data_from_json.js';
import { restoreClientData } from './app/controller/data_restore/restore_client_data.js';
import { restoreUserData } from './app/controller/data_restore/restore_user_data.js';
import { restoreInstaContent } from './app/controller/data_restore/restore_insta_content_data.js';
import { restoreInstaLikes } from './app/controller/data_restore/restore_insta_likes_data.js';
import { restoreTiktokContent } from './app/controller/data_restore/restore_tiktok_content.js';
import { restoreTiktokComments } from './app/controller/data_restore/restore_tiktok_comments.js';
import { usernameInfo } from './app/controller/read_data/username_info.js';
import { authorize, saveGoogleContact } from './app/module/g_contact_api.js';
import { readUser } from './app/controller/read_data/read_data_from_dir.js';
import { getInstaUserInfo } from './app/controller/scrapping_insta/generate_insta_user_info.js';
import { instaVisData } from './app/controller/reporting/insta_vis_likes_data.js';

//.env
const private_key = process.env;
const port = private_key.EXPRESS_PORT || 3000;

app.listen(port, () => {
    logsSave(`Cicero System Start listening on port >>> ${port}`)
});


app.get('/login', function (req, res) {

    res.render("login")

});

app.get('/bojonegoro', function (req, res) {
    readUser("BOJONEGORO").then(
        response =>     res.render("index", { data: response.data, ID_CLIENT: "BOJONEGORO"})
    );
});

app.get('/ponorogo', function (req, res) {
    readUser("PONOROGO").then(
        response =>     res.render("index", { data: response.data, ID_CLIENT: "PONOROGO"})
    );
});

app.get('/cubiespot', function (req, res) {
    readUser("CUBIESPOT").then(
        response =>     res.render("index", { data: response.data, ID_CLIENT: "CUBIESPOT"})
    );
});

app.get('/bpn2sby', function (req, res) {
    readUser("BPN2SBY").then(
        response =>     res.render("index", { data: response.data, ID_CLIENT: "BPN2SBY"})
    );
});

// WWEB JS Client Constructor
export const client = new Client({
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        headless: true

    },
    authStrategy: new LocalAuth({
        clientId: private_key.APP_SESSION_NAME,
    }),
    
});

// On WWEB Client Initializing
logsSave('System Initializing...');
client.initialize();

// On WWeB Authenticate Checking
client.on('authenthicated', (session)=>{
    logsSave(JSON.stringify(session));
});

// On WWEB If Authenticate Failure
client.on('auth_failure', msg => {
    console.error('AUTHENTICATION FAILURE', msg);
});

// On WWEB If Disconected
client.on('disconnected', (reason) => {
    console.error('Client was logged out', reason);
});

// On Pairing with QR Code
client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

// On Reject Calls
let rejectCalls = true;
client.on('call', async (call) => {
    logsSave('Call received, rejecting. GOTO Line 261 to disable', call);
    if (rejectCalls) await call.reject();
});

// On WWeb Ready
client.on('ready', () => {
    //Banner
    logsSave(textSync("CICERO -X- CUBIESPOT", {
        font: "Ghost",
        horizontalLayout: "fitted",
        verticalLayout: "default",
        width: 240,
        whitespaceBreak: true,
    }));

    set("Cicero System Manajemen As A Services");
    logsSave('===============================');
    logsSave('===============================');
    logsSave('======System Fully Loaded!=====');
    logsSave('=========Enjoy the Ride========');
    logsSave('===We\'ll Take Care Everything==');
    logsSave('===============================');
    logsSave('===============================');

    // Server Life State Warning
    schedule('*/10 * * * *',  () =>  {
        logsSend('<<<System Alive>>>');
    });

    // Scrapping Socmed every hours until 21
    schedule('30 6-20 * * *',  () => {
        logsSend('Execute Hourly Cron Job');
        schedullerAllSocmed("routine"); //Scheduler Function, routine catch generated data every hours
    });

    schedule('00 15,18,21 * * *',  () => {
        logsSend('Execute Reporting Cron Job');
        schedullerAllSocmed("report"); //Scheduller Function, report catch and send generated data to Administrator and Operator
    });

    //User Warning Likes Comments Insta & Tiktok
    schedule('00 12,16,19 * * *',  () => {

        logsSend('Execute Cron Job Warning Likes Comments Insta & Tiktok');
        
        clientData().then( async response =>{
            
            let clientRows = response.data;

                let i = 0;

                (async function loop() {

                    if (++i < clientRows.length) {

                        //This Procces Tiktok Report
                        if (decrypted(clientRows[i].STATUS) === "TRUE" 
                            && decrypted(clientRows[i].TIKTOK_STATE) === "TRUE" 
                                && decrypted(clientRows[i].TYPE) === process.env.APP_CLIENT_TYPE) {
                                    await warningReportTiktok(clientRows[i]).then(async response => {
                                        logsSend(response.data);
                                    }).catch( 
                                        error => logsError(error)
                                    );
                                }         

                        //This process Insta Report
                        if (decrypted(clientRows[i].STATUS) === "TRUE" 
                            && decrypted(clientRows[i].INSTA_STATE) === "TRUE" 
                                && decrypted(clientRows[i].TYPE) === process.env.APP_CLIENT_TYPE) {
                                    await warningReportInsta(clientRows[i]).then(                            
                                        response => logsSend(response.data)
                                    ).catch( 
                                        error => logsError(error)
                                    );
                                }  
                        setTimeout(loop, 1000);

                    } else {
                        console.log("Send All Notif Done");
                    }
                })();

        }).catch(
            error => logsError(error)
        );
    });

    //Backup Client & User data
    schedule('0 1 * * *',  async () => {
        
        if(process.env.APP_CLIENT_TYPE === "RES"){
            
            await clientDataBackup().then(
                response => logsSend(response.data)
            ).catch( 
                error => logsError(error)
            );

            await userDataBackup().then(
                response => logsSend(response.data)
            ).catch( 
                error => logsError(error)
            );
        }                
    });
});

client.on('message', async (msg) => {
    try {

        const contact = await msg.getContact(); // This Catch Contact Sender. 
        
        if (msg.isStatus){ // This Catch Wa Story from Users
            //If Msg is WA Story
            const chat = await msg.getChat();
            chat.sendSeen();

            if (contact.pushname !== undefined){
                
                logsSave(contact.pushname+" >>> "+msg.body);
                
                let body = msg.body;
                let url = body.match(/\bhttps?:\/\/\S+/gi);
                if (url != null || url != undefined){
                    let splittedUrl = url[0].split('/');
                    if (splittedUrl.includes("www.instagram.com")){
                        logsSave('Response Sent');
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
                            logsSave(response.data);
                        }
                    */ 
                    }
                }            
            }
        } else { // This Catch Request Messages

            const chatMsg = await msg.getChat(); //this catch message data
            chatMsg.sendSeen(); //this send seen by bot whatsapp
            chatMsg.sendStateTyping(); //this create bot typing state 

            //Splitted Msg
            const splittedMsg = msg.body.split("#"); //this Proccess Request Order by Splitting Messages
            if (splittedMsg.length > 1){ //System response if message is user by lenght of splitted messages

                logsSave(msg.from+' >>> '+splittedMsg[1].toLowerCase());
                
                //Admin Order Data         
                if (adminOrder.includes(splittedMsg[1].toLowerCase())){ 
                    if(msg.from === "6281235114745@c.us"){
                        switch(splittedMsg[1].toLowerCase()){
                            case 'pushuserres': 
                                {
                                    //Res Request
                                    logsSave('Push User Res Client Triggered');
        
                                    if (splittedMsg[2].includes('https://docs.google.com/spreadsheets/d/')){
        
                                        let slicedData = splittedMsg[2].split('/');
                                        let sheetID;
        
                                        if (slicedData[slicedData.length-1].includes('edit')){
                                            sheetID = slicedData[slicedData.length-2];
                                            logsSave(sheetID);
                                        } else {
                                            sheetID = slicedData[slicedData.length-1];
                                            logsSave(sheetID);
                                        }
        
                                        await pushUserRes(splittedMsg[0], sheetID)
                                        .then(
                                            response =>
                                            logsSend(response.data)
                                        )
                                        .catch(
                                            error => logsError(error)
                                        );    
                                                                
                                    }  else {                                       
                                        logsSend('Bukan Spreadsheet Links');
                                    }
                                }
                                    break;
                            case 'pushusercom': 
                                {
        
                                    //Com Request
                                    logsSave('Push User Com Client Triggered');
        
                                    if (splittedMsg[2].includes('https://docs.google.com/spreadsheets/d/')){
        
                                        let slicedData = splittedMsg[2].split('/');
                                        let sheetID;
        
                                        if (slicedData[slicedData.length-1].includes('edit')){
                                            sheetID = slicedData[slicedData.length-2];
                                            logsSend(sheetID);
                                        } else {
                                            sheetID = slicedData[slicedData.length-1];
                                            logsSend(sheetID);
                                        }
        
                                        await pushUserCom(splittedMsg[0], sheetID).then(
                                            response => logsSend(response.data)
                                        ).catch(                                        
                                            error => logsError(error)
                                        );
                                                                    
                                    }  else {
                                        
                                        logsSend('Bukan Spreadsheet Links');
        
                                    }
        
                                }
                                    break;                  
                            case 'exception': 
                                {//Exception
                                    await editProfile(
                                        splittedMsg[0].toUpperCase(),
                                        splittedMsg[2].toLowerCase(), 
                                        splittedMsg[3].toUpperCase(), 
                                        msg.from.replace('@c.us', ''),
                                        "EXCEPTION"
                                    ).then(
                                        response => logsSend(response.data)
                                    ).catch(                                            
                                        error => logsError(error)
                                    );
        
                                }
                                break;
                            case 'secuid': 
                                {
                                    //Generate All Socmed                                    
                                    logsSend(time+' Generate Tiktok secUID Data Starting');
                    
                                    await clientData().then(
                                        async response =>{
                                            //Itterate Client

                                            let clientRows = response.data; 

                                            let i = 0;

                                            (function loop() {
                                                if (++i < clientRows.length) {
                                                    if (decrypted(clientRows[i].STATUS) === "TRUE" 
                                                        && decrypted(clientRows[i].INSTA_STATE) === "TRUE" 
                                                            && decrypted(clientRows[i].TYPE) === process.env.APP_CLIENT_TYPE){
                                                                setSecuid(clientRows[i]).then(
                                                                    response => logsSend(response.data)
                                                                ).catch(
                                                                    error => logsError(error)
                                                                )
                                                            } 
                                                    setTimeout(loop, 3000);  
                                                } else {
                                                    console.log("Generate Secuid Data Done");
                                                }
                                            })();
                                
                                        }
                                    ).catch(
                                        error => console.log(error)
                                    )
        
                                }
                                break;
                            case 'savecontact': 
                                {
                                    await readUser(splittedMsg[0].toUpperCase()).then(
                                        async response =>{
                                            console.log(response);


                                            let i = 0;

                                            let userRows = await response.data;


                                            (function loop() {

                                                console.log(userRows[i].NAMA);

                                                if (++i < userRows.length) {
                                                    if (userRows[i].STATUS === 'TRUE'){
                                                        if (userRows[i].WHATSAPP !== ""){
                                                            authorize().then(
                                                                async auth =>
                                                                    {
                                                                        console.log(await saveGoogleContact(userRows[i].NAMA, `+${userRows[i].WHATSAPP}`, auth));
    
                                                                    }
                                                            ).catch(console.error); 
                                                        }
                                                    } 
                                                    setTimeout(loop, 1200);  
                                                }
                                            })();               
                                        }
                                    )                    
                                }
                                break;
                            case 'clientdata':
                                {
                                    switch (splittedMsg[2].toLowerCase()) {
                                        case 'insta':
                                            {
                                                if (splittedMsg[3].includes('instagram.com')){
                                                    if (!splittedMsg[3].includes('/p/') 
                                                        || !splittedMsg[3].includes('/reels/') 
                                                            || !splittedMsg[3].includes('/video/') ){
                                                                
                                                                let instaLink;
                                                                let instaUsername;
                                                                if (splittedMsg[3].includes('/profilecard/')){
                                                                    instaLink = splittedMsg[3].split('?')[0];
                                                                    instaUsername = instaLink.replaceAll(
                                                                        '/profilecard/',
                                                                        ''
                                                                    ).split('/').pop();  
                                                                } else {
                                                                    instaLink = splittedMsg[3].replaceAll(
                                                                        '/?',
                                                                        '?'
                                                                    ).split('?')[0];
                                                                    instaUsername = instaLink.split('/').pop();  
                                                                }
                                                                                                            
                                                                await updateClientData(splittedMsg[0].toUpperCase(), instaUsername, "insta").then(
                                                                    response => logsSend(response.data)
                                                                ).catch(
                                                                    error => logsError(error)
                                                                );
                            
                                                            } else {
                                                                logsSend('Bukan Link Profile Instagram');
                                                            }
                    
                                                        } else {
                                                            logsSend('Bukan Link Profile Instagram');
                                                        }
                                            }
                                            
                                            break;
                                        case 'instastate':
                                            {
                                                if (["TRUE", "FALSE"].includes(splittedMsg[3].toUpperCase())){
                                                    updateClientData(splittedMsg[0].toUpperCase(), splittedMsg[3].toUpperCase(), "instastate").then(
                                                        response => logsSend(response.data)
                                                    ).catch(
                                                        error => logsError(error)
                                                    );
                
                                                }
                                            }
                                            break;
                                        case 'tiktok':
                                            {
                                                if (splittedMsg[3].includes('tiktok.com')){
                                            
                                                    const tiktokLink = splittedMsg[3].split('?')[0];
                                                    const tiktokUsername = tiktokLink.split('/').pop();  
    
                                                    updateClientData(splittedMsg[0].toUpperCase(), tiktokUsername, "tiktok").then(
                                                        response => logsSend(response.data)
                                                    ).catch(
                                                        error => logsError(error)
                                                    );
            
                                                } else {
                                                    logsSend('Bukan Link Profile Tiktok');
                                                }
                                            }           
                                            break;
                                        case 'tiktokstate':
                                            {
                                                if (["TRUE", "FALSE"].includes(splittedMsg[3].toUpperCase())){
                                                    updateClientData(splittedMsg[0].toUpperCase(), splittedMsg[3].toUpperCase(), "tiktokstate").then(
                                                        response => logsSend(response.data)
                                                    ).catch(
                                                        error => logsError(error)
                                                    );
                                                }
                                            }
                                            break;
                                        case 'super':
                                            updateClientData(splittedMsg[0].toUpperCase(), splittedMsg[3], "super").then(
                                                response => logsSend(response.data)
                                            ).catch(
                                                error => logsError(error)
                                            );                                          
                                            break;
                                        case 'opr':
                                            updateClientData(splittedMsg[0].toUpperCase(), splittedMsg[3], "opr").then(
                                                response => logsSend(response.data)
                                            ).catch(
                                                error => logsError(error)
                                            );
                                            break;
                                        case 'clientstate':
                                            {
                                                if (["TRUE", "FALSE"].includes(splittedMsg[3].toUpperCase())){
                                                    updateClientData(splittedMsg[0].toUpperCase(), splittedMsg[3].toUpperCase(), "tiktokstate").then(
                                                        response => logsSend(response.data)
                                                    ).catch(
                                                        error => logsError(error)
                                                    );
                                                }
                                            }
                                            break;

                                        case 'insta2':
                                            {
                                                if (splittedMsg[3].includes('instagram.com')){
                                                    if (!splittedMsg[3].includes('/p/') 
                                                        || !splittedMsg[3].includes('/reels/') 
                                                            || !splittedMsg[3].includes('/video/') ){
                                                                
                                                                let instaLink;
                                                                let instaUsername;
                                                                if (splittedMsg[3].includes('/profilecard/')){
                                                                    instaLink = splittedMsg[3].split('?')[0];
                                                                    instaUsername = instaLink.replaceAll(
                                                                        '/profilecard/',
                                                                        ''
                                                                    ).split('/').pop();  
                                                                } else {
                                                                    instaLink = splittedMsg[3].replaceAll(
                                                                        '/?',
                                                                        '?'
                                                                    ).split('?')[0];
                                                                    instaUsername = instaLink.split('/').pop();  
                                                                } 
                                                    
                                                                await updateClientData(splittedMsg[0].toUpperCase(), instaUsername, "insta2").then(
                                                                    response => logsSend(response.data)
                                                                ).catch(
                                                                    error => logsError(error)
                                                                );
                            
                                                            } else {
                                                                logsSend('Bukan Link Profile Instagram');
                                                            }
                                                        } else {
                                                            logsSend('Bukan Link Profile Instagram');
                                                        }
                                            }
                                                break;

                                        case 'insta2state':
                                            {
                                                if (["TRUE", "FALSE"].includes(splittedMsg[3].toUpperCase())){
                                                    updateClientData(splittedMsg[0].toUpperCase(), splittedMsg[3].toUpperCase(), "insta2state").then(
                                                        response => logsSend(response.data)
                                                    ).catch(
                                                        error => logsError(error)
                                                    );
                                                }
                                            }
                                            break;
                                        default:
                                            break;
                                    }
                                }
                                break;
                            case 'registerclient': 
                                {
                                    registerClientData(splittedMsg[0].toUpperCase(), splittedMsg[2].toUpperCase()).then(
                                        response => logsSend(response.data)
                                    ).catch(
                                        error => logsError(error)
                                    );
                                }
                                break;
                            case 'admininfo':
                                {
                                    let responseData = await adminInfoView();

                                    logsSend(responseData.data)
                                }
                                break;
                            case 'instauname':
                                {
                                    usernameInfo(splittedMsg[0].toUpperCase(), splittedMsg[2].toLowerCase(), "INSTA").then(
                                        response => logsSend(response.data)
                                    ).catch(
                                        error => logsError(error)
                                    );

                                }
                                break;
                            case 'tiktokuname':
                                {
                                    usernameInfo(splittedMsg[0].toUpperCase(), splittedMsg[2].toLowerCase(), "TIKTOK").then(
                                        response => logsSend(response.data)
                                    ).catch(
                                        error => logsError(error)
                                    );

                                }
                                break;                            
                            case 'test':
                                saveGoogleContact("Cicero Test", "Cicero", "6281235114746").then(
                                    response => logsSave(response)
                                ).catch(
                                    error => logsError(error)
                                )
                                break;
                            case 'userinfo':
                                {
                                    await clientData()
                                    .then(
                                        async response =>{
                                            
                                            let clientRows = response.data;
                                            let i = 0;

                                            (function loop() {

                                                if (++i < clientRows.length) {

                                                    if(decrypted(clientRows[i].CLIENT_ID) === splittedMsg[0].toUpperCase()){

                                                        getInstaUserInfo(clientRows[i]).then(
                                                            response => {
                                                                logsSend(response.data)
                                                            }
                                                        ).catch(
                                                            error => logsError(error)
                                                        );
                                                    }
                            
                                                    setTimeout(loop, 3000);  
                                                } else {
                                                    console.log("Generate User Info Data Done");
                                                }
                                            })();
                                        }
                                    ).catch (
                                        error => logsError(error)
                                    );
                                }
                                break;
                            case 'alluserinfo':
                                {
                                    await clientData()
                                    .then(
                                        async response =>{
                                            
                                            let clientRows = response.data;

                                            let i = 0;

                                            (function loop() {
                                                if (++i < clientRows.length) {

                                                    getInstaUserInfo(clientRows[i]).then(
                                                        response => {
                                                            logsSend(response.data)
                                                        }
                                                    ).catch(
                                                        error => logsError(error)
                                                    );
                                                    setTimeout(loop, 3000);  
                                                }
                                            })();
                                        }
                                    ).catch (
                                        error => logsError(error)
                                    );
                                }
                                break;
                            default : 
                                break;
                        }  
                    } else {
                        client.sendMessage(msg.from, "Only Super Saint Seiya have this POWER!")
                    }
                //Operator Order Data         //On Progress
                } else if (operatorOrder.includes(splittedMsg[1].toLowerCase())){
                    await clientData().then(async response => {    
                        let clientRows = response.data;         

                        for (let i = 0; i < clientRows.length; i++){
                            if(decrypted(clientRows[i].OPERATOR) === msg.from || '6281235114745@c.us'){
                                if(decrypted(clientRows[i].CLIENT_ID) === splittedMsg[0].toUpperCase()){
                                    let responseData;
                                    switch (splittedMsg[1].toLowerCase()) {
                                        case "addnewuser"://Added New User Data Profile
                                            //clientName#addnewuser#id_key/NRP#name#divisi/satfung#jabatan#pangkat/title
                                            responseData = await addNewUser(
                                                splittedMsg[0].toUpperCase(), 
                                                splittedMsg[2], 
                                                splittedMsg[3].toUpperCase(), 
                                                splittedMsg[4].toUpperCase(), 
                                                splittedMsg[5].toUpperCase(), 
                                                splittedMsg[6].toUpperCase()
                                            ).then(
                                                response => logsUserSend(msg.from, response.data)
                                            ).catch(
                                                error => logsUserError(msg.from, error)
                                            );
                                            break;
                                        case "deleteuser"://Delete Existing Data User
                                            //clientName#deleteuser#id_key/NRP
                                            await editProfile(
                                                splittedMsg[0].toUpperCase(), 
                                                splittedMsg[2].toLowerCase(), 
                                                false, 
                                                msg.from.replace('@c.us', ''),
                                                    "STATUS"
                                                ).then(
                                                    response => logsUserSend(msg.from, response.data)
                                                ).catch(
                                                    error => logsUserError(msg.from, error)
                                                );
                                            break;
                                        case "instacheck"://Insta Username Checking Data User Not Updated
                                            //ClientName#instacheck
                                            usernameAbsensi(
                                                splittedMsg[0].toUpperCase(), 
                                                'INSTA'
                                            ).then(
                                                response => logsUserSend(msg.from, response.data)
                                            ).catch(
                                                error => logsUserError(msg.from, error)
                                            );
                                              
                                            break;
                                        case "tiktokcheck"://Tiktok Checking Data User Not Updated
                                            //ClientName#tiktokcheck
                                            usernameAbsensi(
                                                splittedMsg[0].toUpperCase(), 
                                                'TIKTOK'
                                            ).then(
                                                response => logsUserSend(msg.from, response.data)
                                            ).catch(
                                                error => logsUserError(msg.from, error)
                                            );
                                            
                                            break;
                                        case "oprinfo":
                                            responseData = await oprInfoView(splittedMsg[0].toUpperCase());
                                            logsUserSend(msg.from, responseData.data)
                                            break;
                                        default:
                                            break;
                                    }
                                }
                            }
                        }
                    }).catch(
                        error => logsError(error)
                    )
                //User Order Data         
                } else if (userOrder.includes(splittedMsg[1].toLowerCase())){   
                    await clientData().then(async response => {    
                        let clientRows = response.data;
                        clientRows.forEach(async element => {
                            if(decrypted(element.CLIENT_ID) === splittedMsg[0].toUpperCase()){
                                if (updateinsta.includes(splittedMsg[1].toLowerCase())) {
                                    logsSave("Update Instagram Username")
                                    //Update Insta Profile
                                    //CLientName#updateinsta/ig/#linkprofileinstagram
                                    if (splittedMsg[3].includes('instagram.com')){
                                        if (!splittedMsg[3].includes('/p/') 
                                         || !splittedMsg[3].includes('/reels/') 
                                          || !splittedMsg[3].includes('/video/') ){
                                            
                                            let instaLink;
                                            let instaUsername;
    
                                            if (splittedMsg[3].includes('/profilecard/')){
                                                instaLink = splittedMsg[3].split('?')[0];
                                                instaUsername = instaLink.replaceAll(
                                                    '/profilecard/',
                                                    ''
                                                ).split('/').pop();  
                                            } else {
                                                instaLink = splittedMsg[3].replaceAll(
                                                    '/?',
                                                    '?'
                                                ).split('?')[0];
                                                instaUsername = instaLink.split('/').pop();  
                                            }  
                                
                                            await updateUsername(
                                                splittedMsg[0].toUpperCase(), 
                                                splittedMsg[2], 
                                                instaUsername, 
                                                msg.from.replace('@c.us', ''), 
                                                "INSTA", 
                                                contact.isMyContact
                                            ).then(
                                                response => {
                                                    logsUserSend(msg.from, response.data);
                                                }
                                            ).catch(
                                                error => logsUserError(msg.from, error)
                                            );
                                        } else {
                                            logsUserSend(msg.from, 'Bukan Link Profile Instagram');
                                        }
                                    } else {
                                        logsUserSend(msg.from, 'Bukan Link Instagram');
                                    }

                                } else if (updatetiktok.includes(splittedMsg[1].toLowerCase())) {
                                    
                                    logsSave("Update Tiktok Username");
                                    //Update Tiktok profile
                                    //CLientName#updatetiktok/tiktok/#linkprofiletiktok
                                    if (splittedMsg[3].includes('tiktok.com')){
                                        
                                        const tiktokLink = splittedMsg[3].split('?')[0];
                                        const tiktokUsername = tiktokLink.split('/').pop();  
                                        
                                        await updateUsername(
                                            splittedMsg[0].toUpperCase(), 
                                            splittedMsg[2], 
                                            tiktokUsername, 
                                            msg.from.replace('@c.us', ''), 
                                            "TIKTOK", contact.isMyContact
                                        ).then(
                                            response => {
                                                logsUserSend(msg.from, response.data);
                                            }
                                        ).catch(
                                            error => logsUserError(msg.from, error)
                                        );
                                    } else {
                                        logsUserSend(msg.from, 'Bukan Link Profile Tiktok');
                                    }

                                } else if (updatedivisi.includes(splittedMsg[1].toLowerCase())) {
                                    logsSave("Edit Divisi");
                                    //update Divisi Name
                                    //clientName#editdivisi/satfung#id_key/NRP#newdata
                                    await editProfile(
                                        splittedMsg[0].toUpperCase(),
                                        splittedMsg[2].toLowerCase(), 
                                        splittedMsg[3].toUpperCase(), 
                                        msg.from.replace('@c.us', ''), 
                                        "DIVISI"
                                    ).then(
                                        response => {
                                            logsUserSend(msg.from, response.data);
                                        }
                                    ).catch(
                                        error => logsUserError(msg.from, error)
                                    );

                                } else if (editjabatan.includes(splittedMsg[1].toLowerCase())) {
                                    logsSave("Edit Jabatan");
                                    //Update Jabatan
                                    //clientName#editjabatan/jabatan#id_key/NRP#newdata
                                    await editProfile(
                                        splittedMsg[0].toUpperCase(),
                                        splittedMsg[2].toLowerCase(), 
                                        splittedMsg[3].toUpperCase(), 
                                        msg.from.replace('@c.us', ''), 
                                        "JABATAN", contact.isMyContact
                                    ).then(
                                            response => {
                                                logsUserSend(msg.from, response.data);
                                            }
                                        ).catch(
                                            error => logsUserError(msg.from, error)
                                        );

                                } else if (editnama.includes(splittedMsg[1].toLowerCase())) {
                                    logsSave("Edit Nama");
                                    //clientName#editnama/nama#id_key/NRP#newdata
                                    await editProfile(
                                        splittedMsg[0].toUpperCase(),
                                        splittedMsg[2].toLowerCase(), 
                                        splittedMsg[3].toUpperCase(), 
                                        msg.from.replace('@c.us', ''), 
                                        "NAMA", contact.isMyContact
                                    ).then(
                                        response => {
                                            logsUserSend(msg.from, response.data);
                                        }
                                    ).catch(
                                        error => logsUserError(msg.from, error)
                                    );  

                                } else if (edittitle.includes(splittedMsg[1].toLowerCase())) {
                                    logsSave("Edit Title");
                                    //clientName#editnama/nama#id_key/NRP#newdata
                                    await editProfile(
                                        splittedMsg[0].toUpperCase(),
                                        splittedMsg[2].toLowerCase(), 
                                        splittedMsg[3].toUpperCase(), 
                                        msg.from.replace('@c.us', ''), 
                                        "TITLE", contact.isMyContact
                                    ).then(
                                            response => {
                                                logsUserSend(msg.from, response.data);
                                            }
                                        ).catch(
                                            error => logsUserError(msg.from, error)
                                        );

                                } else if (splittedMsg[1].toLowerCase() === 'mydata') {
                                    logsSave("My Data");
                                    await myData(
                                        splittedMsg[0].toUpperCase(), 
                                        splittedMsg[2]
                                    ).then( 
                                        response => logsUserSend(msg.from, response.data)
                                    ).catch(
                                        error => logsUserError(msg.from, error)
                                    )

                                } else if (splittedMsg[1].toLowerCase() === 'whatsapp') {
                                    logsSave("Update Whatsapp");
                                    await editProfile(
                                        splittedMsg[0].toUpperCase(),
                                        splittedMsg[2].toLowerCase(), 
                                        msg.from.replace('@c.us', ''), 
                                        msg.from.replace('@c.us', ''), 
                                        "WHATSAPPP", contact.isMyContact
                                    ).then(
                                        response => {
                                            logsUserSend(msg.from, response.data);
                                        }
                                    ).catch(
                                        error => logsUserError(msg.from, error)
                                    );
                                    
                                } 
                            }
                        });
                    });

                //Divisi & Title List Data
                } else if (infoOrder.includes(splittedMsg[1].toLowerCase())){    
                    await clientData().then( 
                        async response => {  
                            let clientRows = response.data;  
                            clientRows.forEach(async element => {
                                if(decrypted(element.CLIENT_ID) === splittedMsg[0].toUpperCase()){
                                    let responseData;
                                    switch (splittedMsg[1].toLowerCase()) {
                                        case 'info'://Order Info Request

                                            {
                                                if (process.env.APP_CLIENT_TYPE === "RES"){
                                                    responseData = await infoResView(splittedMsg[0].toUpperCase());
                                                    logsUserSend(msg.from, responseData.data)
                                                } else {
                                                    responseData = await infoComView(splittedMsg[0].toUpperCase());
                                                    logsUserSend(msg.from, responseData.data)
                                                }
                                            }
                                            break;
                                        
                                        case 'divisilist'://Divisi List Request        
                                                        
                                            await propertiesView(
                                                splittedMsg[0].toUpperCase(), 
                                                "DIVISI"
                                            ).then(
                                                logsUserSend(msg.from, responseData.data)
                                            ).catch(
                                                error => logsUserError(msg.from, error)
                                            );
                                            break;
                                        case 'titlelist'://Title List Request
                                            await propertiesView(
                                                splittedMsg[0].toUpperCase(), 
                                                "TITLE"
                                            ).then(
                                                logsUserSend(msg.from, responseData.data)
                                            ).catch(
                                                error => logsUserError(msg.from, error)
                                            );
                                            break;
                                        default:
                                            break;
                                    }
                                } 
                            });
                        }
                    );
                //Wifi Corner For Company
                } else if (generateSocmed.includes(splittedMsg[1].toLowerCase())){   
                    if(msg.from === '6281235114745@c.us'){
                        switch (splittedMsg[1].toLowerCase()) {
                            case 'allsocmed'://Generate & Report All Socmed Data - Content, Likes, Comment
                                if(splittedMsg[2].toLowerCase() === 'report'){
                                    await schedullerAllSocmed("report");
                                } else {
                                    await schedullerAllSocmed("routine");
                                }
                                break;

                            case 'alltiktok'://Generate & Report All Tiktok Data - Contents & Comments 
                                logsSave("Execute New All Tiktok");

                                await clientData().then( 
                                    async response =>{

                                        let clientRows = response.data;

                                        let i = 0;

                                        (function loop() {
                                            if (++i < clientRows.length) {
                                                if (decrypted(clientRows[i].STATUS) === "TRUE" 
                                                    && decrypted(clientRows[i].TIKTOK_STATE) === "TRUE" 
                                                        && decrypted(clientRows[i].TYPE) === process.env.APP_CLIENT_TYPE) {
                                                            
                                                            logsSave(decrypted(clientRows[i].CLIENT_ID)+' START LOAD TIKTOK DATA');
                                                            client.sendMessage(
                                                                '6281235114745@c.us', 
                                                                decrypted(clientRows[i].CLIENT_ID)+' START LOAD TIKTOK DATA');
                                                            
                                                            getTiktokPost(
                                                                clientRows[i]
                                                            ).then(
                                                                data => {
                                                                    tiktokItemsBridges(
                                                                        clientRows[i], 
                                                                        data.data
                                                                    ).then(
                                                                        data =>{
                                                                            client.sendMessage(
                                                                                msg.from, 
                                                                                data.data
                                                                            );
                                                                            logsSave("Success Report Data");
                                                                        }
                                                                    ).catch(
                                                                        data => logsSave(data)
                                                                    );
                                                                }
                                                            ).catch(
                                                                data => {
                                                                    switch (data.code) {
                                                                        case 303:
                                                                            logsSave(data.data);
                                                                            client.sendMessage(
                                                                                '6281235114745@c.us', 
                                                                                decrypted(clientRows[i].CLIENT_ID)+' ERROR GET TIKTOK POST'
                                                                            );
                                                                            break;
                                                                        default:
                                                                            client.sendMessage(
                                                                                '6281235114745@c.us', 
                                                                                decrypted(clientRows[i].CLIENT_ID)+' '+data.data
                                                                            );
                                                                            break;
                                                                    }
                                                                }
                                                            );   
                                                        }  

                                                        setTimeout(loop, 3000);  
                                                    }
                                                }
                                        );

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
                                logsSave("Execute New Report Tiktok ")
                                await clientData().then( 
                                    async response =>{
                                        let clientRows = await response.data;
                                        let i = 0;
                                        (async function loop() {                        
                                            if (++i < clientRows.length) {
                                                if (decrypted(clientRows[i].STATUS) === "TRUE" 
                                                    && decrypted(clientRows[i].TIKTOK_STATE) === "TRUE" 
                                                        && decrypted(clientRows[i].TYPE) === process.env.APP_CLIENT_TYPE) {
                                                            logsSave(decrypted(clientRows[i].CLIENT_ID)+' START REPORT TIKTOK DATA');
                                        
                                                            await newReportTiktok(
                                                                clientRows[i]
                                                            ).then(
                                                                response => logsSend(response.data)
                                                            ).catch( error => logsError (error));
                                                        }  
                                                setTimeout(loop, 3000);  
                                            } else {
                                                console.log("Generate Tiktok Done");
                                            }
                                        })();
                                }). catch (
                                    error => logsError(error)
                                )
                                break;

                            case 'allinsta': //Generate & Report All Insta Data
                                logsSave("Execute New All Insta ")
                                clientData().then( 
                                    async response =>{
                                        let clientRows = await response.data;
                                        let i = 0;
                                        (async function loop() {
                                            if (++i < clientRows.length) {
                                                if (decrypted(clientRows[i].STATUS) === "TRUE" 
                                                && decrypted(clientRows[i].INSTA_STATE) === "TRUE" 
                                                && decrypted(clientRows[i].TYPE) === process.env.APP_CLIENT_TYPE) {
                                                    logsSave(decrypted(clientRows[i].CLIENT_ID)+' START LOAD INSTA DATA');
                                                    client.sendMessage(
                                                        '6281235114745@c.us', 
                                                        decrypted(clientRows[i].CLIENT_ID)+' START LOAD INSTA DATA'
                                                    );

                                                    await getInstaPost(
                                                        clientRows[i], "official"
                                                    ).then(
                                                        async response =>{
                                                            
                                                            let instaPostData = response.data;
                                                            
                                                            logsSave(instaPostData);
                                                            
                                                            await getInstaLikes(
                                                                instaPostData, 
                                                                clientRows[i]
                                                            ).then(
                                                                async instaLikesData =>{

                                                                    logsSave(instaLikesData.data);
                                                                    
                                                                    await client.sendMessage(
                                                                        msg.from, 
                                                                        instaLikesData.data
                                                                    );

                                                                    await newReportInsta(clientRows[i], instaPostData, "official").then(
                                                                        async data => {
                                                                            logsSave("Report Success!!!");
                                                                            await client.sendMessage(
                                                                                msg.from, 
                                                                                data.data
                                                                            );
                                                                    }).catch(                
                                                                        error => logsError(error)
                                                                    );
                                                                }
                                                            ).catch(
                                                                error => logsError(error)
                                                            ); 
                                                        }
                                                    ).catch(
                                                        error => logsError(error)

                                                    );   
                                                } 

                                                setTimeout(loop, 3000);  
                                            } else {
                                                console.log("Generate All Socmed Done");
                                            }
                                        })();

                                }). catch (
                                    error => logsError(error)
                                )  
                                break;

                            case 'reportinsta'://Report Insta Data
                                logsSave("Execute New Report Insta ")
                                await clientData().then( 
                                    async response =>{

                                        let clientRows = response.data;

                                        let i = 0;
                                        
                                        (async function loop() {

                                            if (++i < clientRows.length) {

                                                if (decrypted(clientRows[i].STATUS) === "TRUE" 
                                                   && decrypted(clientRows[i].INSTA_STATE) === "TRUE" 
                                                        && decrypted(clientRows[i].TYPE) === process.env.APP_CLIENT_TYPE) {
                                                            logsSave(decrypted(clientRows[i].CLIENT_ID)+' START REPORT INSTA DATA');
                                                            await newReportInsta(
                                                                clientRows[i], instaPostData, "official"                                                               
                                                                ).then(
                                                                async response => {
                                                                    logsSave(response.data)
                                                                    await client.sendMessage(
                                                                        msg.from, 
                                                                        response.data
                                                                    );
                                                            }).catch(                
                                                                async error => { logsError(error)  
                                                            });
                                                        }  
                                                setTimeout(loop, 3000);  
                                            } else {
                                                console.log("Generate All Socmed Done");
                                            }
                                        })();
                                    
                                }). catch (
                                    async error => {logsError(error);}
                                );
                                break;

                            case 'instainfo'://Collect Insta Info
                                await clientData().then(
                                    async response =>{

                                        let clientRows = response.data;

                                        let i = 0;
                                        
                                        (async function loop() {

                                            if (++i < clientRows.length) {

                                                if (decrypted(clientRows[i].STATUS) === "TRUE" 
                                                    && decrypted(clientRows[i].INSTA_STATE) === "TRUE" 
                                                        && decrypted(clientRows[i].TYPE) === process.env.APP_CLIENT_TYPE) {
                                                            await instaClientInfo(
                                                                decrypted(clientRows[i].CLIENT_ID), 
                                                                decrypted(clientRows[i].INSTAGRAM)
                                                            ).then(
                                                                async response =>{
                                                                    logsSave(response.data);
                                                                    client.sendMessage(
                                                                        msg.from, 
                                                                        `${decrypted(clientRows[i].CLIENT_ID)} ${response.data}`
                                                                    );
                                                                }
                                                            ).catch(
                                                                async error =>{
                                                                    console.error(error);
                                                                    client.sendMessage(
                                                                        msg.from, 
                                                                        `${decrypted(clientRows[i].CLIENT_ID)} Collect Insta Info Error`
                                                                    );
                                                                }
                                                            );
                                                        }

                                                setTimeout(loop, 3000);  
                                            } else {
                                                console.log("Generate All Socmed Done");
                                            }
                                        })();

                                    }
                                );
                                
                                break;

                            case 'officialfollowers'://Collect Insta Followers
                                logsSave("Execute Insta Followers");            
                                let arrayData = [];
                                let countData = 0;    
                                await clientData().then(
                                    async response =>{
                                        let clientRows = response.data;

                                        let i = 0;
                                        
                                        (async function loop() {

                                            if (++i < clientRows.length) {

                                                let pages = "";
                                                if (decrypted(clientRows[i].STATUS) === "TRUE" 
                                                    && decrypted(clientRows[i].INSTA_STATE) === "TRUE" 
                                                        && decrypted(clientRows[i].TYPE) === process.env.APP_CLIENT_TYPE) {
                                                            await instaClientInfo(
                                                                decrypted(clientRows[i].CLIENT_ID), 
                                                                decrypted(clientRows[i].INSTAGRAM)
                                                            ). then (
                                                                async response =>{
                                                                    logsSave(response);
                                                                    await instaOffcialFollower(
                                                                        decrypted(clientRows[i].CLIENT_ID), 
                                                                        decrypted(clientRows[i].INSTAGRAM), 
                                                                        pages, 
                                                                        arrayData, 
                                                                        countData, 
                                                                        response.data
                                                                    ).then(
                                                                        async response => {
                                                                            logsSave(response.data);
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

                                                setTimeout(loop, 3000);  
                                            } else {
                                                console.log("Generate All Socmed Done");
                                            }
                                        })();
                                    }
                                );
                                    break;    
                            default:
                                break;                    
                        }
                    }
                //Restore Encrypted Data
                } else if (dataRestore.includes(splittedMsg[1].toLowerCase())){
                    if (msg.from === '6281235114745@c.us') {
                        switch (splittedMsg[1].toLowerCase()){

                            case "restoreclientdata"://Restore Client Data
                                restoreClientData();
                                break;

                            case "restoreuserdata"://Restore User Data Base
                                clientData().then(
                                    async response =>{
                                        let clientRows = response.data;
                                        clientRows.forEach(element => {
                                            restoreUserData(decrypted(element.CLIENT_ID))
                                            .then(
                                                response => {
                                                    logsSend(response.data);
                                                }
                                            ).catch (
                                                error => logsError(error)
                                            ); 
                                        });
                                    }
                                ).catch (
                                    error => logsError(error)
                                )
                                break;

                            case "restoreinstacontent"://Restore Insta Content Data
                                clientData().then(
                                    async response =>{
                                        let clientRows = response.data;
                                        clientRows.forEach(element => {
                                            restoreInstaContent(decrypted(element.CLIENT_ID))
                                            .then(
                                                response => {
                                                    logsSend(response.data);
                                                }
                                            ).catch (
                                                error => logsError(error)
                                            );
                                        });
                                    }
                                )
                                break;

                            case "restoreinstalikes"://Restore Insta Likes Username Data
                                clientData().then(
                                    async response =>{
                                        let clientRows = response.data;
                                        clientRows.forEach(element => {
                                            restoreInstaLikes(decrypted(element.CLIENT_ID))
                                            .then(
                                                response => {
                                                    logsSend(response.data);
                                                }
                                            ).catch (
                                                error => logsError(error)
                                            );
                                        });
                                    }
                                )
                                break;

                            case "restoretiktokcontent"://Restore Tiktok Contents
                                clientData().then(
                                    async response =>{
                                        let clientRows = response.data;

                                        clientRows.forEach(element => {
                                            restoreTiktokContent(decrypted(element.CLIENT_ID))
                                            .then(
                                                response => {
                                                    logsSend(response.data);
                                                }
                                            ).catch (
                                                error => logsError(error)
                                            );
                                        });
                                    }
                                )
                                break;

                            case "restoretiktokcomments"://Restore Tiktok Comments Username Data
                                clientData().then(
                                    async response =>{
                                        let clientRows = response.data;
                                        clientRows.forEach(element => {
                                            restoreTiktokComments(decrypted(element.CLIENT_ID))
                                            .then(
                                                response => {
                                                    logsSend(response.error);
                                                }
                                            ).catch (
                                                error => logsError(error)
                                            );
                                        });
                                    }
                                )
                                break;
                            default:
                                break;
                        }
                    }   
                //Backup Encrypted Data
                } else if (dataBackup.includes(splittedMsg[1].toLowerCase())){
                    switch (splittedMsg[1].toLowerCase()){

                        case "backupclientdata"://Backup Encrypted Client Data
                            clientDataBackup().then(
                                response => logsSend(response.data)
                            ).catch (
                                error => logsError(error)
                            );
                            break;

                        case "backupuserdata"://Backup Encrypted User Data
                            userDataBackup().then(
                                response => logsSend(response.data)
                            ).catch (
                                error => logsError(error)
                            );
                            break;
                            
                        case "backupinstacontent"://Backup Encrypted Insta Content Data
                            await clientData().then(
                                async response =>{
                                    let clientRows = response.data;
                                    clientRows.forEach(async element => {
                                        await instaContentBackup(element).then(
                                            response => logsSend(response.data)
                                        );
                                    });
                                }
                            ).catch (
                                error => console.error(error)
                            );

                            break;

                        case "backuptiktokcontent"://Backup Encrypted Tiktok Content Data
                            await clientData().then(
                                async response =>{
                                    let clientRows = response.data;
                                    clientRows.forEach(async element => {
                                        await tiktokContentBackup(element).then(
                                            response => logsSend(response.data)
                                        ).catch(
                                            error => logsError(error)
                                        );
                                    });
                                }
                            );

                            break;

                        case "backupinstalikes"://Backup Encrypted Insta Likes Username Data
                            await clientData().then(
                                async response =>{
                                    let clientRows = response.data;
                                    clientRows.forEach(async element => {
                                        await instaLikesBackup(element).then(
                                            response => logsSend(response.data)
                                        ).catch(
                                            error => logsError(error)
                                        );
                                    });
                                }
                            );
                            break;

                        case "backuptiktokcomments"://Backup Encrypted Tiktok Comments Username Data
                            await clientData().then(
                                async response =>{
                                    let clientRows = response.data;
                                    clientRows.forEach(async element => {
                                        await tiktokCommentsBackup(element).then(
                                            response => logsSend(response.data)
                                        ).catch(
                                            error => logsError(error)
                                        );
                                    });
                                }
                            ).catch (
                                error => logsError(error)
                            );

                            break;
                                 
                        default:
                            break;
                    }
                } else if ( dataManagement.includes(splittedMsg[1].toLowerCase())){
                    if (msg.from === '6281235114745@c.us') {
                        switch (splittedMsg[1].toLowerCase()) {
                            case "clientdataview":{
                                await clientData()
                                .then(
                                    async response =>{
                                        
                                        let clientRows = response.data;

                                        clientRows.forEach(async element => {
                                            await clientDataView(element).then(
                                                response => {
                                                    logsSend(response.data)
                                                }
                                            ).catch(
                                                error => logsError(error)
                                            );
                                        });
                                    }
                                ).catch (
                                    error => logsError(error)
                                );
                            }
                                
                                break;

                            case "instavis":{
                                await clientData()
                                .then(
                                    async response =>{
                                        
                                        let clientRows = response.data;
                                        
                                        clientRows.forEach(async element => {
                                            
                                            if(decrypted(element.STATUS) ==="TRUE"){
                                                await instaVisData(element).then(
                                                    response => {
                                                        logsSend(response.data)
                                                    }
                                                ).catch(
                                                    error => logsError(error)
                                                );                                                
                                            }

                                        });
                                    }
                                ).catch (
                                    error => logsError(error)
                                );
                            }
                                
                                break;
                                
                        
                            default:
                                break;
                        }
                    }   
                } else {//Key Order Data Not Exist         

                    await clientData().then(
                        async response => {
                            
                            let clientRows = response.data;
                            
                            clientRows.forEach(async element => {


                                if(decrypted(element.CLIENT_ID) === splittedMsg[0].toUpperCase()){
                                    logsSave("Request Code Doesn't Exist");
                                    if (process.env.APP_CLIENT_TYPE === "RES"){
                                        let responseData = await infoResView(splittedMsg[0].toUpperCase());
                                        logsUserSend(msg.from, responseData.data)
                                    } else {
                                        let responseData = await infoComView(splittedMsg[0].toUpperCase());
                                        logsUserSend(msg.from, responseData.data)
                                    }
                                }
                                
                            });
                        }
                    ).catch (
                        error => logsError(error)
                    )
                }
            //if(splittedMsg[1].toLowerCase()......
            } else {
                const chatMsg = await msg.getChat(); //this catch message data
                chatMsg.sendSeen(); //this send seen by bot whatsapp
                chatMsg.sendStateTyping(); //this create bot typing state 
//                 if (chatMsg.isGroup){
//                     logsSave("Group Messages");
//                 } else if (msg.isGif){
//                     logsSave("Gif Recieved");
//                 } else if(msg.type === 'sticker'){
//                     logsSave("Sticker Recieved");
//                 } else {
                        
//                     logsUserSend(msg.from, 
// `Maaf, Saya adalah Bot Engine untuk transaksi data Cicero Management System,

// Saya hanya merespons sesuai format pesan yang sudah ditentukan, 

// Silahkan hubungi Operator yang ditunjuk untuk pertanyaan maupun tutorial.`);

//                 }
               
            } // if(splittedMsg.length....
        } //if(msg.status....
    } catch (error) { //Catching the Error Request
        logsSend(error, "Main Apps");
    }
});