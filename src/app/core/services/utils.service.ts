import { Injectable } from '@angular/core';
import { IPlace } from 'src/app/shared/models/IPlace';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  public async orderByAdressNumberCrescent(establishments: IPlace[]) {
    return establishments.sort((a, b) => {
        // Converter o número do endereço para inteiro para comparação
        const numeroA = parseInt(a.adress.number);
        const numeroB = parseInt(b.adress.number);

        return numeroA - numeroB;
    })
  }

  public async orderByAdressNumberDecrescent(establishments: IPlace[]) {
    return establishments.sort((a, b) => {
        // Converter o número do endereço para inteiro para comparação
        const numeroA = parseInt(a.adress.number);
        const numeroB = parseInt(b.adress.number);

        return numeroB - numeroA;
    })
  }
}
