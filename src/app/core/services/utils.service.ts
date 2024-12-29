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

  private passwordRules: any[] = [
    {
      type: 'has-number',
      text: {
        pt: 'pelo menos 1 número'
      },
      valid: false
    },
    {
      type: 'has-uppercase',
      text: {
        pt: 'pelo menos 1 letra maiúscula'
      },
      valid: false
    },
    {
      type: 'has-lowercase',
      text: {
        pt: 'pelo menos 1 letra minúscula'
      },
      valid: false
    },
    {
      type: 'has-caractere',
      text: {
        pt: 'pelo menos 1 caractere especial (@#%*)'
      },
      valid: false
    },
    {
      type: 'has-min-length',
      text: {
        pt: 'mínimo de 8 dígitos'
      },
      valid: false
    }
  ]

  public getPasswordRules(): any[] {
    return this.passwordRules
  }

  public checkPasswordRules(password: string): any[] {
    const hasNumber = /[0-9]/.test(password);
    const hasCaracter = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasMinLength = password.length >= 8;

    this.passwordRules.forEach((rule) => {
      switch (rule.type) {
        case 'has-number':
          rule.valid = hasNumber
          break;

        case 'has-caractere':
          rule.valid = hasCaracter
          break;

        case 'has-uppercase':
          rule.valid = hasUppercase
          break;

        case 'has-lowercase':
          rule.valid = hasLowercase
          break;

        case 'has-min-length':
          rule.valid = hasMinLength
          break;

        default:
          break;
      }
    })

    return this.passwordRules
  }
}
