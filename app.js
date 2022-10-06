"use strict";
import { readFileSync } from "fs";
import MDBReader from "mdb-reader";
import { google } from "googleapis";
import cron from "node-cron";
import admin from "firebase-admin";
import os from "os";

//const data = JSON.parse(readFileSync("./data.json"));

admin.initializeApp({
  credential: admin.credential.cert({
    type: "service_account",
    project_id: "djomake",
    private_key_id: "83c575a0789026d87b0b8ee0f4843a57a78f4f3d",
    private_key:
      "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCkrnxH+aRqFrPC\niI39TUJ8+g+6YY24pLA0X+cu9TlIEBpbkuEaT2witDGIvegxc9O0f9KEOJ60fDry\nC7QVBLyxx33C6pE5gktYcjEutiLl3mBNeQ0+QTJY5spyNp+ZkRAwtBS4X67fiVK1\nB4GjrZpJfjbmtRyBhbqr4oUcL8AuYVDUw4ZAdiVnAsSEBXLrUkEgbR0ldmtTAJNM\n6xvnwqjz/VpyLSUvgsY/vWTv1ipvT0DFVhCNxbZHcEEKe7UFeXvnQeXjb5JTRczk\nomXCIoCDf/8keF0KOwcfbEZSuRFv9nnFKBk5qbY5JYAsW8Ir/qsVnmKkYWWcvzDS\n6ujYvARJAgMBAAECggEAClryc7At94HP8eaWTxxBlww+WvDxcW/hqJlzNw+yd2aT\n0bhNsVLXMON1zexrIljvMgVrnmbVC/JX3op/22Z92wv5S31mfmBEDp63mwFW9m9i\nTNzUyVpeKRryFfZ7WLO3eeiI+QMDQwkmiz2amEk9T2vBVgaDcV2QXGiVCC20fvYD\nxGJQ4od7KvVBb1uABKzJc9OdbLIjeK1RL53Zk1xunX/FT/ae6I4MSXdgDj4b2ywm\njeJjjrhvrhaRNWdAPnAmVWvkTsi3Sjc26DPuRKqNpERB7PuJmuHY4fEXijxb13lw\nHRkisadUuOEIhNuvok5KQTsAsG8dJY4oNLYZDH36gQKBgQDRZ922uo24bL0UhEll\nMoJ3lWAxdmCV3GSYe1TuEy7uMCEsg4eyLhN7KhvjdnPX27ohEROR1CuIJljTdyBq\n9KDYRHNecveGF2r7fl2t0dYNt5C/hxg1Gxz8rW95cok42Sa7ugc2nus3hYUvFDqF\nUlJLaLHBQWafq0W7ruqPE4utcQKBgQDJUwzeMXaDz5GjCizHk50G0X3HUuzS3Z5p\nNih2MCSI4uWCXvcFmZJG89uuOZNkU1lhbQK7STneNZN3BRJB0rNxaCaSNNTaC16B\nrCoZ/YqcvUfCPW6n4H2oze2M/sGzc4JtcH6DooH3Q+LSzy/uBPnthvPXZ5a4+wWt\n3XmwBPw4WQKBgQDIW1m+iRYqHBh5de0Hn2FHa6vjB4F4QawaXP6w37fqfDBxd9Ow\nvvcyw+J1K5PBN+IJ213fDKMuHIqmofdpfnAbHLtJ5jRAn01kHc8iDYCCFV2wc2DN\nBwkgFg1vpQ/4TYUK3v4h28HwmJcKqY8omtBUiHJzFtFK+kO5RK32gVwGcQKBgHI+\npMC6BO0LrzN8JKkkhSlHXD7uOeH3TVubFh7rdvAPAfqXdUpCOZX18CXQGmoGOmRk\n/fXVufb1JDeYMyITNS0X0zuIq3kIlpqzXjjdffkwGDaLse2mIOjX4wPt1XHGDK+Z\n9NEyONpeNas3U5WYUVOPD3SfHhLer/xYACP40EARAoGBAIW5OCwpO3dfY3x01U/s\naBsFe9wkzZYhGqQOd3ghZDpm7ckHUcuuMjk7hwO8wAM3uhoEadysu4NMmiETf/2F\nl677P237tbdsVKLfH4NrO7WPTyRYMGfpwfs/4FI/rAvL0lfyT//zTDOQKe8G1Sv0\nXGtl6rEIdFfzGvn7FtLEE4RG\n-----END PRIVATE KEY-----\n",
    client_email: "firebase-adminsdk-4aezg@djomake.iam.gserviceaccount.com",
    client_id: "105555170127373828965",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url:
      "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-4aezg%40djomake.iam.gserviceaccount.com",
  }),
});
export const db = admin.firestore();
let key;
let range;
let spreadsheetId;
let cron_exp;

(async () => {
  const doc = await db.collection("opg").doc("pc").get();

  const data = await doc.data();
  key = data.key;
  range = data.range;
  spreadsheetId = data.spreadsheetId;
  cron_exp = data.cron_exp;

  cron.schedule(cron_exp, async () => {
    const hostname = os.hostname();
    const doc = await db.collection("opg").doc(hostname).get();
    const data = await doc.data();
    key = data.key;
    range = data.range;
    spreadsheetId = data.spreadsheetId;
    if (hostname === key) {
      await sendData(spreadsheetId, range);
    } else {
      console.log("faild to run");
      process.exit();
    }
  });
})();

//OPGIbatna5:)

const googleApiAppend = async (updateOpt) => {
  try {
    const auth2 = await authorize();
    const gsapi = google.sheets({
      version: "v4",
      auth: auth2,
    });
    await gsapi.spreadsheets.values.clear({
      spreadsheetId: updateOpt.spreadsheetId,
      range: updateOpt.range,
    });
    await gsapi.spreadsheets.values.append(updateOpt, (err, response) => {
      if (err) {
        console.error(err);
        return;
      }

      console.log("send it!! ");
    });
    // TODO: Change code below to process the `response` object:
    //   console.log(JSON.stringify(response, null, 2));
  } catch (error) {
    console.log(error);
    return error;
  }
};
const authorize = () => {
  const authClient = new google.auth.JWT(
    serviceAccount.client_email,
    "",
    serviceAccount.private_key,
    ["https://www.googleapis.com/auth/spreadsheets"]
  );

  authClient.authorize((err, tokens) => {
    if (err) {
      console.log(err);
      return;
    } else {
      console.log("connected");
    }
  });
  // console.log(authClient);

  if (authClient == null) {
    throw Error("authentication failed");
  }

  return authClient;
};
const serviceAccount = {
  type: "service_account",
  project_id: "djomake",
  private_key_id: "83c575a0789026d87b0b8ee0f4843a57a78f4f3d",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCkrnxH+aRqFrPC\niI39TUJ8+g+6YY24pLA0X+cu9TlIEBpbkuEaT2witDGIvegxc9O0f9KEOJ60fDry\nC7QVBLyxx33C6pE5gktYcjEutiLl3mBNeQ0+QTJY5spyNp+ZkRAwtBS4X67fiVK1\nB4GjrZpJfjbmtRyBhbqr4oUcL8AuYVDUw4ZAdiVnAsSEBXLrUkEgbR0ldmtTAJNM\n6xvnwqjz/VpyLSUvgsY/vWTv1ipvT0DFVhCNxbZHcEEKe7UFeXvnQeXjb5JTRczk\nomXCIoCDf/8keF0KOwcfbEZSuRFv9nnFKBk5qbY5JYAsW8Ir/qsVnmKkYWWcvzDS\n6ujYvARJAgMBAAECggEAClryc7At94HP8eaWTxxBlww+WvDxcW/hqJlzNw+yd2aT\n0bhNsVLXMON1zexrIljvMgVrnmbVC/JX3op/22Z92wv5S31mfmBEDp63mwFW9m9i\nTNzUyVpeKRryFfZ7WLO3eeiI+QMDQwkmiz2amEk9T2vBVgaDcV2QXGiVCC20fvYD\nxGJQ4od7KvVBb1uABKzJc9OdbLIjeK1RL53Zk1xunX/FT/ae6I4MSXdgDj4b2ywm\njeJjjrhvrhaRNWdAPnAmVWvkTsi3Sjc26DPuRKqNpERB7PuJmuHY4fEXijxb13lw\nHRkisadUuOEIhNuvok5KQTsAsG8dJY4oNLYZDH36gQKBgQDRZ922uo24bL0UhEll\nMoJ3lWAxdmCV3GSYe1TuEy7uMCEsg4eyLhN7KhvjdnPX27ohEROR1CuIJljTdyBq\n9KDYRHNecveGF2r7fl2t0dYNt5C/hxg1Gxz8rW95cok42Sa7ugc2nus3hYUvFDqF\nUlJLaLHBQWafq0W7ruqPE4utcQKBgQDJUwzeMXaDz5GjCizHk50G0X3HUuzS3Z5p\nNih2MCSI4uWCXvcFmZJG89uuOZNkU1lhbQK7STneNZN3BRJB0rNxaCaSNNTaC16B\nrCoZ/YqcvUfCPW6n4H2oze2M/sGzc4JtcH6DooH3Q+LSzy/uBPnthvPXZ5a4+wWt\n3XmwBPw4WQKBgQDIW1m+iRYqHBh5de0Hn2FHa6vjB4F4QawaXP6w37fqfDBxd9Ow\nvvcyw+J1K5PBN+IJ213fDKMuHIqmofdpfnAbHLtJ5jRAn01kHc8iDYCCFV2wc2DN\nBwkgFg1vpQ/4TYUK3v4h28HwmJcKqY8omtBUiHJzFtFK+kO5RK32gVwGcQKBgHI+\npMC6BO0LrzN8JKkkhSlHXD7uOeH3TVubFh7rdvAPAfqXdUpCOZX18CXQGmoGOmRk\n/fXVufb1JDeYMyITNS0X0zuIq3kIlpqzXjjdffkwGDaLse2mIOjX4wPt1XHGDK+Z\n9NEyONpeNas3U5WYUVOPD3SfHhLer/xYACP40EARAoGBAIW5OCwpO3dfY3x01U/s\naBsFe9wkzZYhGqQOd3ghZDpm7ckHUcuuMjk7hwO8wAM3uhoEadysu4NMmiETf/2F\nl677P237tbdsVKLfH4NrO7WPTyRYMGfpwfs/4FI/rAvL0lfyT//zTDOQKe8G1Sv0\nXGtl6rEIdFfzGvn7FtLEE4RG\n-----END PRIVATE KEY-----\n",
  client_email: "firebase-adminsdk-4aezg@djomake.iam.gserviceaccount.com",
  client_id: "105555170127373828965",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-4aezg%40djomake.iam.gserviceaccount.com",
};

export const sendData = async (spreadsheetId, data_range) => {
  // "1-p3LlkjY3gFuDgdEVxN-zaG69r7SytULwwZOtV0YcnY"
  try {
    const buffer = readFileSync("C:\\att2000.mdb");
    const reader = new MDBReader(buffer);
    const table = reader.getTable("CHECKINOUT");
    const data = table.getData();
    const values = [];
    data.map((item) => {
      values.push([
        item.USERID,
        item.CHECKTIME,
        item.CHCKTYPE,
        item.VERIFYCODE,
        item.SENSORID,
        item.Memoinfo,
        item.sn,
        item.UserExtFmt,
      ]);
    });
    await googleApiAppend({
      spreadsheetId,
      range: `${data_range}!A2:I`,
      valueInputOption: "USER_ENTERED",
      resource: {
        values,
      },
    });
  } catch (error) {
    console.log(error);
  }
};
