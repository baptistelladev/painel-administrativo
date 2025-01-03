import { RolesEnum } from "../enums/Roles";
import { IUserType } from "./IUserType";

export interface IAdmin {
  uid?: string,
  firstName: string,
  role?: IUserType,
  email?: string,
  isAdmin?: boolean
}
