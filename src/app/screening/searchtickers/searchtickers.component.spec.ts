import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchtickersComponent } from './searchtickers.component';

describe('SearchtickersComponent', () => {
  let component: SearchtickersComponent;
  let fixture: ComponentFixture<SearchtickersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchtickersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchtickersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
