import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { collectionData, deleteDoc, Firestore, setDoc} from '@angular/fire/firestore';
import { addDoc, collection, CollectionReference, doc, getDocs, query, QueryConstraint, where } from 'firebase/firestore';
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

  public getSuggestions(
    collectionName: string,
    filters: IFirebaseFilter[] = []
  ): Observable<ISuggestion[]> {
    // Cria a referência da coleção
    const colRef = collection(this.firestore, collectionName) as CollectionReference;

    // Constrói a lista de restrições da consulta
    const queryConstraints: QueryConstraint[] = filters.map(filter =>
      where(filter.field, filter.operator, filter.value)
    );

    // Cria a consulta com todos os filtros
    const q = query(colRef, ...queryConstraints);

    // Converte a `Promise` resultante do `getDocs` em um `Observable`
    return from(getDocs(q).then((querySnapshot) =>
      querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as ISuggestion[]
    ));
  }
}
