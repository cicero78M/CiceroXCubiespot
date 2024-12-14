const fs = require('fs');
const express = require('express');
const app = express();

const dbKey = JSON.parse (fs.readFileSync('dbKey.json'));
const dataBase = require('./src/database/database');
const query = require('./src/database/myData');
const checkData = require('./src/database/checkData');
const instaReload = require('./src/scrapper/instalikesreload');
const instaReport = require('./src/reporting/instalikesreport');
const tiktokReload = require('./src/scrapper/tiktocommentreload');
const waStory = require('./src/scrapper/wastory');
const clientLoad = require('./src/database/clientLoad');

const { Client , LocalAuth } = require('whatsapp-web.js');
const figlet = require('figlet');
const banner = require('simple-banner');
const qrcode = require('qrcode-terminal');
const cron = require('node-cron');
 


const port = 3007;
const userDataBase = dbKey.databaseID;;
const clientDataBase = dbKey.clientDataID;
const instaOfficialDataBase = dbKey.instaOfficialID;
const instaLikesUsernameDataBase = dbKey.instaLikesUsernameID;
const tiktokOfficialDataBase = dbKey.tiktokOfficialID;
const tiktokCommentUsernameDataBase = dbKey.tiktokCommentUsernameID;
const waStoryDataBase = dbKey.waStoryID;

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

    /*
    
    // Reload Insta
    cron.schedule('* * * * *', async () => {
        let response = await waStory.waStoryInsta(clientDataBase);
        console.log(response);
    });
    
    */

});

client.on('qr', qr => {

    //Pairing WA Center
    qrcode.generate(qr, {small: true});

});

client.on('message', async (msg) => {

    const newClientOrder = ['newclientres', 'newclientcom' ];
    const updateUserData = ['adduser', 'editnama', 'editdivisi', 'editjabatan', 'updateinsta', 'updatetiktok'];
    const dataOrder = ['menu', 'mydata', 'instacheck', 'tiktokcheck', 'clientstate'];
    const reloadOrder = ['reloadinstalikes', 'reloadtiktokcomments', 'reloadstorysharing', 'reloadallinsta' ];
    const reportOrder = ['reportinstalikes', 'reporttiktokcomments', 'reportstorysharing'];

    try {
        if (msg.isStatus){
            //If Msg is WA Story
            const contact = await msg.getContact();
            const chat = await msg.getChat();
            chat.sendSeen();

            console.log(contact.pushname+" ===>>>> "+msg.body);

            if(contact.pushname != undefined){
                    
                let body = msg.body;
                let url = body.match(/\bhttps?:\/\/\S+/gi);
                if (url !== null){
                    if (url[0].includes('instagram.com')){
   
                        console.log(contact.pushname+" ===>>>> "+msg.body);
                        let response = await waStory.waStoryInsta(msg.from, url, userDataBase, clientDataBase, waStoryDataBase);
                        if(response.code === 1 ){
                            console.log(response.message);
                            client.sendMessage(contact.number+"@c.us", response.message);
                        } else {
                            console.log(response.message);
                        }

                    }
                }
            }
        } else {
            //Splitted Msg
            const splittedMsg = msg.body.split("#");
            if(splittedMsg.length > 1){
                console.log(msg.from+' ==> '+splittedMsg[1].toLowerCase());
                if(splittedMsg[1].toLowerCase() === 'addclient'){//AddClient
                    if (!splittedMsg[3].includes('/p/') || !splittedMsg[3].includes('/reels/') || !splittedMsg[3].includes('/video/') && splittedMsg[3].includes('instagram.com') && !splittedMsg[4].includes('tiktok.com')){
                        
                        let response = await dataBase.addClient(splittedMsg[0].toUpperCase(), splittedMsg[2].toUpperCase(), splittedMsg[3], splittedMsg[4], 
                        clientDataBase, instaOfficialDataBase, instaLikesUsernameDataBase);
                        
                        if(response.code === 1){
                            console.log(response.message);
                            client.sendMessage(msg.from, response.message);
                        } else {
                            console.log(response.message);
                        }                   
                    }
                
                } else if(newClientOrder.includes(splittedMsg[1].toLowerCase())){//const newClientOrder = ['newclientres', 'newclientcom' ];
                    
                    if(splittedMsg[2].includes('https://docs.google.com/spreadsheets/d/')){
                        //Is contains Links
                        if (splittedMsg[1].toLowerCase() === "newclientres"){
                            //If Request for New Client by Polres
                            //Res Request
                            let response = await dataBase.newClientRes(splittedMsg[0].toUpperCase(), splittedMsg[2], userDataBase);
                            
                            if(response.code === 1){
                                console.log(response.message);
                                client.sendMessage(msg.from, response.message);
                            } else {
                                console.log(response.message);
                            }      
                        
                        }  else if (splittedMsg[1].toLowerCase() === "newclientcom"){
                            //If Request for New Client by Company
                            //Company Request
                            let response = await dataBase.newClientCom(splittedMsg[0].toUpperCase(), splittedMsg[2], userDataBase);
                            
                            if(response.code === 1){
                                console.log(response.message);
                                client.sendMessage(msg.from, response.message);
                            } else {
                                console.log(response.message);
                            }                          
                        
                        }
                    } else {
                        
                        console.log('Bukan Spreadsheet Links');
                        client.sendMessage(contact.number+"@c.us", 'Bukan Spreadsheet Links');

                    }       
                //Update Data         
                } else if (updateUserData.includes(splittedMsg[1].toLowerCase())){//const updateUserData = ['adduser', 'editnama', 'editdivisi', 'editjabatan', 'updateinsta', 'updatetiktok'];
                    if (splittedMsg[1].toLowerCase() === 'adduser'){ 
                        //Check Between Corporate And Organizations
                        if(splittedMsg.length > 6){                   
                        
                            let response = await dataBase.addUser(splittedMsg[0].toUpperCase(), splittedMsg[2], splittedMsg[3].toUpperCase(), 
                            splittedMsg[4].toUpperCase(), splittedMsg[5].toUpperCase(), splittedMsg[6].toUpperCase(), userDataBase);
                            
                            if(response.code === 1){
                                console.log(response.message);
                                client.sendMessage(msg.from, response.message);
                            } else {
                                console.log(response.message);
                            }                          
                        
                        } else {
                        
                            let response = await dataBase.addUser(splittedMsg[0].toUpperCase(), splittedMsg[2], splittedMsg[3].toUpperCase(), 
                            splittedMsg[4].toUpperCase(), splittedMsg[5].toUpperCase(), null, userDataBase);
                        
                            if(response.code === 1){
                                console.log(response.message);
                                client.sendMessage(msg.from, response.message);
                            } else {
                                console.log(response.message);
                            }
                       
                        }
                    } else if(splittedMsg[1].toLowerCase() === 'editdivisi') {
                        //update Divisi Name
                        let response = await dataBase.editDivisi(splittedMsg[0].toUpperCase(), splittedMsg[2], splittedMsg[3].toUpperCase(), 
                        msg.from.replace('@c.us', ''), userDataBase);
                        
                        if(response.code === 1){
                            console.log(response.message);
                            client.sendMessage(msg.from, response.message);
                        } else {
                            console.log(response.message);
                        }

                    } else if(splittedMsg[1].toLowerCase() === 'editjabatan') {
                        //Update Jabatan
                        let response = await dataBase.editJabatan(splittedMsg[0].toUpperCase(), splittedMsg[2], splittedMsg[3].toUpperCase(), 
                        msg.from.replace('@c.us', ''), userDataBase);
                        
                        if(response.code === 1){
                            console.log(response.message);
                            client.sendMessage(msg.from, response.message);
                        } else {
                            console.log(response.message);
                        }

                    } else if(splittedMsg[1].toLowerCase() === 'editnama') {
                        //Update Nama
                        let response = await dataBase.editNama(splittedMsg[0].toUpperCase(), splittedMsg[2], splittedMsg[3].toUpperCase(), 
                        msg.from.replace('@c.us', ''), userDataBase);
                        
                        if(response.code === 1){
                            console.log(response.message);
                            client.sendMessage(msg.from, response.message);
                        } else {
                            console.log(response.message);
                        }

                    } else if(splittedMsg[1].toLowerCase() === 'updateinsta') {
                        //Update Insta Profile
                        if (splittedMsg[3].includes('instagram.com')){
                            if (!splittedMsg[3].includes('/p/') || !splittedMsg[3].includes('/reels/') || !splittedMsg[3].includes('/video/') ){
                        
                                let response = await dataBase.updateInsta(splittedMsg[0].toUpperCase(), splittedMsg[2], splittedMsg[3], 
                                msg.from.replace('@c.us', ''), userDataBase);
                        
                                if(response.code === 1){
                                    console.log(response.message);
                                    client.sendMessage(msg.from, response.message);
                                } else {
                                    console.log(response.message);
                                }                                   
                        
                            } else {
                                console.log('Bukan Link Profile Instagram');
                                client.sendMessage(msg.from, 'Bukan Link Profile Instagram');
                            }
                        
                        } else {
                            console.log('Bukan Link Profile Instagram');
                            client.sendMessage(msg.from, 'Bukan Link Profile Instagram');
                        }

                    } else if(splittedMsg[1].toLowerCase() === 'updatetiktok') {
                        //Update Tiktok profile
                        if (splittedMsg[3].includes('tiktok.com')){                    
                        
                            let response = await dataBase.updateTiktok(splittedMsg[0].toUpperCase(), splittedMsg[2], splittedMsg[3],
                            msg.from.replace('@c.us', ''), userDataBase);
                        
                            if(response.code === 1){
                                console.log(response.message);
                                client.sendMessage(msg.from, response.message);
                            } else {
                                console.log(response.message);
                            }                             
                        
                        } else {
                    
                            console.log('Bukan Link Profile Tiktok');
                            client.sendMessage(msg.from, 'Bukan Link Profile Tiktok');

                        }
                    }
                //Data Order
                } else if(dataOrder.includes(splittedMsg[1].toLowerCase())){//const dataOrder = ['mydata','instacheck', 'tiktokcheck', 'clientstate'];
                    if(splittedMsg[1].toLowerCase() === 'instacheck') {
                        //Checking If User hasn't update Insta Profile
                        let response = await checkData.instaCheck(splittedMsg[0].toUpperCase(), userDataBase);
                        
                        if(response.code === 1){
                            console.log(response.message);
                            client.sendMessage(msg.from, response.message);
                        } else {
                            console.log(response.message);
                        }

                    } else if(splittedMsg[1].toLowerCase() === 'tiktokcheck') {
                        //Checking If User hasn't update Tiktok Profile
                        let response = await checkData.tiktokCheck(splittedMsg[0].toUpperCase(), userDataBase);
                        
                        if(response.code === 1){
                            console.log(response.message);
                            client.sendMessage(msg.from, response.message);
                        } else {
                            console.log(response.message);
                        }

                    } else if(splittedMsg[1].toLowerCase() === 'mydata'){
                        //User Checking myData
                        let response = await query.myData(splittedMsg[0].toUpperCase(), splittedMsg[2], userDataBase);
                        
                        if(response.code === 1){
                            console.log(response.message);
                            client.sendMessage(msg.from, response.message);
                        } else {
                            console.log(response.message);
                        }

                    } else if(splittedMsg[1].toLowerCase() === 'clientstate'){
                        //User Checking myData
                        let response = await dataBase.setClientState(splittedMsg[0].toUpperCase(), splittedMsg[2], clientDataBase);

                        if(response.code === 1){
                            console.log(response.message);
                            client.sendMessage(msg.from, response.message);
                        } else {
                            console.log(response.message);
                        }                    

                    }
                //Reload Data       
                } else if(reloadOrder.includes(splittedMsg[1].toLowerCase())){//const reloadOrder = ['reloadinstalikes', 'reloadtiktokcomments', 'reloadstorysharing'];
                    if(splittedMsg[1].toLowerCase() === 'reloadinstalikes') {
                        //Reload Likes from Insta Official
                        let response = await instaReload.reloadInstaLikes(splittedMsg[0].toUpperCase(), userDataBase, clientDataBase, 
                        instaOfficialDataBase, instaLikesUsernameDataBase);
                        
                        if(response.code === 1){
                            console.log(response.message);
                            client.sendMessage(msg.from, response.message);
                        } else {
                            console.log(response.message);
                        }

                    } else if(splittedMsg[1].toLowerCase() === 'reloadtiktokcomments') {
                        //Reload Comments from Tiktok Official
                        let response = await tiktokReload.reloadTiktokComments(splittedMsg[0].toUpperCase(), userDataBase, clientDataBase, 
                        tiktokOfficialDataBase, tiktokCommentUsernameDataBase);
                        
                        if(response.code === 1){
                            console.log(response.message);
                            client.sendMessage(msg.from, response.message);
                        } else {
                            console.log(response.message);
                        }               

                    } else if (splittedMsg[1].toLowerCase() === 'reloadallinsta'){
                        let response = await clientLoad.loadClient(clientDataBase);
                        console.log(response);
                    }
                //Reporting
                } else if(reportOrder.includes(splittedMsg[1].toLowerCase())){//const reportOrder = ['reportinstalikes', 'reporttiktokcomments', 'reportstorysharing'];
                    if(splittedMsg[1].toLowerCase() === 'reportinstalikes') {
                        //Report Likes from Insta Official
                        let response = await instaReport.reportInstaLikes(splittedMsg[0].toUpperCase(), userDataBase, clientDataBase, 
                        instaOfficialDataBase, instaLikesUsernameDataBase);
                        
                        if(response.code === 1){
                            console.log(response.message);
                            client.sendMessage(msg.from, response.message);
                        } else {
                            console.log(response.message);
                        }                      

                    } else if(splittedMsg[1].toLowerCase() === 'reporttiktokcomments') {
                        //Report Comments from Tiktok Official
                        let response = await tiktokReport.reportTiktokComments(splittedMsg[0].toUpperCase(), userDataBase, clientDataBase, 
                        tiktokOfficialDataBase, tiktokCommentUsernameDataBase);
                        
                        if(response.code === 1){
                            console.log(response.message);
                            client.sendMessage(msg.from, response.message);
                        } else {
                            console.log(response.message);
                        }
                    }
                }//if(splittedMsg[1].toLowerCase()......
            } else {
                //Regular Messages
                const contact = await msg.getContact();
                const chat = await msg.getChat();
                chat.sendSeen();
                chat.sendStateTyping();
                
                if(contact.pushname != undefined){
                    
                    let body = msg.body;
                    let url = body.match(/\bhttps?:\/\/\S+/gi);
                    if (url != null){
                        console.log(contact.number+" ===>>>> "+msg.body);
//                        let response = await waStory.waStoryInsta(msg.from, url, userDataBase, clientDataBase, waStoryDataBase);
//                        console.log(response);
//                        client.sendMessage(contact.number+"@c.us", response);  
                    }
                }
            }// if(splittedMsg.length....
        } //if(msg.status....
    } catch (error) {

        console.log(error);
    
    }//try catch
});