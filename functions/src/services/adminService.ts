// services/adminService.ts
import * as admin from 'firebase-admin';
import { ClaimsEnum, adminIsOnlyPhelps, premiumUserClaims, defaultUserClaims } from '../enums/claims';
import { IAdmin } from '../models/IAdmin';
import { CollectionsEnum } from '../enums/Collection';

export const createNewAdminService = async (email: string, password: string, claims: ClaimsEnum, adminInfo: IAdmin) => {
  try {
    // PASSO 1: CRIAR O USUÁRIO.
    const user = await admin.auth().createUser({ email, password });

    // PASSO 2: DEFINIR OS CLAIMS PERSONALIZADOS.
    let customClaims: any;

    switch (claims) {
      case ClaimsEnum.ADMIN_IS_ONLY_PHELPS:
        customClaims = adminIsOnlyPhelps;
        break;
      case ClaimsEnum.PREMIUM_USER:
        customClaims = premiumUserClaims;
        break;
      default:
        customClaims = defaultUserClaims;
        break;
    }

    await admin.auth().setCustomUserClaims(user.uid, customClaims);

    // PASSO 3: ADICIONAR O USUÁRIO NA COLEÇÃO "ADMINS" NO FIRESTORE.
    const newAdmin: IAdmin = {
      firstName: adminInfo.firstName,
      uid: user.uid,
      email: user.email,
      role: adminInfo.role
    };

    await admin.firestore().collection(CollectionsEnum.ADMINS).doc(user.uid).set(newAdmin);

    return { uid: user.uid, claims: customClaims };
  } catch (error) {
    // TRATAMENTO DE ERRO
    console.error('ERRO AO CRIAR E ADICIONAR USUÁRIO:', error);
    throw error; // LANÇAR O ERRO PARA TRATAMENTO POSTERIOR
  }
};
