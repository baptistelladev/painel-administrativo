import { Injectable } from '@angular/core';
import { deleteDoc, Firestore, setDoc} from '@angular/fire/firestore';
import { addDoc, collection, CollectionReference, doc, onSnapshot, orderBy, query, QueryConstraint, where } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { IPlace } from 'src/app/shared/models/IPlace';
import { IFirebaseFilter } from 'src/app/shared/models/IFirebaseFilter';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  constructor(
    private firestore : Firestore
  ) { }

  /**
   * @description Responsável por adicionar um lugar no banco.
   * @param collectionName obrigatório do tipo string - nome da coleção no firebase.
   * @param establishment obrigatório do tipo IPlace - representa um objeto com as informações do lugar.
   * @returns uma promessa que pode ser qualquer coisa, um erro ou ou o documento.
   */
  public async addPlaceDoc(
    collectionName: string, establishment: IPlace
  ): Promise<any> {
    try {
      const docRef = await addDoc(collection(this.firestore, collectionName), establishment);
      establishment.id = docRef.id;
      await setDoc(docRef, establishment, { merge: true });
      return docRef
    } catch (error: any) {
      return error
    }
  }

  /**
   * @description Responsável por atualizar um lugar no banco.
   * @param collectionName obrigatório do tipo string - nome da coleção no firebase.
   * @param docId obrigatório do tipo string - representa o ID do lugar.
   * @param establishment obrigatório do tipo ISugIPlacegestion - representa um objeto com as informações da lugar.
   * @returns uma promessa que pode ser qualquer coisa, um erro ou ou o documento.
   */
  public async setPlaceDoc(
    collectionName: string,
    docId: string,
    establishment: IPlace
  ): Promise<any> {
    const docRef = doc(this.firestore, collectionName, docId);

    try {
      await setDoc(docRef, establishment, { merge: true });
    } catch (error) {
      return error
    }
  }

  /**
   * @description Responsável por remover um lugar.
   * @param collectionName obrigatório do tipo string - nome da coleção no firebase.
   * @param docId obrigatório do tipo string - representa o ID do lugar.
   * @returns uma promessa que pode ser qualquer coisa, um erro ou ou o documento.
   */
  public async removePlaceDoc(
    collectionName: string,
    docId: string
  ) {
    const docRef = doc(this.firestore, collectionName, docId);

    try {
      await deleteDoc(docRef);
      console.log('Documento removido com sucesso!');
    } catch (error) {
      console.error('Erro ao remover documento: ', error);
    }
  }

  /**
   * @description Responsável por recuperar todos os lugares.
   * @param collectionName obrigatório do tipo string - nome da coleção no firebase.
   * @param filters obrigatório do tipo IFirebaseFilter[] - representa uma lista com filtros do firebase.
   * @returns um Observable que representa a lista do tipo ISuggestion.
   */
  public getPlacesCollection(
    collectionName: string,
    filters: IFirebaseFilter[] = [],
    orderByField: string = '',
    orderDirection: 'asc' | 'desc' = 'asc'
  ): Observable<IPlace[]> {
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

    return new Observable<IPlace[]>(observer => {
      const unsubscribe = onSnapshot(
        q,
        querySnapshot => {
          const data = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as IPlace[];

          observer.next(data);
        },
        error => {
          observer.error(error);
        }
      );

      return () => unsubscribe();
    });
  }
}
