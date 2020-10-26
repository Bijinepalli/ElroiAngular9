import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewscreeningdataitemsComponent } from './viewscreeningdataitems.component';

describe('ViewscreeningdataitemsComponent', () => {
  let component: ViewscreeningdataitemsComponent;
  let fixture: ComponentFixture<ViewscreeningdataitemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewscreeningdataitemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewscreeningdataitemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
