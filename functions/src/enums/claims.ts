export enum ClaimsEnum {
  ADMIN_IS_ONLY_PHELPS = "adminIsOnlyPhelps",
  PREMIUM_USER = "premiumUserClaims",
  DEFAULT = "defaultUserClaims"
}

export const defaultUserClaims = { isPremium: false };
export const premiumUserClaims = { isPremium: true };
export const adminIsOnlyPhelps = { isAdmin: true, birthdate: '04/08/1993', code: 314 };
