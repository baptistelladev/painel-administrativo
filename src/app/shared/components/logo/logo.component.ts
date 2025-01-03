import { Component, Input, OnInit } from '@angular/core';
import { ILang } from 'src/app/shared/models/ILang';

@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss'],
})
export class LogoComponent  implements OnInit {

  @Input() asLink: boolean = false;
  @Input() route: string | string[];

  @Input() size: string;

  constructor(

  ) { }

  ngOnInit() {}

}
