import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DefinescreeningdataitemsComponent } from './definescreeningdataitems.component';

describe('DefinescreeningdataitemsComponent', () => {
  let component: DefinescreeningdataitemsComponent;
  let fixture: ComponentFixture<DefinescreeningdataitemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DefinescreeningdataitemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefinescreeningdataitemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
