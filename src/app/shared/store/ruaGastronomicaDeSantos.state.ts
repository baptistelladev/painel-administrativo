import { createAction, createReducer, createSelector, on, props, createFeatureSelector } from "@ngrx/store";
import { IShortEstablishment } from '../models/Establishment';

export interface IRuaGastronomicaDeSantosState {
  currentEstablishment: IShortEstablishment
}

export const ruaGastronomicaDeSantosInitialState: IRuaGastronomicaDeSantosState = {
  currentEstablishment: {
    isBuilding: false,
    id: '',
    name: '',
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
        baseUrl: '',
        user: ''
      }
    ]
  }
}

// ACTIONS
export const setCurrentEstablishment = createAction(
  '[APP] Definir estabelecimento selecionado',
  props<{ establishment: IShortEstablishment }>()
)

export const clearCurrentEstablishment = createAction(
  '[APP] Limpar estabelecimento selecionado'
)

export const ruaGastronomicaDeSantosReducer = createReducer(
  ruaGastronomicaDeSantosInitialState,
  on(
    setCurrentEstablishment,
    (state, { establishment }): IRuaGastronomicaDeSantosState => ({ ...state, currentEstablishment: establishment })
  ),
  on(
    clearCurrentEstablishment,
    (state): IRuaGastronomicaDeSantosState => ({...ruaGastronomicaDeSantosInitialState})
  )
)

// SELETORES
export const selectRuaGastronomicaDeSantosState = createFeatureSelector<IRuaGastronomicaDeSantosState>('ruaGastronomicaDeSantos');

export const selectCurrentEstablishment = createSelector(
  selectRuaGastronomicaDeSantosState,
  (state: IRuaGastronomicaDeSantosState) => state.currentEstablishment
);
