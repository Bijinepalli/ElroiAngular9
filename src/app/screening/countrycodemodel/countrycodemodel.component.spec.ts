import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CountrycodemodelComponent } from './countrycodemodel.component';

describe('CountrycodemodelComponent', () => {
  let component: CountrycodemodelComponent;
  let fixture: ComponentFixture<CountrycodemodelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CountrycodemodelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CountrycodemodelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
