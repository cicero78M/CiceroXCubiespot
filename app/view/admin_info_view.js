export async function adminInfoView() {

    let data = {
    data : 

`
*Request Admin WABOT PEGIAT MEDSOS*
=================================
=================================
*Menampilkan Pesan ini* :

#ADMININFO
=================================
*Regist New Client :*

NEW_CLIENT_NAME#REGISTER#CLIENT_TYPE

_Contoh :_ 
CICERO#REGISTER#RES/COM
=================================
*Update Client Data :*

_Update Client State Account :_

CICERO#UPDATECLIENTDATA#CLIENTSTATE#BOOLEAN

_Update Insta Official Account :_

CICERO#UPDATECLIENTDATA#INSTA#INSTAGRAM_ACCOUNT

_Update Tiktok Official Account :_

CICERO#UPDATECLIENTDATA#TIKTOK#TIKTOK_ACCOUNT

_Update Insta State Account :_

CICERO#UPDATECLIENTDATA#INSTASTATE#BOOLEAN

_Update Tiktok State Account :_

CICERO#UPDATECLIENTDATA#TIKTOKSTATE#BOOLEAN

_Update Supervisor Whatsapp Number :_

CICERO#UPDATECLIENTDATA#SUPER#WA_CONTACT


_Update Operator Whatsapp Number :_

CICERO#UPDATECLIENTDATA#OPR#WA_CONTACT    

=================================
*Input User List Data From New Client :*

CICERO#PUSHUSERRES#SPREADSHEET_LINK

CICERO#PUSHUSERCOM#SPREADSHEET_LINK

=================================
*Update Tiktok Secuid Code :*

#SECUID

=================================
*EXCEPTION DATA :*

CICERO#EXCEPTION#NRP#BOOLEAN
=================================
*Save Contact Whatsapp :*

#SAVECONTACT
=================================
*CLIENT DATA INFO :*

#CLIENTDATAVIEW
=================================
`,

    state: true,
    code: 200
    }

    return data;
}