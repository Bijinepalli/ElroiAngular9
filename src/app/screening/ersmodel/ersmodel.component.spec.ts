import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErsmodelComponent } from './ersmodel.component';

describe('ErsmodelComponent', () => {
  let component: ErsmodelComponent;
  let fixture: ComponentFixture<ErsmodelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ErsmodelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErsmodelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
