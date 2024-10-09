import { IContact } from "./IContact";
import { ISocialNetwork } from "./Network";

export interface IAppInfo {
  networks: ISocialNetwork[],
  contact: IContact
}
