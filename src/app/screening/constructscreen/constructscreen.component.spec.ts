import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConstructscreenComponent } from './constructscreen.component';

describe('ConstructscreenComponent', () => {
  let component: ConstructscreenComponent;
  let fixture: ComponentFixture<ConstructscreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConstructscreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConstructscreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
