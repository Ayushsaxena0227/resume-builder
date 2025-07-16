const admin = require("firebase-admin");

let serviceAccount;

// For production deployment, use environment variable
if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
} else {
  // For local development, create a dummy service account to avoid the error
  // This should never run in production if env var is set correctly
  serviceAccount = {
    type: "service_account",
    project_id: "resume-builder-fdabc",
    private_key_id: "40da2fe16aa473854400d3878f369820b03765da",
    private_key:
      "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDVAH1wvZPZTCcu\niA+1e4q4Y8h3PYzCKNV5RNoFfFarWi4Gm3O9EIuU0QVbRRF8iyMk5CWQWnkT4zZi\nzdj9ypMs8wcQNN5inWB7dwTF2Wh3XFW8eGAENt0E6Lyqy2yQ4YVUYbqGTFFAFF98\n0xWsWnqv+g0EehViidyim5StDwX8L4bQ6hQ/9YgilaYBTUWcaFnlYvSlBKDKy4Ey\niJUUNrJbCUuqNaw8gbt+Cu3g2fHUP0GsxJP6rcfqiZMekhJG0vzr2nnKYVchLtmF\nxm8fhm5jXzvaMDjK1hXgJ3r/B8QvyM5rR066Z4wISAwiatOHnMsse3/LUIAa0e85\nr7IOF87rAgMBAAECggEACXqamnxNSpPJgJgcftqPG1KRdsD99RwFF/745tqYLsr2\nFmQvm9/THl3I671goFa+yyL+CvUDw19Oqcn4WJ79urfb/hwkM2ZGh2gOBdH9hKZO\nyHLg7v8UCeZjkwQ3giEPImiw+M4HpZ7ievcX1VI3eIJbtvHJ5tc0wuXCkYsEHKtZ\n8yCYaxz0DpVX9nb8JOXRZQZfhgIHD5bUXl+CKLHJfvVY4gMRaBqbKvhn8X9Lqw4g\njjd6/Pnrzu7ieoqExOGU9g7Ea/bWukbMConArdomUlFgP5tUv+MowThl1FdeEYu9\nuxhaj8SP8PrfT04eZGs1gElETZD5FkDRIhO/Zr+dWQKBgQD57i991EJ/Ypl8Ad8k\nJ1vtMnWhw9kcqAw6oYPpXwRxxm0Tx428F1gejcPJFfOVqDfpk0FvuMaxPxUv60NC\nZRYepBPBeulIWc7bpr0M0WLX3yqxk7uuyR/iiVyCovFKKo8oN0NNgLzf/mfXBocK\nruouDD1uYvmz0Ly0eyRbNnVKowKBgQDaLLhu2+7LhcxHKAgJgSo+MPNVCmBlOmmc\nCv6RRO9Zk0NyROHVci9tIznD8JQv0Gh1hLphAKYb5714GQTghjM0a7Nd99hgIy/c\nwAaZmF54f+5E7u9lE9h2+zqHlwMsej92SqeP+6RKNUD0nx8xHyEhn/pAu9WIo0Wx\nKf49kCO3GQKBgQD4rAO2x9XuFvWty9LwjvTJGdauwEWqXI3mXEP6lB7A8XQgJQIh\n7nwv0k/GKMA23KvdDDYkag3P13tGNWezjQ6oKAq8DIZGBY1rQQiC02bscNBy5RHt\ng5Hk/VT9ahB4AcZ0dh/R4lCK8f7xlD4S5Bx++pC432OhhQPs80UmOBYVzwKBgB4c\nb/P07LcwJypm7v0I06CzttG01esCrdK4fbvk7LfLKFLcCOMhmEQSyYUubfVPaStW\n/zYmFcbiK/coVND8FJMWjjHY5AcYtCFea0rFibxNw7/Fzkp/+68oK0LNZ8W6tYmI\n8ilgDKOlR+q7D14DMtpmLu7CPc1W42Z5Kjqq6xL5AoGBAIKmfSzz0IwUTAP1fo6x\nxFpHdchHIa2YivqtRRdte2dMbJrELqV2UqLoptQBKwwyJ+yRzhrZw6iY1bhR9cD7\nY7i43zAjhkY/QAuUCxK/BNAo5zkVDuw/XUhXLwfONuDb5OVyoIHFLr2OUDbeWR4J\nOJE0r8k3ssKAqGykyNBwEeEk\n-----END PRIVATE KEY-----\n",
    client_email:
      "firebase-adminsdk-fbsvc@resume-builder-fdabc.iam.gserviceaccount.com",
    client_id: "109492785088583566308",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url:
      "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40resume-builder-fdabc.iam.gserviceaccount.com",
    universe_domain: "googleapis.com",
  };
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

module.exports = { admin, db };
