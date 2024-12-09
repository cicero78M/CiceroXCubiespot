const fs = require('fs');
const express = require('express');
const app = express();

const dbKey = JSON.parse (fs.readFileSync('dbKey.json'));

var dataBase = require('./src/database/database');
var query = require('./src/database/myData');
var checkData = require('./src/database/checkData');
var instaReload = require('./src/scrapper/instalikesreload');
var instaReport = require('./src/reporting/instalikesreport');

const { Client , LocalAuth } = require('whatsapp-web.js');
const figlet = require('figlet');
const banner = require('simple-banner');
const qrcode = require('qrcode-terminal');

const port = 3007;
const userDataBase = dbKey.databaseID;;
const clientDataBase = dbKey.clientDataID;
const instaOfficialDataBase = dbKey.instaOfficialID;
const instaLikesUsernameDataBase = dbKey.instaLikesUsernameID;

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
//Check if autenticated
client.on('authenthicated', (session)=>{
    console.log(session);
});

client.on('auth_failure', msg => {
    // Fired if session restore was unsuccessful
    console.error('AUTHENTICATION FAILURE', msg);
});

client.on('ready', () => {

    console.log(figlet.textSync("CICERO -X- CUBIE", {
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

    const newClientOrder = ['newclientorg', 'newclientcom' ];
    const updateUserData = ['adduser', 'editnama', 'editdivisi', 'editjabatan', 'updateinsta', 'updatetiktok'];
    const dataOrder = ['mydata','instacheck', 'tiktokcheck', 'clientstate', 'addclient', 'addheader' ];
    const reloadOrder = ['reloadinstalikes', 'reloadtiktoklikes', 'reloadstorysharing'];
    const reportOrder = ['reportinstalikes', 'reporttiktoklikes', 'reportstorysharing'];

    try {
        if (msg.isStatus){
            //If Msg is WA Story
            console.log(msg.body);
        } else {
            //Splitted Msg
            const splittedMsg = msg.body.split("#");
            if(splittedMsg.length > 1){
                console.log(msg.from+' ==> '+splittedMsg[1].toLowerCase());

                if(splittedMsg[1].toLowerCase() === 'addclient'){
                    //User Checking myData
                    console.log('exec');
                    if (!splittedMsg[3].includes('/p/') || !splittedMsg[3].includes('/reels/') || !splittedMsg[3].includes('/video/') && splittedMsg[3].includes('instagram.com') && !splittedMsg[4].includes('tiktok.com')){
                        console.log('Trying')
                        let response = await dataBase.addClient(splittedMsg[0].toUpperCase(), splittedMsg[2].toUpperCase(), splittedMsg[3], splittedMsg[4], 
                        clientDataBase, instaOfficialDataBase, instaLikesUsernameDataBase);
                        client.sendMessage(msg.from, response);
                    }
                } else if(newClientOrder.includes(splittedMsg[1].toLowerCase())){
                //Admin Order
                    if(splittedMsg[2].includes('https://docs.google.com/spreadsheets/d/')){
                        //Is contains Links
                        if (splittedMsg[1].toLowerCase() === "newclientorg"){
                            //If Request for New Client by Organizations
                            try {
                            //Organizations Request
                                let response = await dataBase.newClientOrg(splittedMsg[0].toUpperCase(), splittedMsg[2], userDataBase);
                                client.sendMessage(msg.from, response);
                            } catch (error) {
                                console.log(error);
                            }                    
                        }  else if (splittedMsg[1].toLowerCase() === "newclientcom"){
                            //If Request for New Client by Company
                            try {
                            //Company Request
                                let response = await dataBase.newClientCom(splittedMsg[0].toUpperCase(), splittedMsg[2], userDataBase);
                                client.sendMessage(msg.from, response);
                            } catch (error) {
                                console.log(error);
                            }                                         
                        }
                    } else {
                        console.log('Bukan Spreadsheet Links');
                    }       
                //Update Data         
                } else if (updateUserData.includes(splittedMsg[1].toLowerCase())){
                    //User Update Data
                    if (splittedMsg[1].toLowerCase() === 'adduser'){ 
                        //Check Between Corporate And Organizations
                        if(splittedMsg.length > 6){                   
                            let response = await dataBase.addUser(splittedMsg[0].toUpperCase(), splittedMsg[2], splittedMsg[3].toUpperCase(), 
                            splittedMsg[4].toUpperCase(), splittedMsg[5].toUpperCase(), splittedMsg[6].toUpperCase(), userDataBase);
                            client.sendMessage(msg.from, response);
                        } else {
                            let response = await dataBase.addUser(splittedMsg[0].toUpperCase(), splittedMsg[2], splittedMsg[3].toUpperCase(), 
                            splittedMsg[4].toUpperCase(), splittedMsg[5].toUpperCase(), null, userDataBase);
                            client.sendMessage(msg.from, response);
                        }
                    } else if(splittedMsg[1].toLowerCase() === 'editdivisi') {
                        //update Divisi Name
                        let response = await dataBase.editDivisi(splittedMsg[0].toUpperCase(), splittedMsg[2], splittedMsg[3].toUpperCase(), 
                        msg.from.replace('@c.us', ''), userDataBase);
                        client.sendMessage(msg.from, response);
                    } else if(splittedMsg[1].toLowerCase() === 'editjabatan') {
                        //Update Jabatan
                        let response = await dataBase.editJabatan(splittedMsg[0].toUpperCase(), splittedMsg[2], splittedMsg[3].toUpperCase(), 
                        msg.from.replace('@c.us', ''), userDataBase);
                        client.sendMessage(msg.from, response);
                    } else if(splittedMsg[1].toLowerCase() === 'editnama') {
                        //Update Nama
                        let response = await dataBase.editNama(splittedMsg[0].toUpperCase(), splittedMsg[2], splittedMsg[3].toUpperCase(), 
                        msg.from.replace('@c.us', ''), userDataBase);
                        client.sendMessage(msg.from, response);
                    } else if(splittedMsg[1].toLowerCase() === 'updateinsta') {
                        //Update Insta Profile
                        if (splittedMsg[3].includes('instagram.com')){
                            if (!splittedMsg[3].includes('/p/') || !splittedMsg[3].includes('/reels/') || !splittedMsg[3].includes('/video/') ){
                                let response = await dataBase.updateInsta(splittedMsg[0].toUpperCase(), splittedMsg[2], splittedMsg[3], 
                                msg.from.replace('@c.us', ''), userDataBase);
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
                            let response = await dataBase.updateTiktok(splittedMsg[0].toUpperCase(), splittedMsg[2], splittedMsg[3],
                            msg.from.replace('@c.us', ''), userDataBase);
                            client.sendMessage(msg.from, response);
                        } else {
                            client.sendMessage(msg.from, 'Bukan Link Profile Tiktok');
                        }
                    }
                //Data Order
                } else if(dataOrder.includes(splittedMsg[1].toLowerCase())){
                    if(splittedMsg[1].toLowerCase() === 'instacheck') {
                        //Checking If User hasn't update Insta Profile
                        let response = await checkData.instaCheck(splittedMsg[0].toUpperCase(), userDataBase);
                        client.sendMessage(msg.from, response);
                    } else if(splittedMsg[1].toLowerCase() === 'tiktokcheck') {
                        //Checking If User hasn't update Tiktok Profile
                        let response = await checkData.tiktokCheck(splittedMsg[0].toUpperCase(), userDataBase);
                        client.sendMessage(msg.from, response);
                    } else if(splittedMsg[1].toLowerCase() === 'mydata'){
                        //User Checking myData
                        let response = await query.myData(splittedMsg[0].toUpperCase(), splittedMsg[2], userDataBase);
                        client.sendMessage(msg.from, response);

                    } else if(splittedMsg[1].toLowerCase() === 'clientstate'){
                        //User Checking myData
                        let response = await dataBase.setClientState(splittedMsg[0].toUpperCase(), splittedMsg[2], clientDataBase);
                        client.sendMessage(msg.from, response);
    
                    }
                //Reload Data       
                } else if(reloadOrder.includes(splittedMsg[1].toLowerCase())){
                    if(splittedMsg[1].toLowerCase() === 'reloadinstalikes') {
                        //Reload Likes from Insta Official
                        let response = await instaReload.reloadInstaLikes(splittedMsg[0].toUpperCase(), userDataBase, clientDataBase, 
                        instaOfficialDataBase, instaLikesUsernameDataBase);
                        client.sendMessage(msg.from, response);  
                    } else if(splittedMsg[1].toLowerCase() === 'reloadtiktoklikes') {
                        //Reload Likes from Tiktok Official                    
                    }
                //Reporting
                } else if(reportOrder.includes(splittedMsg[1].toLowerCase())){
                    if(splittedMsg[1].toLowerCase() === 'reportinstalikes') {
                        //Report Likes from Insta Official
                        let response = await instaReport.reportInstaLikes(splittedMsg[0].toUpperCase(), userDataBase, clientDataBase, 
                        instaOfficialDataBase, instaLikesUsernameDataBase);
                        client.sendMessage(msg.from, response);  
                    } else if(splittedMsg[1].toLowerCase() === 'reporttiktoklikes') {
                        //Report Likes from Tiktok Official
                    }
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