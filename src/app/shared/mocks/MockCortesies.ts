
import { CourtesyEnum } from "../enums/Courtesy";
import { ICourtesy } from "../models/ICourtesy";

export const MOCK_COURTESIES: ICourtesy[] = [
  {
    value: CourtesyEnum.SOBREMESA,
    text: {
      pt: 'Sobremesa',
      en: 'Dessert',
      es: 'Postre'
    }
  },
  {
    value: CourtesyEnum.SORVETE,
    text: {
      pt: 'Sorvete',
      en: 'Ice cream',
      es: 'Helado'
    }
  },
  {
    value: CourtesyEnum.BRIGADEIRO,
    text: {
      pt: 'Brigadeiro',
      en: 'Brigadeiro',
      es: 'Brigadeiro'
    }
  },
  {
    value: CourtesyEnum.REFRIGERANTE,
    text: {
      pt: 'Refrigerante',
      en: 'Soda',
      es: 'Refresco'
    }
  }
]

