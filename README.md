# CiceroXCubiespot
Cicero Colaboration
What's Cicero?
Cicero is a social media management system that handles members of groups, organizations and companies for doing likes and Comments on Social Media Accounts. Its main function is to supervise the implementation of likes and comments by members of groups, organizations or companies by providing regular reports based on the results of data proccessing of scrapping data user by theirs likes and comments on official social media accounts. It's use Whatsapp Platform as data transaction Interface.

Admin Request Order:

- Add New Client : ClientName#addclient#InstaLink#tiktokLink || OK
- Change Status Client : ClientName#clientstate#boolean || OK
- Transfer Data by Organizations : ClientName#newclientorg#LinkSourceSheet || OK 
- Source File Format NRP(Number)/NAMA(String)/PANGKAT(String)/SATFUNG(String)/JABATAN(String)/STATUS(Boolean)/WHATSAPP(Number)/INSTA(String)/TIKTOK(String)

- Transfer Data by Company : ClientName#newclientcom#LinkSourceSheet || OK
- Source File Format ID_KEY(Number)/NAMA(String)/TITLE(String)- Optional/DIVISI(String)/JABATAN(String)/STATUS(Boolean)/WHATSAPP(Number)/INSTA(String)/TIKTOK(String)

- Adding New User to Database : ClientName#addnew#ID_Key#UserName#UserDivision#UserJabatan#UserTitle(Optional) || OK
- Rename : ClientName#editname#ID_Key#new_user_profile_name || OK
- Change Division : ClientName#editdivisi#ID_Key#new_divisi || OK
- Change Jabatan : ClientName#editjabatan#ID_Key#new_jabatan || OK

Report Update User Social Media Profile:

- Report Insta Update : ClientName#instacheck || OK
- Report Tiktok Update : ClientName#tiktokcheck || OK

User Order :

- Request Checking My Data : ClientName#mydata || OK
- Request Update Insta Username : ClientName#updateinsta#InstagramProfileLink || OK
- Request Update Tiktok Username : ClientName#updatetiktok#TiktokProfileLink || OK

Reloads Enggagement Data:

- Reload Insta likes : ClientName#reloadInstaLikes || OK
- Reload Tiktok Comments : ClientName#reloadtiktokComments || OK
- Reload Whatsapp Story : ClientName#reloadstorysharing
  

Report Engagement Data :

- Report Insta Likes: ClientName#reportInstaLikes || OK
- Report Tiktok likes : ClientName#reporttiktokcomments || OK
- Report Whatsapp Story : ClientName#reportTiktokLikes

Automate / Cron Job:

- Report Update Data
- Reload Insta Likes
- Reload Tiktok Comment
- Report InstaLikes
- Report Tiktok Comments

Client Activations Mechanism :
- Client Preparing User Data
- Admin Push User Data to Server
- Admin Add Client Properties by Order
- User Update Data by ID_Key
- System Handle Bussiness Life Cycles

  
>> WEB-APP DASHBOARD

- Data Manajemen System.
