# CiceroXCubiespot

Cicero Colaboration

What's Cicero?

Cicero is a social media management system that handles members of groups, organizations and companies for their participations on Social Media Engagements of Official Accounts. It's main function is to supervise the participations of members by providing regular reports based on the results of data proccessing generated from social media accounts data engagements. The system itselfs use Whatsapp Platform as data transaction Interface.

Admin Request Order:

- Add New Client : ClientName#addclient#type['COM','RES']#InstaLink#tiktokLink || OK (COM : COMPANY, RES : RESORT)
- Change Status Client : ClientName#clientstate#boolean || OK
- Transfer Data by Organizations : ClientName#newclientorg#LinkSourceSheet || OK 
- Source File Format NRP(Number)/NAMA(String)/PANGKAT(String)/SATFUNG(String)/JABATAN(String)/STATUS(Boolean)/WHATSAPP(Number)/INSTA(String)/TIKTOK(String)

- Transfer Data by Company : ClientName#newclientcom#LinkSourceSheet || OK
- Source File Format ID_KEY(Number)/NAMA(String)/TITLE(String) - Optional/DIVISI(String)/JABATAN(String)/STATUS(Boolean)/WHATSAPP(Number)/INSTA(String)/TIKTOK(String)

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
- Reload Whatsapp Story : Automate by the system every time the members update their whatsapp story.
  
Report Engagement Data :

- Report Insta Likes: ClientName#reportInstaLikes || OK
- Report Tiktok likes : ClientName#reporttiktokcomments || OK
- Report Whatsapp Story : ClientName#reportwastory

Automate / Cron Job:

- Report Update Data
- Reload Insta Likes
- Reload Tiktok Comment
- Report InstaLikes
- Report Tiktok Comments
- Schedulers
  
Client Activations Mechanism :

- Client Preparing User Data
- Admin Push User Data to Server
- Admin Add Client Properties by Order
- User Update Data by ID_Key
- System Handle Bussiness Life Cycles

>> WEB-APP DASHBOARD

- Data Base Manajemen System.
