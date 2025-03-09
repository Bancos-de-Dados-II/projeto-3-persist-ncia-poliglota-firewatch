import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";

import serviceAccount from "./firebase-key.json" assert { type: "json" };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = getFirestore();

export default db;

