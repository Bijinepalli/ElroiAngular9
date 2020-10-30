import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GrowthmodelComponent } from './growthmodel.component';

describe('GrowthmodelComponent', () => {
  let component: GrowthmodelComponent;
  let fixture: ComponentFixture<GrowthmodelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GrowthmodelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrowthmodelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
