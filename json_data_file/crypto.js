import CryptoJS from "crypto-js"

export async function encrypted(data) {
    let encrypt = CryptoJS.AES.encrypt(data, process.env.SECRET_KEY).toString();
    console.log(encrypt);
    return encrypt;
}