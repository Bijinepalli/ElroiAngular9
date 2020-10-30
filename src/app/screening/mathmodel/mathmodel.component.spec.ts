import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MathmodelComponent } from './mathmodel.component';

describe('MathmodelComponent', () => {
  let component: MathmodelComponent;
  let fixture: ComponentFixture<MathmodelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MathmodelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MathmodelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
