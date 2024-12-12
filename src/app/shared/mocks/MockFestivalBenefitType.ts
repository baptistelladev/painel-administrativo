import { BenefitConsumerEnum } from "../enums/BenefitConsumer";
import { BenefitTypeEnum } from "../enums/BenefitType";
import { IFestivalBenefitType } from "../models/IFestivalBenefiType";

export const MOCK_FESTIVAL_BENEFIT_TYPE: IFestivalBenefitType[] = [
  {
    value: BenefitTypeEnum.GRATIS,
    text: {
      pt: 'grátis',
      en: 'free',
      es: 'gratis'
    }
  },
  {
    value: BenefitTypeEnum.INTEGRAL,
    text: {
      pt: 'integral',
      en: 'full',
      es: 'integral'
    }
  },
  {
    value: BenefitTypeEnum.MEIA,
    text: {
      pt: 'meia',
      en: 'half',
      es: 'mitad'
    }
  },
  {
    value: BenefitTypeEnum.OFF,
    text: {
      pt: 'off',
      en: 'off',
      es: 'off'
    }
  },
  {
    value: BenefitTypeEnum.SEM_BENEFICIO,
    text: {
      pt: 'Sem benefício',
      en: 'No benefit',
      es: 'Sin beneficio'
    }
  }
]
