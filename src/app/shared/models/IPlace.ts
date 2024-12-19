import { IPlaceSpecialty } from "./IPlaceSpecialty"
import { IPlaceType } from "./IPlaceType"
import { ISocialNetwork } from "./INetwork"
import { IPhone } from "./IPhone"
import { ITicket } from "./ITicket"
import { ITime } from "./ITime"
import { ICity } from "./ICity"
import { IBeach } from "./IBeach"
import { IFestivalFood } from "./IFestivalFood"

export interface IPlace {
  id: string
  name: string,
  sub_name: string,
  value: string,
  adress: {
    number: string,
    neighborhood: string,
    street: string,
    zip_code: string,
    type: any
  },
  origin: ICity,
  specialty: IPlaceSpecialty[],
  mainType: IPlaceType,
  market_ticket_info: {
    accept_ticket: boolean,
    show_field: boolean,
    tickets: ITicket[]
  },
  ticket_info: {
    accept_ticket: boolean,
    show_field: boolean,
    tickets: ITicket[]
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
  isPremium: boolean,
  suggestions: string[],
  created_at: string,
  children_space: {
    has_space: boolean,
    show_field: boolean,
    is_paid: boolean
  },
  work_place: string[],
  beachInfo?: IBeach, // PARA PRAIAS
  mainBeach?: string, // PARA PRAIAS
  delivery_sand?: { // PARA PRAIAS
    make_delivery?: boolean,
    delivery_is_free?: boolean
  },
  festival_info?: { // PARA RESTAURANTES COM FESTIVAL
    has_any_festival_type?: boolean,
    show_field?: boolean,
    festivals?: IFestivalFood[]
  },
  last_update: string
}
