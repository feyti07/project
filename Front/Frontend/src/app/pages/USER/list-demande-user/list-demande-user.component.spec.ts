import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDemandeUserComponent } from './list-demande-user.component';

describe('ListDemandeUserComponent', () => {
  let component: ListDemandeUserComponent;
  let fixture: ComponentFixture<ListDemandeUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListDemandeUserComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListDemandeUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
