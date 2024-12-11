import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {

  public textFromSelectedItem: string = 'RUA_GASTRONOMICA_DE_SANTOS';

  public menu: any[] = [
    {
      title: 'Na cidade e na praia',
      text: 'Lugares',
      router: ['/logado/lugares'],
      icon: 'search',
      value: 'PLACES'
    },
    {
      title: 'Sugestão',
      text: 'Rua Gastronômica de Santos',
      router: ['/logado/painel-rua-gastronomica'],
      icon: 'bulb',
      value: 'RUA_GASTRONOMICA_DE_SANTOS'
    }
  ]

  constructor() { }

  ngOnInit() {
  }

}
