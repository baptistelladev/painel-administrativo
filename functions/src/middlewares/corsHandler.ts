import * as cors from 'cors';
export const corsHandler = cors.default({
  origin: [
    'https://admin.anfitrionapp.com.br',
    'https://anfitrion-management.web.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
});
