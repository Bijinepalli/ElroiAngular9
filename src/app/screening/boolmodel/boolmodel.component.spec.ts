import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoolmodelComponent } from './boolmodel.component';

describe('BoolmodelComponent', () => {
  let component: BoolmodelComponent;
  let fixture: ComponentFixture<BoolmodelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoolmodelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoolmodelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
