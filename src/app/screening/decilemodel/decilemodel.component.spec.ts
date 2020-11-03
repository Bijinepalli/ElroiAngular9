import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DecilemodelComponent } from './decilemodel.component';

describe('DecilemodelComponent', () => {
  let component: DecilemodelComponent;
  let fixture: ComponentFixture<DecilemodelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DecilemodelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DecilemodelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
