import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RegisterShortEstablishmentModalComponent } from './register-short-establishment-modal.component';

describe('RegisterShortEstablishmentModalComponent', () => {
  let component: RegisterShortEstablishmentModalComponent;
  let fixture: ComponentFixture<RegisterShortEstablishmentModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterShortEstablishmentModalComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterShortEstablishmentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
