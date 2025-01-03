import { UserTypeEnum } from "../enums/UserType";
import { IUserType } from "src/app/shared/models/IUserType";

export const MOCK_USER_TYPES: IUserType[] = [
  {
    text: {
      pt: "Administrador",
      en: "Admin",
      es: "Adm"
    },
    value: UserTypeEnum.ADMINISTRADOR
  },
  {
    text: {
      pt: "Morador",
      en: "Resident",
      es: "Residente"
    },
    value: UserTypeEnum.MORADOR
  },
  {
    text: {
      pt: "Turista",
      en: "Tourist",
      es: "Turista"
    },
    value: UserTypeEnum.TURISTA
  }
]
