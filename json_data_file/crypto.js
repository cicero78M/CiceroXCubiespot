import CryptoJS from "crypto-js"

export function encrypted(data) {
    return CryptoJS.AES.decrypt(data, process.env.SECRET_KEY).toString();
}