import { Injectable } from '@angular/core';
import { addDoc, collection, Firestore } from '@angular/fire/firestore';
import { IParking } from 'src/app/shared/models/IParking';

@Injectable({
  providedIn: 'root'
})
export class ParkingsService {

  constructor(
    private firestore : Firestore
  ) { }

  public async addDoc(collectionName: string, parking: IParking): Promise<any> {
    try {
      const docRef = await addDoc(collection(this.firestore, collectionName), parking);
      console.log("Documento escrito com ID: ", docRef.id);
      return docRef
    } catch (e) {
      console.error("Erro ao adicionar documento: ", e);
    }
  }
}
