import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MiddlemodelComponent } from './middlemodel.component';

describe('MiddlemodelComponent', () => {
  let component: MiddlemodelComponent;
  let fixture: ComponentFixture<MiddlemodelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MiddlemodelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MiddlemodelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
