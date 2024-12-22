import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { collectionData, deleteDoc, Firestore, setDoc} from '@angular/fire/firestore';
import { addDoc, collection, CollectionReference, doc, getDocs, onSnapshot, query, QueryConstraint, where } from 'firebase/firestore';
import { from, Observable } from 'rxjs';
import { IPlace } from 'src/app/shared/models/IPlace';
import { IFirebaseFilter } from 'src/app/shared/models/IFirebaseFilter';
import { ISuggestion } from 'src/app/shared/models/ISuggestion';

@Injectable({
  providedIn: 'root'
})
export class SuggestionsService {

  constructor(
    private firestore : Firestore
  ) { }

  /**
   * @description Responsável por recuperar as todas as sugestões.
   * @param collectionName obrigatório do tipo string - nome da coleção no firebase.
   * @param filters obrigatório do tipo IFirebaseFilter[] - representa uma lista com filtros do firebase.
   * @returns um Observable que representa a lista do tipo ISuggestion.
   */
  public getSuggestions(
    collectionName: string,
    filters: IFirebaseFilter[] = []
  ): Observable<ISuggestion[]> {
    const colRef = collection(this.firestore, collectionName) as CollectionReference;

    const queryConstraints: QueryConstraint[] = filters.map(filter =>
      where(filter.field, filter.operator, filter.value)
    );

    const q = query(colRef, ...queryConstraints);

    return new Observable<ISuggestion[]>(observer => {
      const unsubscribe = onSnapshot(
        q,
        querySnapshot => {
          const data = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as ISuggestion[];
          observer.next(data);
        },
        error => {
          observer.error(error);
        }
      );

      // Cleanup: remove o listener quando o Observable for cancelado
      return () => unsubscribe();
    });
  }


  /**
   * @description Responsável por adicionar uma sugestão no banco.
   * @param collectionName obrigatório do tipo string - nome da coleção no firebase.
   * @param suggestion obrigatório do tipo ISuggestion - representa um objeto com as informações da sugestão.
   * @returns uma promessa que pode ser qualquer coisa, um erro ou ou o documento.
   */
  public async addSuggestionDoc(
    collectionName: string,
    suggestion: ISuggestion
  ): Promise<any> {
    try {
      const docRef = await addDoc(collection(this.firestore, collectionName), suggestion);

      suggestion.id = docRef.id;

      await setDoc(docRef, suggestion, { merge: true });

      return true
    } catch (e) {
      return false
    }
  }

  /**
   * @description Responsável por atualizar uma sugestão no banco.
   * @param collectionName obrigatório do tipo string - nome da coleção no firebase.
   * @param docId obrigatório do tipo string - representa o ID da sugestão.
   * @param suggestion obrigatório do tipo ISuggestion - representa um objeto com as informações da sugestão.
   * @returns uma promessa que pode ser qualquer coisa, um erro ou ou o documento.
   */
  public async setDoc(
    collectionName: string,
    docId: string,
    suggestion: ISuggestion
  ): Promise<any> {
    const docRef = doc(this.firestore, collectionName, docId);

    try {
      await setDoc(docRef, suggestion, { merge: true });
    } catch (error) {
      return error
    }
  }

  /**
   * @description Responsável por remover uma sugestão.
   * @param collectionName obrigatório do tipo string - nome da coleção no firebase.
   * @param docId obrigatório do tipo string - representa o ID da sugestão.
   * @returns uma promessa que pode ser qualquer coisa, um erro ou ou o documento.
   */
  public async removeDoc(
    collectionName: string,
    docId: string
  ): Promise<any> {
    const docRef = doc(this.firestore, collectionName, docId);

    try {
      await deleteDoc(docRef);
      return true
    } catch (error) {
      return false
    }
  }
}
