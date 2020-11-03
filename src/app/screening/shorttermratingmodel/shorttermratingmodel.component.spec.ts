import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShorttermratingmodelComponent } from './shorttermratingmodel.component';

describe('ShorttermratingmodelComponent', () => {
  let component: ShorttermratingmodelComponent;
  let fixture: ComponentFixture<ShorttermratingmodelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShorttermratingmodelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShorttermratingmodelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
