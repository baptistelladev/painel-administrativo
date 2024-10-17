import { Injectable } from '@angular/core';
import { collectionData, Firestore, setDoc, updateDoc} from '@angular/fire/firestore';
import { addDoc, collection, doc } from 'firebase/firestore';
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
      establishment.id = docRef.id;
      await setDoc(docRef, establishment, { merge: true });
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

  public async setDoc(collectionName: string, docId: string, establishment: IShortEstablishment): Promise<any> {
    console.log('setDoc chamada com:', collectionName, docId, establishment);
    const docRef = doc(this.firestore, collectionName, docId);

    try {
      await setDoc(docRef, establishment, { merge: true });
      console.log('Documento atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar o documento: ', error);
    }
  }
}
