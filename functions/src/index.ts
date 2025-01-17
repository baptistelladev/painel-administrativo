// Usando 'require' para o firebase-functions
const admin = require('firebase-admin');
const functions = require('firebase-functions/v2/https');
import * as express from 'express';
import { corsHandler } from './middlewares/corsHandler';
import * as userRoutes from './routes/adminRoutes';
import { FirebaseRegionsEnum } from './enums/regions';

const app = express.default();

// INICIALIZANDO FIREBASE ADMIN SDK.
admin.initializeApp();

app.use(corsHandler);  // USANDO O MIDDLEWARE DO CORS.
app.use(express.json()); // PARA ENTENDER JSON NO CORPO DA REQUISIÇÃO.

app.use('/api', userRoutes.default);  // DEFINIDO ROTAS.

export const api = functions.onRequest({ region: FirebaseRegionsEnum.SOUTHAMERICA_EAST1 }, app);
