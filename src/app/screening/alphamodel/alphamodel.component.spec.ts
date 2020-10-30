import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlphamodelComponent } from './alphamodel.component';

describe('AlphamodelComponent', () => {
  let component: AlphamodelComponent;
  let fixture: ComponentFixture<AlphamodelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlphamodelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlphamodelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
