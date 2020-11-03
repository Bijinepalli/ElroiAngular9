import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NtilemodelComponent } from './ntilemodel.component';

describe('NtilemodelComponent', () => {
  let component: NtilemodelComponent;
  let fixture: ComponentFixture<NtilemodelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NtilemodelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NtilemodelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
