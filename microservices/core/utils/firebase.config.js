// var admin = require("firebase-admin");

// var serviceAccount = {
//     "type": "service_account",
//     "project_id": "angle-share",
//     "private_key_id": "bf4403169aa03ad4f92f17f359f69d1b393a6f6e",
//     "private_key": process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
//     "client_email": "firebase-adminsdk-npmog@angle-share.iam.gserviceaccount.com",
//     "client_id": "103318358621807347318",
//     "auth_uri": "https://accounts.google.com/o/oauth2/auth",
//     "token_uri": "https://oauth2.googleapis.com/token",
//     "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
//     "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-npmog%40angle-share.iam.gserviceaccount.com",
//     "universe_domain": "googleapis.com"
// }

// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount)
// });

// const auth = admin.auth();

// module.exports = auth;