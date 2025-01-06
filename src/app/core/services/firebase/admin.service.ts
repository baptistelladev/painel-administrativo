import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { Store } from '@ngrx/store';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { collection, CollectionReference, doc, getDoc, getDocs, onSnapshot, orderBy, query, QueryConstraint, setDoc, updateDoc, where } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { CollectionsEnum } from 'src/app/shared/enums/Collection';
import { IAdmin } from 'src/app/shared/models/IAdmin';
import { IFirebaseFilter } from 'src/app/shared/models/IFirebaseFilter';
import * as UserStore from 'src/app/shared/store/user.state';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(
    private firestore : Firestore,
    private store : Store,
    private auth : Auth
  ) { }

  /**
   * @description Responsável por obter usuário pelo ID único.
   * @param collectionName obrigatório do tipo string - nome da coleção no firebase.
   * @param userCred credenciais geradas ao logar com o usuário.
   * @returns uma promessa do tipo boolean.
   */
  public async getUserByUID(
    collectionName: string,
    userCred: any
  ): Promise<boolean> {
    try {
      const collectionRef = collection(this.firestore, collectionName);
      let queryConstraints: QueryConstraint[] = [where('uid', '==', userCred.uid)];

      const q = query(collectionRef, ...queryConstraints);
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docData = querySnapshot.docs[0].data() as IAdmin; // Pega o primeiro documento válido
        await this.dispatchUser(docData);
        await this.dispatchUserEmail(userCred.email);
        return true;
      } else {
        console.warn('Acesso restrito');
        return false;
      }
    } catch (error) {
      console.error('Erro ao buscar dados no Firestore:', error);
      return false;
    }
  }

  /**
   * @description Responsável disparar as informações do usuário via ngrx para refletir no app inteiro.
   * @param user obrigatório do tipo IUser - representa as informações do usuário.
   * @returns uma promessa do tipo void.
   */
  private dispatchUser(user: IAdmin): Promise<void> {
    return new Promise((resolve) => {
      this.store.dispatch(UserStore.setUser({ user }));
      resolve();
    });
  }

  /**
   * @description Responsável disparar as informações DE EMAIL do usuário via ngrx para refletir no app inteiro.
   * @param user obrigatório do tipo IUser - representa as informações do usuário.
   * @returns uma promessa do tipo void.
   */
  private dispatchUserEmail(email: string): Promise<void> {
    return new Promise((resolve) => {
      this.store.dispatch(UserStore.setUserEmail({ email: email }));
      resolve();
    });
  }

  /**
   * @description Responsável por recuperar todos os usuários.
   * @param collectionName obrigatório do tipo string - nome da coleção no firebase.
   * @param filters obrigatório do tipo IFirebaseFilter[] - representa uma lista com filtros do firebase.
   * @returns um Observable que representa a lista do tipo IUser.
   */
  public getAdminCollection(
    collectionName: string,
    filters: IFirebaseFilter[] = [],
    orderByField: string = '',
    orderDirection: 'asc' | 'desc' = 'asc'
  ): Observable<IAdmin[]> {
    const colRef = collection(this.firestore, collectionName) as CollectionReference;

    const queryConstraints: QueryConstraint[] = filters.map(filter =>
      where(filter.field, filter.operator, filter.value)
    );

    if (orderByField) {
      const hasOrderBy = queryConstraints.some(constraint => constraint instanceof QueryConstraint && constraint.type === 'orderBy');

      if (!hasOrderBy) {
        queryConstraints.push(orderBy(orderByField, orderDirection));
      }
    }

    const q = query(colRef, ...queryConstraints);

    return new Observable<IAdmin[]>(observer => {
      const unsubscribe = onSnapshot(
        q,
        querySnapshot => {
          const data = querySnapshot.docs.map(doc => ({
            ...doc.data()
          })) as IAdmin[];

          observer.next(data);
        },
        error => {
          observer.error(error);
        }
      );

      return () => unsubscribe();
    });
  }

  public async createUserWithEmailAndPassword(email: string, password: string, userInfo: IAdmin ): Promise<any> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(this.firestore, CollectionsEnum.ADMINS, user.uid), {
        uid: user.uid,
        ...userInfo
      })

      await sendEmailVerification(user);

      return user
    } catch (error) {
      const errorMessage = this.getFirebaseErrorMessage(error);
      throw errorMessage;
    }
  }

  private getFirebaseErrorMessage(error: any): any {

    let errorObj: { text: any, error: any } = { text: null, error: error };

    switch (error.code) {
      case 'auth/email-already-in-use':
        return errorObj = {
          error: error,
          text: {
            pt: 'O e-mail informado já está sendo usado',
            en: 'The email provided is already in use',
            es: 'El correo electrónico proporcionado ya está en uso'
          }
        }
      case 'auth/invalid-email':
        return errorObj = {
          error: error,
          text: {
            pt: 'O e-mail fornecido é inválido',
            en: 'The provided email is invalid',
            es: 'El correo electrónico proporcionado es inválido'
          }
        }
      case 'auth/weak-password':
        return errorObj = {
          error: error,
          text: {
            pt: 'A senha deve ter pelo menos 6 caracteres',
            en: 'The password must be at least 6 characters long',
            es: 'La contraseña debe tener al menos 6 caracteres'
          }
        }
      case 'auth/invalid-credential':
        return errorObj = {
          error: error,
          text: {
            pt: 'E-mail ou senha inválido',
            en: 'Invalid email or password',
            es: 'Correo electrónico o contraseña inválido'
          }
        }
      default:
        return errorObj = {
          error: error,
          text: {
            pt: 'Erro desconhecido. Tente novamente mais tarde',
            en: 'Unknown error. Please try again later',
            es: 'Error desconocido. Intente de nuevo más tarde'
          }
        }
    }
  }
}
