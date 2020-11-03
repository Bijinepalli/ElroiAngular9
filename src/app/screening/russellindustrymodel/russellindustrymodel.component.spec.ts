import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RussellindustrymodelComponent } from './russellindustrymodel.component';

describe('RussellindustrymodelComponent', () => {
  let component: RussellindustrymodelComponent;
  let fixture: ComponentFixture<RussellindustrymodelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RussellindustrymodelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RussellindustrymodelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
