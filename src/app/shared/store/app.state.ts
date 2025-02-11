import { ISuggestion } from 'src/app/shared/models/ISuggestion';
import { createAction, createReducer, createSelector, on, props, createFeatureSelector } from "@ngrx/store";
import { IPlace } from "../models/IPlace";
import { ISocialNetwork } from "../models/INetwork";
import { IContact } from "../models/IContact";
import { ICity } from '../models/ICity';
import { IUSer } from '../models/IUser';
import { IAdmin } from '../models/IAdmin';

export interface IAppState {
  currentCity: ICity,
  currentPlace: IPlace,
  appInfoNetworks: ISocialNetwork[],
  appInfoContact: IContact,
  currentSuggestion: ISuggestion,
  hasConnection: boolean,
  currentUser: IUSer,
  currentUserCanAccessEighteenContent: boolean,
  currentAdmin: IAdmin
}

export const appInitialState: IAppState = {
  currentCity: {
    value: '',
    name: '',
    sigla: '',
    isDisabled: false,
    from: {
      pt: '',
      en: '',
      es: ''
    },
    in: {
      pt: '',
      en: '',
      es: ''
    },
    hasBeach: false
  },
  currentPlace: {
    last_update: '',
    work_place: [],
    created_at: '',
    suggestions: [],
    isBuilding: false,
    isPremium: false,
    id: '',
    name: '',
    sub_name: '',
    value: '',
    adress: {
      number: '',
      zip_code: '',
      street: '',
      neighborhood: '',
      type: {
        pt: '',
        en: '',
        es: ''
      }
    },
    origin: {
      value: '',
      name: '',
      sigla: '',
      isDisabled: false,
      from: {
        pt: '',
        en: '',
        es: ''
      },
      in: {
        pt: '',
        en: '',
        es: ''
      },
      hasBeach: false
    },
    specialty: [
      {
        value: '',
        text: {
          pt: '',
          en: '',
          es: ''
        }
      }
    ],
    mainType: {
      value: '',
      text: {
        pt: '',
        en: '',
        es: ''
      }
    },
    market_ticket_info: {
      accept_ticket: false,
      show_field: false,
      tickets: [
        {
          text: '',
          value: ''
        }
      ]
    },
    ticket_info: {
      accept_ticket: false,
      show_field: false,
      tickets: [
        {
          text: '',
          value: ''
        }
      ]
    },
    petfriendly_info: {
      accept_petfriendly: false,
      show_field: false
    },
    livemusic_info: {
      has_livemusic: false,
      show_field: false
    },
    air_conditioned_info: {
      has_air_conditioned: false,
      show_field: false
    },
    children_space: {
      has_space: false,
      show_field: false,
      is_paid: false
    },
    booking_info: {
      accept_booking: false,
      show_field: false
    },
    working_time: [
      {
        day_number: 0,
        text: {
          pt: '',
          en: '',
          es: ''
        },
        opening_time: [
          {
            close: '',
            open: ''
          }
        ]
      }
    ],
    phones: [
      {
        type: '',
        number: '',
        ddd: '',
        text: ''
      }
    ],
    networks: [
      {
        text: '',
        value: '',
        appBaseUrl: '',
        baseUrl: '',
        user: ''
      }
    ]
  },
  appInfoNetworks: [
    {
      text: '',
      value: '',
      baseUrl: '',
      appBaseUrl: '',
      user: ''
    }
  ],
  appInfoContact: {
    phone: {
      ddd: '',
      number: ''
    },
    email: {
      text: '',
      value: ''
    }
  },
  currentSuggestion: {
    indication: [],
    specific_place: {
      pt: '',
      en: '',
      es: ''
    },
    filter: [],
    icon: '',
    id: '',
    hashtag: {
      pt: '',
      en: '',
      es: ''
    },
    name: {
      text: {
        pt: '',
        en: '',
        es: ''
      },
      title: {
        pt: '',
        en: '',
        es: ''
      }
    },
    value: '',
    created_at: '',
    updated_at: '',
    route: '',
    address: {
      type: {
        pt: '',
        en: '',
        es: ''
      },
      street: '',
      neighborhood: ''
    }
  },
  hasConnection: true,
  currentUser: {
    firstName: '',
    uid: '',
    email: '',
    createdAt: '',
    lastName: '',
    birthDate: '',
    userType: '',
    sex: '',
    readAndAcceptedTerms: false,
    premiumInfo: {
      isPremium: false
    }
  },
  currentUserCanAccessEighteenContent: true,
  currentAdmin: {
    uid: '',
    firstName: '',
    role: {
      text: {
        pt: '',
        en: '',
        es: ''
      },
      value: ''
    },
    email: '',
    isAdmin: true
  }
}

// ACTIONS
export const setCurrentCity = createAction(
  '[APP] Definir cidade selecionada',
  props<{ city: ICity }>()
)

export const setCurrentEstablishment = createAction(
  '[APP] Definir estabelecimento selecionado',
  props<{ establishment: IPlace }>()
)

export const clearCurrentEstablishment = createAction(
  '[APP] Limpar estabelecimento selecionado'
)

export const setAppInfoNetworks = createAction(
  '[APP] Definir redes sociais/contato do aplicativo',
  props<{ networks: ISocialNetwork[] }>()
)

export const setAppInfoContact = createAction(
  '[APP] Definir formas de contato do app',
  props<{ contact: IContact }>()
)

export const setCurrentSuggestion = createAction(
  '[APP] Definir sugestão selecionada',
  props<{ suggestion: ISuggestion }>()
)

export const setHasConnection = createAction(
  '[APP] Identificar se está com conexão á internet',
  props<{ hasConnection: boolean }>()
)

export const setCurrentUser = createAction(
  '[APP] Definir usuário selecionado',
  props<{ currentUser: IUSer }>()
)

export const setEighteenAccessFromCurrentUser = createAction(
  '[APP] Mostrar que usuário tem acesso á conteúdo +18',
  props<{ canAccessEighteenContent: boolean }>()
)

export const setCurrentAdmin = createAction(
  '[APP] Definir admin selecionado',
  props<{ currentAdmin: IAdmin }>()
)

export const appReducer = createReducer(
  appInitialState,
  on(
    setCurrentCity,
    (state, { city }): IAppState => ({ ...state, currentCity: city })
  ),
  on(
    setCurrentEstablishment,
    (state, { establishment }): IAppState => ({ ...state, currentPlace: establishment })
  ),
  on(
    setAppInfoNetworks,
    (state, { networks }): IAppState => ({ ...state, appInfoNetworks: networks })
  ),
  on(
    setAppInfoContact,
    (state, { contact }): IAppState => ({ ...state, appInfoContact: contact })
  ),
  on(
    setCurrentSuggestion,
    (state, { suggestion }): IAppState => ({ ...state, currentSuggestion: suggestion })
  ),
  on(
    setHasConnection,
    (state, { hasConnection }): IAppState => ({ ...state, hasConnection: hasConnection })
  ),
  on(
    clearCurrentEstablishment,
    (state): IAppState => ({ ...state, currentPlace: appInitialState.currentPlace })
  ),
  on(
    setCurrentUser,
    (state, { currentUser }): IAppState => ({ ...state, currentUser: currentUser })
  ),
  on(
    setEighteenAccessFromCurrentUser,
    (state, { canAccessEighteenContent }): IAppState => ({ ...state, currentUserCanAccessEighteenContent: canAccessEighteenContent })
  ),
  on(
    setCurrentAdmin,
    (state, { currentAdmin }): IAppState => ({ ...state, currentAdmin: currentAdmin })
  )
)

// SELETORES
export const selectAppState = createFeatureSelector<IAppState>('app');

export const selectAppCurrentCity = createSelector(
  selectAppState,
  (state: IAppState) => state.currentCity
);

export const selectCurrentEstablishment = createSelector(
  selectAppState,
  (state: IAppState) => state.currentPlace
);

export const selectAppInfoNetworks = createSelector(
  selectAppState,
  (state: IAppState) => state.appInfoNetworks
);

export const selectAppInfoContact = createSelector(
  selectAppState,
  (state: IAppState) => state.appInfoContact
);

export const selectCurrentSuggestion = createSelector(
  selectAppState,
  (state: IAppState) => state.currentSuggestion
);

export const selectHasConnection = createSelector(
  selectAppState,
  (state: IAppState) => state.hasConnection
);

export const selectCurrentUser = createSelector(
  selectAppState,
  (state: IAppState) => state.currentUser
);

export const selectCurrentAdmin = createSelector(
  selectAppState,
  (state: IAppState) => state.currentAdmin
);

export const selectAccessEighteenContent = createSelector(
  selectAppState,
  (state: IAppState) => state.currentUserCanAccessEighteenContent
);
