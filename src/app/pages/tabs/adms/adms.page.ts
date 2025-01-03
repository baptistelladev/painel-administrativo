import { Component, OnInit } from '@angular/core';
import { FeaturesEnum } from 'src/app/shared/enums/Features';

@Component({
  selector: 'app-adms',
  templateUrl: './adms.page.html',
  styleUrls: ['./adms.page.scss'],
})
export class AdmsPage implements OnInit {

  public FeaturesEnum = FeaturesEnum;

  constructor() { }

  ngOnInit() {
  }

}
