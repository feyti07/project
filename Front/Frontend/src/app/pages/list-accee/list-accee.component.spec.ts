import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAcceeComponent } from './list-accee.component';

describe('ListAcceeComponent', () => {
  let component: ListAcceeComponent;
  let fixture: ComponentFixture<ListAcceeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListAcceeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListAcceeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
