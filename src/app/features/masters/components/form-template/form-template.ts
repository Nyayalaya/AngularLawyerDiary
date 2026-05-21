import { Component, OnInit, inject, signal, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { EditorModule } from '@tinymce/tinymce-angular';

import { FormTemplateModel } from '../../models/form-template.model';
import { FormTemplateFacade } from '../../facade/form-template.facade';
import { FormSubTypeFacade } from '../../facade/form-subtype.facade';
import { FormSubTypeModel } from '../../models/form-sub-type-model';
import { GenericTable } from '../../../../shared';

declare let $: any; // Declare jQuery

@Component({
  selector: 'app-form-template',
  standalone: true,
  templateUrl: './form-template.html',
  styleUrls: ['./form-template.css'],
  imports: [
    EditorModule,
    CommonModule,
    ReactiveFormsModule,
    GenericTable
  ]
})
export class FormTemplateComponent implements OnInit, AfterViewInit {

  // ── DI ────────────────────────────────────────────────────────────
  private fb                   = inject(FormBuilder);
  private facade               = inject(FormTemplateFacade);
  private formSubTypeFacade    = inject(FormSubTypeFacade);

  // ── Store streams ─────────────────────────────────────────────────
  formTemplates$:  Observable<FormTemplateModel[]>  = this.facade.formTemplates$;
  loading$:        Observable<boolean>              = this.facade.loading$;
  error$:          Observable<string | null>        = this.facade.error$;
  totalRecords$:   Observable<number>               = this.facade.totalRecords$;
  pageNumber$:     Observable<number>               = this.facade.pageNumber$;
  pageSize$:       Observable<number>               = this.facade.pageSize$;
  totalPages$:     Observable<number>               = this.facade.totalPages$;

  formSubTypes$:   Observable<FormSubTypeModel[]>   = this.formSubTypeFacade.formSubTypes$;

  // ── View references ──────────────────────────────────────────────
  @ViewChild('formSubTypeSelect') formSubTypeSelect: ElementRef | undefined;
  @ViewChild('templateEditor') templateEditor: ElementRef | undefined;

  // ── Local UI state ────────────────────────────────────────────────
  viewMode      = signal<'list' | 'form'>('list');
  currentPage   = signal(1);
  pageSize      = signal(10);
  isEditMode    = signal(false);
  formSubTypes  = signal<FormSubTypeModel[]>([]);

  // ── Form ──────────────────────────────────────────────────────────
  formTemplateForm: FormGroup = this.fb.group({
    id:              [''],
    formSubtypeId:   ['', [Validators.required]],
    title:           ['', [Validators.required, Validators.minLength(3)]],
    templateContent: ['', [Validators.required]]
  });

  // ── Table columns ─────────────────────────────────────────────────
  columns = [
    { key: 'id',         label: 'ID',          hidden: true, isKey: true },
    { key: 'formSubtypeId', label: 'Form SubType' },
    { key: 'title',      label: 'Title' }
  ];

  // ── Lifecycle ─────────────────────────────────────────────────────
  ngOnInit(): void {
    this.loadPage();
    this.formSubTypeFacade.load(1, 100); // Load all form subtypes
    this.formSubTypes$.subscribe(subtypes => {
      this.formSubTypes.set(subtypes);
    });
  }

  ngAfterViewInit(): void {
    this.initializeSelect2();
  }

  // ── Select2 Initialization ────────────────────────────────────────
  private initializeSelect2(): void {
    if (this.formSubTypeSelect && typeof $ !== 'undefined') {
      $(this.formSubTypeSelect.nativeElement).select2({
        theme: 'bootstrap-5',
        width: '100%',
        allowClear: true,
        placeholder: 'Select Form SubType'
      }).on('change', (e: any) => {
        const value = $(e.target).val();
        this.formTemplateForm.patchValue({ formSubtypeId: value });
      });
    }
  }

  // ── Pagination ────────────────────────────────────────────────────
  loadPage(): void {
    this.facade.load(this.currentPage(), this.pageSize(), true);
  }

  onPageChanged(event: { page: number; pageSize: number }): void {
    this.currentPage.set(event.page);
    this.pageSize.set(event.pageSize);
    this.facade.load(event.page, event.pageSize, true);
  }

  // ── View Navigation ───────────────────────────────────────────────
  showListView(): void {
    this.viewMode.set('list');
    this.resetForm();
  }

  showFormView(editItem?: FormTemplateModel): void {
    this.viewMode.set('form');
    if (editItem) {
      this.isEditMode.set(true);
      this.formTemplateForm.patchValue(editItem);
      setTimeout(() => {
        if (typeof $ !== 'undefined' && this.formSubTypeSelect) {
          $(this.formSubTypeSelect.nativeElement).val(editItem.formSubtypeId).trigger('change');
        }
        if (this.templateEditor) {
          this.templateEditor.nativeElement.innerHTML = editItem.templateContent;
        }
      }, 100);
    } else {
      this.isEditMode.set(false);
      this.resetForm();
    }
  }

  // ── Editor Functions ──────────────────────────────────────────────
  applyBold(): void {
    document.execCommand('bold', false);
    this.templateEditor?.nativeElement.focus();
  }

  applyItalic(): void {
    document.execCommand('italic', false);
    this.templateEditor?.nativeElement.focus();
  }

  applyUnderline(): void {
    document.execCommand('underline', false);
    this.templateEditor?.nativeElement.focus();
  }

  insertLink(): void {
    const url = prompt('Enter URL:');
    if (url) {
      document.execCommand('createLink', false, url);
      this.templateEditor?.nativeElement.focus();
    }
  }

  insertImage(): void {
    const url = prompt('Enter image URL:');
    if (url) {
      document.execCommand('insertImage', false, url);
      this.templateEditor?.nativeElement.focus();
    }
  }

  insertTable(): void {
    const rows = prompt('Number of rows:', '3');
    const cols = prompt('Number of columns:', '3');
    if (rows && cols) {
      let table = '<table border="1" style="width:100%; border-collapse:collapse;"><tbody>';
      for (let i = 0; i < parseInt(rows); i++) {
        table += '<tr>';
        for (let j = 0; j < parseInt(cols); j++) {
          table += '<td style="padding:8px;">Cell</td>';
        }
        table += '</tr>';
      }
      table += '</tbody></table><br>';
      document.execCommand('insertHTML', false, table);
      this.templateEditor?.nativeElement.focus();
    }
  }

  insertList(): void {
    document.execCommand('insertUnorderedList', false);
    this.templateEditor?.nativeElement.focus();
  }

  insertOrderedList(): void {
    document.execCommand('insertOrderedList', false);
    this.templateEditor?.nativeElement.focus();
  }

  clearFormatting(): void {
    document.execCommand('removeFormat', false);
    this.templateEditor?.nativeElement.focus();
  }

  // ── Form helpers ──────────────────────────────────────────────────
  resetForm(): void {
    this.formTemplateForm.reset({
      id:              '',
      formSubtypeId:   '',
      title:           '',
      templateContent: ''
    });
    if (this.templateEditor) {
      this.templateEditor.nativeElement.innerHTML = '';
    }
    this.isEditMode.set(false);
    if (typeof $ !== 'undefined' && this.formSubTypeSelect) {
      setTimeout(() => {
        $(this.formSubTypeSelect?.nativeElement).val('').trigger('change');
      }, 100);
    }
  }

  // ── CRUD handlers ─────────────────────────────────────────────────
  onSubmit(): void {
    if (this.formTemplateForm.invalid) {
      this.formTemplateForm.markAllAsTouched();
      Swal.fire({
        icon:  'warning',
        title: 'Validation Error',
        text:  'Please fill in all required fields correctly.'
      });
      return;
    }

    // Get editor content
    const templateContent = this.templateEditor?.nativeElement.innerHTML || '';
    
    if (!templateContent.trim()) {
      Swal.fire({
        icon:  'warning',
        title: 'Validation Error',
        text:  'Template content cannot be empty.'
      });
      return;
    }

    const formValue = {
      ...this.formTemplateForm.value,
      templateContent: templateContent
    };
    const id = formValue.id;

    if (id) {
      // Update existing
      this.facade.update(formValue);
      Swal.fire({
        icon:  'success',
        title: 'Success',
        text:  'Form Template updated successfully!',
        timer: 2000
      });
    } else {
      // Create new
      this.facade.add(formValue);
      Swal.fire({
        icon:  'success',
        title: 'Success',
        text:  'Form Template created successfully!',
        timer: 2000
      });
    }

    setTimeout(() => {
      this.showListView();
    }, 2100);
  }

  onEdit(item: FormTemplateModel): void {
    this.showFormView(item);
  }

  onDelete(item: FormTemplateModel): void {
    Swal.fire({
      title:  'Delete Confirmation',
      text:   'Are you sure you want to delete this form template?',
      icon:   'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor:  '#d33',
      confirmButtonText:  'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.facade.delete(item.id);
        Swal.fire(
          'Deleted!',
          'Form Template has been deleted.',
          'success'
        );
      }
    });
  }

  onView(item: FormTemplateModel): void {
    Swal.fire({
      title:           'Form Template Details',
      html:            `<div style="text-align: left; max-height: 400px; overflow-y: auto;">
                          <p><strong>ID:</strong> ${item.id}</p>
                          <p><strong>Form SubType ID:</strong> ${item.formSubtypeId}</p>
                          <p><strong>Title:</strong> ${item.title}</p>
                          <hr>
                          <p><strong>Template Content:</strong></p>
                          <div style="border: 1px solid #ddd; padding: 10px; background: #f9f9f9;">${item.templateContent}</div>
                        </div>`,
      icon:            'info',
      confirmButtonText: 'Close',
      width: '800px'
    });
  }

  editorConfig = {
  height: 400,
  menubar: true,
  branding: false,

  plugins: [
    'advlist autolink lists link image charmap preview anchor',
    'searchreplace visualblocks code fullscreen',
    'insertdatetime media table code help wordcount'
  ],

  toolbar:
    'undo redo | formatselect | ' +
    'bold italic underline | alignleft aligncenter alignright alignjustify | ' +
    'bullist numlist outdent indent | link image table | removeformat | help',

  content_style: `
    body {
      font-family: Arial, sans-serif;
      font-size: 14px;
    }
  `
};

}
