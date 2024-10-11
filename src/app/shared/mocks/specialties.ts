
import { IEstablishmentSpecialty } from "../models/EstablishmentSpecialty";

export const SPECIALTIES: IEstablishmentSpecialty[] = [
  {
    value: 'BRASILEIRA',
    text: {
      pt: 'Brasileira',
      en: 'Brazilian',
      es: 'Brasileña'
    }
  },
  {
    value: 'MEXICANA',
    text: {
      pt: 'Mexicana',
      en: 'Mexican',
      es: 'Mexicana'
    }
  },
  {
    value: 'JAPONESA',
    text: {
      pt: 'Japonesa',
      en: 'Japanese',
      es: 'Japonesa'
    }
  },
  {
    value: 'CHINESA',
    text: {
      pt: 'Chinesa',
      en: 'Chinese',
      es: 'China'
    }
  },
  {
    value: 'ITALIANA',
    text: {
      pt: 'Italiana',
      en: 'Italian',
      es: 'Italiana'
    }
  },
  {
    value: 'HAVAIANA',
    text: {
      pt: 'Havaiana',
      en: 'Hawaiian',
      es: 'Hawaiana'
    }
  },
  {
    value: 'NENHUMA',
    text: {
      pt: 'Nenhuma',
      en: 'None',
      es: 'Ninguna'
    }
  }
]



export enum EstablishmentSpecialtyEnum {
  BRASILEIRA = 'BRASILEIRA',
  MEXICANA = 'MEXICANA',
  JAPONESA = 'JAPONESA',
  CHINESA = 'CHINESA',
  ITALIANA = 'ITALIANA',
  HAVAIANA = 'HAVAIANA',
  DIVERSAS = 'DIVERSAS'
}
