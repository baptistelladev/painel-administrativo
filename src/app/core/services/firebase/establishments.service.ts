import { Injectable } from '@angular/core';
import { collectionData, Firestore} from '@angular/fire/firestore';
import { addDoc, collection } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { IShortEstablishment } from 'src/app/shared/models/Establishment';

@Injectable({
  providedIn: 'root'
})
export class EstablishmentsService {

  constructor(
    private firestore : Firestore
  ) { }

  public async addDoc(collectionName: string, establishment: IShortEstablishment): Promise<any> {
    try {
      const docRef = await addDoc(collection(this.firestore, collectionName), establishment)
      console.log("Documento escrito com ID: ", docRef.id);
      return docRef
    } catch (e) {
      console.error("Erro ao adicionar documento: ", e);
    }
  }

  public getCollection(collectionName: string): Observable<IShortEstablishment[]> {
    const itemCollection = collection(this.firestore, collectionName);
    return collectionData<any>(itemCollection);
  }
}
