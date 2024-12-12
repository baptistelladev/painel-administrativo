import { FestivalFoodTypeEnum } from "../enums/FestivalFoodType";
import { IFestivalFoodType } from "../models/IFestivalFoodType";

export const MOCK_FESTIVAL_FOOD_TYPE: IFestivalFoodType[] = [
  {
    value: FestivalFoodTypeEnum.COMIDA_JAPONESA,
    text: {
      pt: 'Comida japonesa',
      en: 'Japanese food',
      es: 'Comiueda japonius'
    }
  },
  {
    value: FestivalFoodTypeEnum.COMIDA_MEXICANA,
    text: {
      pt: 'Comida mexicana',
      en: 'Mexicana food',
      es: 'Comiueda mexicana'
    }
  },
  {
    value: FestivalFoodTypeEnum.CHURRASCO,
    text: {
      pt: 'Churrasco',
      en: 'Churrasco',
      es: 'Churrasco'
    }
  }
]
