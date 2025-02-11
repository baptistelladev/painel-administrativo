import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { collection, CollectionReference, doc, getDoc, onSnapshot, orderBy, query, QueryConstraint, updateDoc, where } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { CollectionsEnum } from 'src/app/shared/enums/Collection';
import { IFirebaseFilter } from 'src/app/shared/models/IFirebaseFilter';
import { IUSer } from 'src/app/shared/models/IUser';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private firestore : Firestore) { }

  /**
   * @description Responsável por recuperar todos os usuários.
   * @param collectionName obrigatório do tipo string - nome da coleção no firebase.
   * @param filters obrigatório do tipo IFirebaseFilter[] - representa uma lista com filtros do firebase.
   * @returns um Observable que representa a lista do tipo IUser.
   */
  public getUsersCollection(
    collectionName: string,
    filters: IFirebaseFilter[] = [],
    orderByField: string = '',
    orderDirection: 'asc' | 'desc' = 'asc'
  ): Observable<IUSer[]> {
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

    return new Observable<IUSer[]>(observer => {
      const unsubscribe = onSnapshot(
        q,
        querySnapshot => {
          const data = querySnapshot.docs.map(doc => ({
            ...doc.data()
          })) as IUSer[];

          observer.next(data);
        },
        error => {
          observer.error(error);
        }
      );

      return () => unsubscribe();
    });
  }

  /**
   * @description Responsável por atualizar os dados do usuário.
   * @param docId obrigatório do tipo string - id da conta do usuário.
   * @param userInfo obrigatório do tipo any - dados do usuário.
   * @returns uma promessa do tipo void.
   */
  public async updateUserInfo(docId: string, userInfo: any): Promise<any> {
    try {
      const docRef = doc(this.firestore, CollectionsEnum.USERS, docId);
      await updateDoc(docRef, userInfo);
      const docSnap = await getDoc(docRef);
      return docSnap.data()
    } catch (error) {
      throw error;
    }
  }
}
