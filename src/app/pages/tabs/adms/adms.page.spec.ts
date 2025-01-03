import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdmsPage } from './adms.page';

describe('AdmsPage', () => {
  let component: AdmsPage;
  let fixture: ComponentFixture<AdmsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
