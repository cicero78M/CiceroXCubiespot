const express = require('express');
const app = express();

var dataBase = require('./src/database/database');
var query = require('./src/database/myData');
var checkData = require('./src/database/checkData');
var instaReload = require('./src/scrapper/insta');

const { Client , LocalAuth } = require('whatsapp-web.js');
const figlet = require('figlet');
const banner = require('simple-banner');
const qrcode = require('qrcode-terminal');

const port = 3007;
const databaseID = '1gwXv8rHNgX16qbDqht_OPh0pbQI5jl1WjWZz3yrcSf8';
const clientDataID = '1TMj77bl9jPBD8BsgMxjuXTk4DbWK5eguj10HQoeFVNQ';
const instaOfficialID = '1tOIM23YZK1ts7t0EeVCseWXSGobp56-hAV8L0sRvV2g';
const instaLikesUsernameID = '1OAZ3ZPfY8sYtyT0n-5WJP-O3cIJHShBU-KuWJVDBDR8';

app.listen(port, () => {
    console.log(`Cicero System Start listening on port >>> ${port}`)
});

const client = new Client({
    authStrategy: new LocalAuth({
        clientId: "Client_Name",
    }),
});

//initialize 
client.initialize();

client.on('authenthicated', (session)=>{

    console.log(session);
});

client.on('auth_failure', msg => {
    // Fired if session restore was unsuccessful
    console.error('AUTHENTICATION FAILURE', msg);
});

client.on('ready', () => {

    console.log(figlet.textSync("CICERO -X- CUBIES", {
        font: "Ghost",
        horizontalLayout: "fitted",
        verticalLayout: "default",
        width: 240,
        whitespaceBreak: true,
    }));

    banner.set("Cicero System Manajemen As A Services");
    console.log('===============================');
    console.log('===============================');
    console.log('======System Fully Loaded!=====');
    console.log('=========Enjoy the Ride========');
    console.log('===We\'ll Take Care Everything==');
    console.log('===============================');
    console.log('===============================');
});

client.on('qr', qr => {
    //Pairing WA Center
    qrcode.generate(qr, {small: true});
});

client.on('message', async (msg) => {

    const newClientOrder = ['newclientorg', 'newclientcom'];
    const updateUserData = ['adduser', 'editnama', 'editdivisi', 'editjabatan', 'updateinsta', 'updatetiktok'];
    const dataOrder = ['instacheck', 'tiktokcheck'];
    const reloadOrder = ['instareload', 'tiktokreload', 'storyreload'];
    const reportOrder = ['instareport', 'tiktokreport', 'storyreport'];

    try {
        if (msg.isStatus){
            //If Msg is WA Story
            console.log(msg.body);
        } else {
            //Splitted Msg
            const splittedMsg = msg.body.split("#");
            if(splittedMsg.length > 1){
                console.log(msg.from);
                if(newClientOrder.includes(splittedMsg[1].toLowerCase())){
                //Admin Order
                    if(splittedMsg[2].includes('https://docs.google.com/spreadsheets/d/')){
                        //Is contains Links
                        if (splittedMsg[1].toLowerCase() === "newclientorg"){
                            //If Request for New Client by Organizations
                            try {
                            //Organizations Request
                                let response = await dataBase.newClientOrg(splittedMsg[0].toUpperCase(), splittedMsg[2], databaseID);
                                client.sendMessage(msg.from, response);
                            } catch (error) {
                                console.log(error);
                            }                    
                        }  else if (splittedMsg[1].toLowerCase() === "newclientcom"){
                            //If Request for New Client by Company
                            try {
                            //Company Request
                                let response = await dataBase.newClientCom(splittedMsg[0].toUpperCase(), splittedMsg[2], databaseID);
                                client.sendMessage(msg.from, response);
                            } catch (error) {
                                console.log(error);
                            }                                         
                        }
                    } else {
                        console.log('Bukan Spreadsheet Links');
                    }                
                } else if (updateUserData.includes(splittedMsg[1].toLowerCase())){
                    //User Update Data
                    if (splittedMsg[1].toLowerCase() === 'adduser'){ 
                        //Check Between Corporate And Organizations
                        if(splittedMsg.length > 6){                   
                            let response = await dataBase.addUser(splittedMsg[0].toUpperCase(), splittedMsg[2], splittedMsg[3].toUpperCase(), splittedMsg[4].toUpperCase(), splittedMsg[5].toUpperCase(), splittedMsg[6].toUpperCase(), databaseID);
                            client.sendMessage(msg.from, response);
                        } else {
                            let response = await dataBase.addUser(splittedMsg[0].toUpperCase(), splittedMsg[2], splittedMsg[3].toUpperCase(), splittedMsg[4].toUpperCase(), splittedMsg[5].toUpperCase(), null, databaseID);
                            client.sendMessage(msg.from, response);
                        }
                    } else if(splittedMsg[1].toLowerCase() === 'editdivisi') {
                        //update Divisi Name
                        let response = await dataBase.editDivisi(splittedMsg[0].toUpperCase(), splittedMsg[2], splittedMsg[3].toUpperCase(), msg.from.replace('@c.us', ''), databaseID);
                        client.sendMessage(msg.from, response);
                    } else if(splittedMsg[1].toLowerCase() === 'editjabatan') {
                        //Update Jabatan
                        let response = await dataBase.editJabatan(splittedMsg[0].toUpperCase(), splittedMsg[2], splittedMsg[3].toUpperCase(), msg.from.replace('@c.us', ''), databaseID);
                        client.sendMessage(msg.from, response);
                    } else if(splittedMsg[1].toLowerCase() === 'editnama') {
                        //Update Nama
                        let response = await dataBase.editNama(splittedMsg[0].toUpperCase(), splittedMsg[2], splittedMsg[3].toUpperCase(), msg.from.replace('@c.us', ''), databaseID);
                        client.sendMessage(msg.from, response);
                    } else if(splittedMsg[1].toLowerCase() === 'updateinsta') {
                        //Update Insta Profile
                        if (splittedMsg[3].includes('instagram.com')){
                            if (!splittedMsg[3].includes('/p/') || !splittedMsg[3].includes('/reels/') || !splittedMsg[3].includes('/video/') ){
                                let response = await dataBase.updateInsta(splittedMsg[0].toUpperCase(), splittedMsg[2], splittedMsg[3], msg.from.replace('@c.us', ''), databaseID);
                                client.sendMessage(msg.from, response);
                            } else {
                                client.sendMessage(msg.from, 'Bukan Link Profile Instagram');
                            }
                        } else {
                            client.sendMessage(msg.from, 'Bukan Link Profile Instagram');
                        }
                    } else if(splittedMsg[1].toLowerCase() === 'updatetiktok') {
                        //Update Tiktok profile
                        if (splittedMsg[3].includes('tiktok.com')){                    
                            let response = await dataBase.updateTiktok(splittedMsg[0].toUpperCase(), splittedMsg[2], splittedMsg[3],msg.from.replace('@c.us', ''), databaseID);
                            client.sendMessage(msg.from, response);
                        } else {
                            client.sendMessage(msg.from, 'Bukan Link Profile Tiktok');
                        }
                    }
                } else if(dataOrder.includes(splittedMsg[1].toLowerCase())){
                    if(splittedMsg[1].toLowerCase() === 'instacheck') {
                        //Checking If User hasn't update Insta Profile
                        let response = await checkData.instaCheck(splittedMsg[0].toUpperCase(), databaseID);
                        client.sendMessage(msg.from, response);
                    } else if(splittedMsg[1].toLowerCase() === 'tiktokcheck') {
                        //Checking If User hasn't update Tiktok Profile
                        let response = await checkData.tiktokCheck(splittedMsg[0].toUpperCase(), databaseID);
                        client.sendMessage(msg.from, response);
                    }
                } else if(reloadOrder.includes(splittedMsg[1].toLowerCase())){
                    if(splittedMsg[1].toLowerCase() === 'instareload') {
                        //Reload Likes from Insta Official
                        let response = await instaReload.reloadInstaLikes(splittedMsg[0].toUpperCase(), databaseID, clientDataID, instaOfficialID, instaLikesUsernameID);
                        client.sendMessage(msg.from, response);                      

                    } else if(splittedMsg[1].toLowerCase() === 'tiktokreload') {
                        //Reload Likes from Tiktok Official
                    
                    }
                } else if(reportOrder.includes(splittedMsg[1].toLowerCase())){
                    if(splittedMsg[1].toLowerCase() === 'reportinsta') {
                        //Report Likes from Insta Official
                        
                    } else if(splittedMsg[1].toLowerCase() === 'reporttiktok') {
                        //Report Likes from Tiktok Official
                    
                    }
                } else if(splittedMsg[1].toLowerCase() === 'mydata'){
                    //User Checking myData
                    let response = await query.myData(splittedMsg[0].toUpperCase(), splittedMsg[2], databaseID);
                    client.sendMessage(msg.from, response);
                } else if(splittedMsg[1].toLowerCase() === 'addclient'){
                    //User Checking myData
                    if (!splittedMsg[2].includes('/p/') || !splittedMsg[2].includes('/reels/') || !splittedMsg[2].includes('/video/') && splittedMsg[2].includes('instagram.com') && !splittedMsg[4].includes('twitter.com')){
                        let response = await dataBase.addClient(splittedMsg[0].toUpperCase(), splittedMsg[2], splittedMsg[3], clientDataID);
                        client.sendMessage(msg.from, response);
                    }
                } else if(splittedMsg[1].toLowerCase() === 'clientstate'){
                    //User Checking myData
                    let response = await dataBase.setClientState(splittedMsg[0].toUpperCase(), splittedMsg[2], clientDataID);
                    client.sendMessage(msg.from, response);
                }             
            } else {
                //Regular Messages
                console.log('Reqular Messages');
            }
        }
    } catch (error) {
        console.log(error);
    }
});