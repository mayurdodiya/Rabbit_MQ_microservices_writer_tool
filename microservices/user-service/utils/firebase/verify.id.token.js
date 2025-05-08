// const auth = require('../../../core/utils/firebase.config');
const responseLib = require("wt-lib").resp;
var admin = require("firebase-admin");
const { log } = require("wt-lib/logger.lib");

var serviceAccount = {
  type: "service_account",
  project_id: "angle-share",
  private_key_id: "bf4403169aa03ad4f92f17f359f69d1b393a6f6e",
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  client_email: "firebase-adminsdk-npmog@angle-share.iam.gserviceaccount.com",
  client_id: "103318358621807347318",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-npmog%40angle-share.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const verifyIdToken = async (req, res, next) => {
  try {
    const idToken = req.header("firebase-token");

    if (!idToken)
      return responseLib.UNAUTHORIZED({
        res,
        message: "Please provide firebase token header(firebase-token).",
      });
    // const idToken = "eyJhbGciOiJSUzI1NiIsImtpZCI6ImFlYzU4NjcwNGNhOTZiZDcwMzZiMmYwZDI4MGY5NDlmM2E5NzZkMzgiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiYmhhdnlhIGt1bWJoYW5pIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0w0dE1UMVhGMXZ4bVlVT1YyYjZ3ekVSbE1fdjUzQkdnWEpieW1MN3hLSz1zOTYtYyIsImlzcyI6Imh0dHBzOi8vc2VjdXJldG9rZW4uZ29vZ2xlLmNvbS9hbmdsZS1zaGFyZSIsImF1ZCI6ImFuZ2xlLXNoYXJlIiwiYXV0aF90aW1lIjoxNzA3OTcwOTQzLCJ1c2VyX2lkIjoiVUxld1k0NDhzYlNFVUlWWk5Yd3hUc3B2eVBHMyIsInN1YiI6IlVMZXdZNDQ4c2JTRVVJVlpOWHd4VHNwdnlQRzMiLCJpYXQiOjE3MDc5NzA5NDMsImV4cCI6MTcwNzk3NDU0MywiZW1haWwiOiJiaGF2eWExNDQucmVqb2ljZUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJnb29nbGUuY29tIjpbIjEwMzExMzAwNDY4MjA4NDg5MTI1MSJdLCJlbWFpbCI6WyJiaGF2eWExNDQucmVqb2ljZUBnbWFpbC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJnb29nbGUuY29tIn19.d1v7WIkqnHWuWWvQ8H8T7JWY27gZD6TByZwc_MwrJ-5v8Kaw5UzLEhAenVmzV6bFuu8w7zG5lkCLF7h23UhNwwHPJzmRGKtIwrhz9J74klyDV1ganNu7-p9_EUv_afEfuEh6dfJU-L7obIjH-efm2ipE5aNBW9CK-o1vBu3wSo_NcO6imsJSa4hW1NPH_LHbU89IRie1wcZOYeqs87z-QqOMAua6WG0UfN2R8axeLlTRZC7L859tcb3aIHml9T47i28QqphOj4ZMpyX0YgUZOFQYKCZh_VTpcA0IGEpgIMAQTYycIezdZCm9DGzQg4mHAs_xo-6VZAUfH0pToI0wIQ"

    const decodedToken = await admin.auth().verifyIdToken(idToken);

    if (!decodedToken)
      return responseLib.UNAUTHORIZED({ res, message: "Invalid token." });

    req.body.name = decodedToken?.name.toString();
    req.body.email = decodedToken?.firebase?.identities?.email[0].toString();
    req.body.platform = decodedToken?.firebase?.sign_in_provider?.split(".")[0];
    req.body.isSocialLogin = true;
    req.body.isVerified = true;

    next();
  } catch (error) {
    log.error(error);
    return responseLib.CATCH_ERROR({ res, error: error.message });
  }
};

module.exports = verifyIdToken;
