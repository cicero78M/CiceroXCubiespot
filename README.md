# CiceroXCubiespot
Cicero Colaboration

Admin Request Order:

- Add New Client : ClientName#addclient#InstaLink#tiktokLink
- Change Status Client : ClientName#clientstate#boolean

- Transfer Data by Organizations : ClientName#newclientorg#LinkSourceSheet
- Source File Format NRP(Number)/NAMA(String)/PANGKAT(String)/SATFUNG(String)/JABATAN(String)/STATUS(Boolean)/WHATSAPP(Number)/INSTA(String)/TIKTOK(String)

- Transfer Data by Company : ClientName#newclientcom#LinkSourceSheet
- Source File Format ID_KEY(Number)/NAMA(String)/TITLE(String)- Optional/DIVISI(String)/JABATAN(String)/STATUS(Boolean)/WHATSAPP(Number)/INSTA(String)/TIKTOK(String)

- Adding New User to Database : ClientName#addnew#ID_Key#UserName#UserDivision#UserJabatan#UserTitle(Optional)
- Rename : ClientName#editname#ID_Key#new name
- Change Division : ClientName#editdivisi#ID_Key#new divisi
- Change Jabatan : ClientName#editjabatan#ID_Key#new jabatan

Report User Data :

- Report Insta Update : ClientName#instacheck
- Report Tiktok Update : ClientName#tiktokcheck

User Order :

- Request Checking My Data : ClientName#mydata
- Request Update Insta Username : ClientName#updateinsta#InstagramProfileLink
- Request Update Tiktok Username : ClientName#updatetiktok#TiktokProfileLink

System Reloads data :

- Reload Insta
- Reload Tiktok
- Reload Whatsapp Story
  
System Rekap Data :

- Rekap Insta
- Rekap Tiktok
- Rekap Story
