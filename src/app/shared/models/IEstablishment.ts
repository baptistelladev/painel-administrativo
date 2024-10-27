import { IEstablishmentSpecialty } from "./IEstablishmentSpecialty"
import { IEstablishmentType } from "./IEstablishmentType"
import { IHour } from "./IHour"
import { ISocialNetwork } from "./INetwork"
import { IPhone } from "./IPhone"
import { IShortTicket } from "./ITicket"
import { ITime } from "./ITime"

export interface IShortEstablishment {
  id: string
  name: string,
  value: string,
  adress: {
    number: string,
    neighborhood: string,
    street: string,
    zip_code: string,
    type: any
  },
  specialty: IEstablishmentSpecialty[],
  mainType: IEstablishmentType,
  market_ticket_info: {
    accept_ticket: boolean,
    show_field: boolean,
    tickets: IShortTicket[]
  },
  ticket_info: {
    accept_ticket: boolean,
    show_field: boolean,
    tickets: IShortTicket[]
  },
  petfriendly_info: {
    accept_petfriendly: boolean,
    show_field: boolean
  },
  livemusic_info: {
    has_livemusic: boolean,
    show_field: boolean
  },
  air_conditioned_info: {
    has_air_conditioned: boolean,
    show_field: boolean
  },
  booking_info: {
    accept_booking: boolean,
    show_field: boolean
  },
  working_time: ITime[],
  phones: IPhone[],
  networks: ISocialNetwork[],
  isBuilding: boolean,
  isPremium: boolean
}

export interface ILongEstablishment {

}
