import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TinymceEditorComponentComponent } from './tinymce-editor-component.component';

describe('TinymceEditorComponentComponent', () => {
  let component: TinymceEditorComponentComponent;
  let fixture: ComponentFixture<TinymceEditorComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TinymceEditorComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TinymceEditorComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
