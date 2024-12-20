import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FestivalDeComidaJaponesaPage } from './festival-de-comida-japonesa.page';

describe('FestivalDeComidaJaponesaPage', () => {
  let component: FestivalDeComidaJaponesaPage;
  let fixture: ComponentFixture<FestivalDeComidaJaponesaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FestivalDeComidaJaponesaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
