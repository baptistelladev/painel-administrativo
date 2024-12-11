import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { collectionData, deleteDoc, Firestore, setDoc} from '@angular/fire/firestore';
import { addDoc, collection, CollectionReference, doc, getDocs, orderBy, query, QueryConstraint, where } from 'firebase/firestore';
import { from, Observable } from 'rxjs';
import { IPlace } from 'src/app/shared/models/IPlace';
import { IFirebaseFilter } from 'src/app/shared/models/IFirebaseFilter';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  constructor(
    private firestore : Firestore
  ) { }

  public async addDoc(collectionName: string, establishment: IPlace): Promise<any> {
    try {
      const docRef = await addDoc(collection(this.firestore, collectionName), establishment)
      establishment.id = docRef.id;
      await setDoc(docRef, establishment, { merge: true });
      console.log("Documento escrito com ID: ", docRef.id);
      return docRef
    } catch (e) {
      console.error("Erro ao adicionar documento: ", e);
    }
  }

  public async setDoc(collectionName: string, docId: string, establishment: IPlace): Promise<any> {
    console.log('setDoc chamada com:', collectionName, docId, establishment);
    const docRef = doc(this.firestore, collectionName, docId);

    try {
      await setDoc(docRef, establishment, { merge: true });
      console.log('Documento atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar o documento: ', error);
    }
  }

  public async removeDoc(collectionName: string, docId: string) {

    const docRef = doc(this.firestore, collectionName, docId);

    try {
      await deleteDoc(docRef);
      console.log('Documento removido com sucesso!');
    } catch (error) {
      console.error('Erro ao remover documento: ', error);
    }
  }

  public getCollection(
    collectionName: string,
    filters: IFirebaseFilter[] = [],
    orderByField: string = '',
    orderDirection: 'asc' | 'desc' = 'asc'
  ): Observable<any[]> {
    // Cria a referência da coleção
    const colRef = collection(this.firestore, collectionName) as CollectionReference;

    // Constrói a lista de restrições da consulta
    const queryConstraints: QueryConstraint[] = filters.map(filter =>
      where(filter.field, filter.operator, filter.value)
    );

    if (orderByField) {
      // Verifica se a consulta já possui um orderBy
      const hasOrderBy = queryConstraints.some(constraint => constraint instanceof QueryConstraint && constraint.type === 'orderBy');

      if (!hasOrderBy) {
        queryConstraints.push(orderBy(orderByField, orderDirection));
      }
    }

    // Cria a consulta com todos os filtros
    const q = query(colRef, ...queryConstraints);

    // Converte a `Promise` resultante do `getDocs` em um `Observable`
    return from(getDocs(q).then(querySnapshot =>
      querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as IPlace[]
    ));
  }
}
