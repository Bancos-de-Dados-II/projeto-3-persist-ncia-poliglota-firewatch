import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import dotenv from 'dotenv'
dotenv.config();

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = getFirestore();

export default db;

