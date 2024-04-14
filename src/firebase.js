// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { ApiKey, AppId, MessegingSendingId, StorageBucket, AuthDomain, ProjectId } from "./config"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: ApiKey,
  authDomain: AuthDomain,
  projectId: ProjectId,
  storageBucket: StorageBucket,
  messagingSenderId: MessegingSendingId,
  appId: AppId
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);