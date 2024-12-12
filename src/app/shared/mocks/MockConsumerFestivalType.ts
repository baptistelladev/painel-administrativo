import { BenefitConsumerEnum } from "../enums/BenefitConsumer";
import { IFestivalConsumerType } from "../models/IFestivalConsumerType";


export const MOCK_FESTIVAL_CONSUMER_TYPE: IFestivalConsumerType[] = [
  {
    value: BenefitConsumerEnum.POR_PESSOA,
    text: {
      pt: 'Por pessoa',
      en: 'Per person',
      es: 'Por persona'
    }
  },
  {
    value: BenefitConsumerEnum.CRIANCA,
    text: {
      pt: 'Crianças',
      en: 'Child',
      es: 'Niños'
    }
  },
  {
    value: BenefitConsumerEnum.IDOSOS,
    text: {
      pt: 'Idosos',
      en: 'Seniors',
      es: 'Ancianos'
    }
  },
  {
    value: BenefitConsumerEnum.BARIATRICOS,
    text: {
      pt: 'Bariátricos',
      en: 'Bariatric',
      es: 'Bariátricos'
    }
  }
]
