import { Component, OnInit } from '@angular/core';
import { FeaturesEnum } from 'src/app/shared/enums/Features';
import { SuggestionsEnum } from 'src/app/shared/enums/Suggestions';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {

  public textFromSelectedItem: string = '';

  public menu: {
    title: string,
    text: string,
    router: string[],
    icon: string,
    value: string,
    isDisabled: boolean
  }[] = [
    /**{
      title: 'Admnistração',
      text: 'Dashboard',
      router: ['/logado/dashboard'],
      icon: 'grid',
      value: 'DASHBOARD',
      isDisabled: false
    },**/
    {
      title: 'No sistema',
      text: 'Usuários',
      router: ['/logado/usuarios'],
      icon: 'people-circle',
      value: FeaturesEnum.USUARIOS,
      isDisabled: false
    },
    {
      title: 'Na cidade e na praia',
      text: 'Lugares',
      router: ['/logado/lugares'],
      icon: 'storefront',
      value: FeaturesEnum.LUGARES,
      isDisabled: false
    },
     /**{
      title: 'Na cidade e na praia',
      text: 'Pessoas',
      router: ['/logado/pessoas'],
      icon: 'man',
      value: FeaturesEnum.PESSOAS,
      isDisabled: true
    },**/
    {
      title: 'Na Baixada Santista',
      text: 'Dicas',
      router: ['/logado/sugestoes-do-anfitriao'],
      icon: 'bulb',
      value: FeaturesEnum.SUGESTOES,
      isDisabled: false
    }
  ]

  constructor() { }

  ngOnInit() {
  }

}
