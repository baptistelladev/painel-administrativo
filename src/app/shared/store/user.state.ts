import { createAction, createFeatureSelector, createReducer, createSelector, on, props } from "@ngrx/store"
import { IAdmin } from "../models/IAdmin"
import { RolesEnum } from "../enums/Roles"
import { IUserType } from "../models/IUserType"

export interface IUserState {
  user: IAdmin
}

export const userInitialState: IUserState = {
  user: {
    firstName: '',
    uid: '',
    email: '',
    role: {
      value: '',
      text: {
        pt: '',
        en: '',
        es: ''
      }
    }
  }
}

// ACTIONS
export const setUser = createAction(
  '[USER] Definir usuário logado',
  props<{ user: IAdmin }>()
)

export const setUserEmail = createAction(
  '[USER] Definir email do usuário logado',
  props<{ email: string }>()
)
// AO ATUALIZAR OS DADOS DO USUÁRIO, DEVEMOS RECUPERAR DO BANCO E ATUALIZAR NO NGRX MAS SOMENTE AS PROPRIEDADES QUE EXISTEM NO BANCO E QUE PODEM SER ALTERADOS.
export const updateUserJustMainInfo = createAction(
  '[USER] Atualiza o user mas somente as propriedades do banco',
  props<{ userJustMainInfo: { firstName: string, role: IUserType }  }>()
)

export const userReducer = createReducer(
  userInitialState,
  on(
    setUser,
    (state, { user }): IUserState => ({ ...state, user: user })
  ),
  on(
    setUserEmail,
    (state, { email }): IUserState => ({ ...state, user: { ...state.user, email: email }  })
  ),
  on(
    updateUserJustMainInfo,
    (state, { userJustMainInfo }): IUserState => ({
      ...state,
      user: {
        ...state.user,
        firstName: userJustMainInfo.firstName,
        role: userJustMainInfo.role
      }
    })
  )
)

// SELETORES
export const selectUserState = createFeatureSelector<IUserState>('user');

export const selectUser = createSelector(
  selectUserState,
  (state: IUserState) => state.user
);
