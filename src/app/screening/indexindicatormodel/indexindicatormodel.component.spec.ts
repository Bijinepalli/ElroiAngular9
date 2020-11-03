import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexindicatormodelComponent } from './indexindicatormodel.component';

describe('IndexindicatormodelComponent', () => {
  let component: IndexindicatormodelComponent;
  let fixture: ComponentFixture<IndexindicatormodelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndexindicatormodelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndexindicatormodelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
