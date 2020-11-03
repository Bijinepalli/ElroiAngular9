import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RankmodelComponent } from './rankmodel.component';

describe('RankmodelComponent', () => {
  let component: RankmodelComponent;
  let fixture: ComponentFixture<RankmodelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RankmodelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RankmodelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
