import { BenefitOperatorsEnum } from "../enums/BenefitOperators";
import { IFestivalOperator } from "../models/IFestivalOperator";

export const MOCK_FESTIVAL_OPERATOR: IFestivalOperator[] = [
  {
    value: BenefitOperatorsEnum.ATE,
    text: {
      pt: 'até',
      en: 'up to',
      es: 'hasta'
    }
  },
  {
    value: BenefitOperatorsEnum.ENTRE,
    text: {
      pt: 'entre',
      en: 'between',
      es: 'entre'
    }
  },
  {
    value: BenefitOperatorsEnum.ACIMA,
    text: {
      pt: 'acima de',
      en: 'over',
      es: 'mayores de'
    }
  },
  {
    value: BenefitOperatorsEnum.IGUAL,
    text: {
      pt: 'com',
      en: 'with',
      es: 'con'
    }
  }
]
