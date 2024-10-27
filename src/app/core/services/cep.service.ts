import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, firstValueFrom, Observable, throwError } from 'rxjs';
import { IAdress } from 'src/app/shared/models/IAddress';

@Injectable({
  providedIn: 'root'
})
export class CepService {

  public BASE_URL = 'https://viacep.com.br/ws';

  constructor(private http : HttpClient) { }

  public getCep(cep: string): Promise<IAdress> {
    return firstValueFrom(this.http.get<IAdress>(`${this.BASE_URL}/${cep}/json/`));
  }
}
