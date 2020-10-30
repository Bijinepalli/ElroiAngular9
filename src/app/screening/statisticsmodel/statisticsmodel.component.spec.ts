import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticsmodelComponent } from './statisticsmodel.component';

describe('StatisticsmodelComponent', () => {
  let component: StatisticsmodelComponent;
  let fixture: ComponentFixture<StatisticsmodelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatisticsmodelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatisticsmodelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
