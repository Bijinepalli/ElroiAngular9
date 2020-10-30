import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubindmodelComponent } from './subindmodel.component';

describe('SubindmodelComponent', () => {
  let component: SubindmodelComponent;
  let fixture: ComponentFixture<SubindmodelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubindmodelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubindmodelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
