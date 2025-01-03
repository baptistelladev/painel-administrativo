import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-made-w-love',
  templateUrl: './made-w-love.component.html',
  styleUrls: ['./made-w-love.component.scss'],
})
export class MadeWLoveComponent  implements OnInit {

  @Input() color: string = 'gray-text';

  @Input() centered: boolean;
  @Input() alwaysCentered: boolean;
  @Input() weightThin: boolean;

  constructor() { }

  ngOnInit() {}

}
