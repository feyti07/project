import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

declare const tinymce: any;

@Component({
  selector: 'app-tinymce-editor',
  template: `<textarea #editor style="width: 100%; height: 300px;"></textarea>`,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: TinymceEditorComponent,
      multi: true
    }
  ]
})
export class TinymceEditorComponent implements ControlValueAccessor, AfterViewInit, OnDestroy {
  @ViewChild('editor') editorElement!: ElementRef;
  editor: any;

  onChange: any = () => {};
  onTouched: any = () => {};

  constructor() {}

  ngAfterViewInit() {
    this.loadTinyMCE().then(() => {
      console.log('TinyMCE is loaded');
      tinymce.init({
        target: this.editorElement.nativeElement,
        plugins: [
          'advlist autolink lists link image charmap print preview anchor',
          'searchreplace visualblocks code fullscreen',
          'insertdatetime media table paste code help wordcount'
        ],
        toolbar: 'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
        readonly: false, // Assurez-vous que le mode lecture seule est désactivé
        setup: (editor: any) => {
          this.editor = editor;
          editor.on('keyup change', () => {
            const content = editor.getContent();
            this.onChange(content);
          });
        }
      });
    }).catch(err => {
      console.error('TinyMCE failed to load', err);
    });
  }

  loadTinyMCE() {
    return new Promise<void>((resolve, reject) => {
      if (typeof tinymce !== 'undefined') {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdn.tiny.cloud/1/tlfkamwjt3546dm8561rbcp4vg8bw3ufnjvmr7zsrsxzvtfg/tinymce/5/tinymce.min.js';
      script.onload = () => {
        console.log('TinyMCE script loaded');
        resolve();
      };
      script.onerror = (err) => {
        console.error('Error loading TinyMCE script', err);
        reject(new Error('TinyMCE failed to load'));
      };
      document.head.appendChild(script);
    });
  }

  writeValue(content: any) {
    if (this.editor) {
      this.editor.setContent(content);
    }
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  ngOnDestroy() {
    if (this.editor) {
      tinymce.remove(this.editor);
    }
  }
}
