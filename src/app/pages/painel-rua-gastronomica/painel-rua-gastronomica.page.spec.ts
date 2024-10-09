import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PainelRuaGastronomicaPage } from './painel-rua-gastronomica.page';

describe('PainelRuaGastronomicaPage', () => {
  let component: PainelRuaGastronomicaPage;
  let fixture: ComponentFixture<PainelRuaGastronomicaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PainelRuaGastronomicaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
