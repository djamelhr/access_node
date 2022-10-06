"use strict";

import inquirer from "inquirer";
import admin from "firebase-admin";
import os from "os";
import { Service, EventLogger } from "node-windows";
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

const hostname = os.hostname();

// import fs from "fs";
// const data = JSON.parse(fs.readFileSync("./data.json"));
// console.log(data);
// Create a new service object
const svc = new Service({
  name: "Attendance-management.cron-job-3",
  description: "The nodejs.org web server.",
  script: "E:\\access_node\\app.js",
  execPath: "E:\\access_node\\app.exe",
  //, workingDirectory: '...'
  //, allowServiceLogon: true
});
svc.on("alreadyinstalled", function () {
  console.log("This service is already installed.");
});
svc.on("install", function () {
  try {
    console.log("install this service...");

    svc.start();
  } catch (error) {
    console.log("this the error", error);
  }
});
svc.on("uninstall", function () {
  try {
    console.log("uninstall this service...");
  } catch (error) {
    console.log("this the error", error);
  }
});
svc.on("start", function () {
  console.log(svc.name + " started!");
});
const ask = async (message) => {
  const answer = await inquirer.prompt([
    {
      name: "qst",
      type: "input",
      message,
    },
  ]);
  return answer.qst;
};
const start = async () => {
  const license_Key = await ask("Key");
  if (license_Key === "djdj1991") {
    const spreadsheetId = await ask("Enter SpreadSheet Id");
    if (spreadsheetId) {
      const data_range = await ask("Enter Sheet Name");
      if (data_range) {
        const cron_exp = await ask("Enter Cron Expression");
        if (cron_exp) {
          const install = await ask("do you want install or uninstall");
          if (install === "1") {
            svc.install();

            const cmaDb = db.collection("opg");
            const cookiesdb = cmaDb.doc(hostname);
            await cookiesdb.set({
              key: hostname,
              range: data_range,
              spreadsheetId,
              cron_exp,
              created_at: new Date().toISOString(),
            });
          } else if (install === "0") {
            svc.uninstall();
          } else {
            console.log("wrong...");
          }
        }
      }
    }
  } else {
    console.log("wrong key");
  }
};
start();
//nexe index.js -o test -t windows --build
