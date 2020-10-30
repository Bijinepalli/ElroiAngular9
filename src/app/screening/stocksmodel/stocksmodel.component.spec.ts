import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StocksmodelComponent } from './stocksmodel.component';

describe('StocksmodelComponent', () => {
  let component: StocksmodelComponent;
  let fixture: ComponentFixture<StocksmodelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StocksmodelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StocksmodelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
