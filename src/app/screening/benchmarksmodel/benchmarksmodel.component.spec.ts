import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BenchmarksmodelComponent } from './benchmarksmodel.component';

describe('BenchmarksmodelComponent', () => {
  let component: BenchmarksmodelComponent;
  let fixture: ComponentFixture<BenchmarksmodelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BenchmarksmodelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BenchmarksmodelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
