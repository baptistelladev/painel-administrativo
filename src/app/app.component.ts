import { Component } from '@angular/core';
import * as moment from 'moment';
import 'moment/locale/fr'
moment.locale('pt')

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor() {

  }
}
