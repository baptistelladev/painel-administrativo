import { IAdmin } from "./IAdmin";

export interface IRequestNewAdmin {
  email: string;
  password: string;
  claims: string;
  adminInfo: IAdmin;
}
