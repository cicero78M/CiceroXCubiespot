import path from "path";
import process from "process";
import { authenticate } from "@google-cloud/local-auth";
import { google } from "googleapis";
import { readFile, writeFile } from "fs/promises";
import { createReadStream } from "fs";

// If modifying these scopes, delete token.json.
const SCOPES = [
  'https://www.googleapis.com/auth/contacts',
  'https://www.googleapis.com/auth/contacts.readonly',
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/drive.readonly'];

// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.

const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

/**
 * Serializes credentials to a file compatible with GoogleAuth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
  const content = await readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 *
 */
export async function authorize() {

  let client = await loadSavedCredentialsIfExist();
  
  if (client) {
    return client;
  }

  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });

  if (client.credentials) {
    await saveCredentials(client);
  }
  
  return client;
}

export async function searchbyNumbers(phone, auth) {
  
  try {
    const service = google.people({version: 'v1', auth});

    const contact = {
      resourceName: 'people/me',
      phoneNumbers: [{ value: phone }],
    }

    const response = service.people.searchContacts({
      requestBody: contact, 
    });
    console.log(response.data)
    return response;
  
  } catch (error) {
    console.log(error)
  }
}

export async function saveGoogleContact(name, phone, auth) {

  try {

    const service = google.people({version: 'v1', auth});
    const contact = {
        names: [{ givenName: name }],
        phoneNumbers: [{ value: phone }],
    }

    const response = await service.people.createContact({
        requestBody: contact, 
    });

    return response.data;

  } catch (error) {

    console.log(error)      
  }
}

export async function driveUploadFile(auth, name, fields, source) {

  try {

    const service = google.drive({version: 'v3', auth});
    const requestBody = {
      name: name,
      fields: fields,
    };
    const media = {
      mimeType: 'application/json',
      body: createReadStream(source),
    };
    try {
      const file = await service.files.create({
        requestBody,
        media: media,
      });
      console.log('File Id:', file.data.id);
      return file.data.id;
    } catch (err) {
      // TODO(developer) - Handle error
      throw err;
    }

  } catch (error) {
    console.log(error)      
  }
}