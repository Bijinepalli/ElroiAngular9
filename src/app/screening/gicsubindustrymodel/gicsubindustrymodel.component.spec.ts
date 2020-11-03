import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GicsubindustrymodelComponent } from './gicsubindustrymodel.component';

describe('GicsubindustrymodelComponent', () => {
  let component: GicsubindustrymodelComponent;
  let fixture: ComponentFixture<GicsubindustrymodelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GicsubindustrymodelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GicsubindustrymodelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
