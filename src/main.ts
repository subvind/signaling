import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { initializeApp } from "firebase-admin/app";

const port = process.env.PORT || 3000
const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG || null) || {
  apiKey: "AIzaSyBFnkIpee766wZ5eV1npZwJpr6AVRpR_KA",
  authDomain: "istrav.firebaseapp.com",
  projectId: "istrav",
  storageBucket: "istrav.appspot.com",
  messagingSenderId: "479255246086",
  appId: "1:479255246086:web:7253f6886c8b7a55075a87",
  measurementId: "G-438HF3486Z"
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  initializeApp(firebaseConfig);

  await app.listen(port);
  console.log('listening on port:', port)
}
bootstrap();
