import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncexcmodelComponent } from './incexcmodel.component';

describe('IncexcmodelComponent', () => {
  let component: IncexcmodelComponent;
  let fixture: ComponentFixture<IncexcmodelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncexcmodelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncexcmodelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
