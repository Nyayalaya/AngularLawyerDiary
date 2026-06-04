import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { GenericTable } from '../../../../shared';
import { ClientModalComponent } from '../client-modal/client-modal';
import { ClientFacade } from '../../facade/client.facade';
import { Client } from '../../models/client.model';

@Component({
  selector: 'app-client',
  standalone: true,
  templateUrl: './client.html',
  styleUrls: ['./client.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    GenericTable,
    ClientModalComponent
  ]
})
export class ClientComponent implements OnInit, OnDestroy {
  private facade = inject(ClientFacade);
  private destroy$ = new Subject<void>();

  clients$: Observable<Client[]> = this.facade.clients$;
  loading$: Observable<boolean> = this.facade.loading$;
  error$: Observable<string | undefined> = this.facade.error$;
  totalRecords$: Observable<number> = this.facade.totalRecords$;
  pageNumber$: Observable<number> = this.facade.pageNumber$;
  pageSize$: Observable<number> = this.facade.pageSize$;
  totalPages$: Observable<number> = this.facade.totalPages$;

  showForm = signal(false);
  currentPage = signal(1);
  pageSize = signal(10);
  isEditMode = signal(false);
  selectedClient = signal<Client | null>(null);
  
  private isDeleting = signal(false);

  columns = [
    { key: 'id', label: 'ID', hidden: true, isKey: true },
    { key: 'clientType', label: 'Client Type' },
    { key: 'name', label: 'Name' },
    { key: 'mobile', label: 'Mobile' },
    { key: 'email', label: 'Email' },
    { key: 'referralBy', label: 'Referral By' },
    { key: 'propertyName', label: 'Property Name' }
  ];

  ngOnInit(): void {
    this.loadPage();
    
    // Handle delete errors
    this.error$
      .pipe(
        takeUntil(this.destroy$),
        filter(error => error !== null && this.isDeleting())
      )
      .subscribe(error => {
        this.isDeleting.set(false);
        Swal.fire('Error', error, 'error');
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadPage(): void {
    this.facade.load(this.currentPage(), this.pageSize());
  }

  onPageChanged(event: { page: number; pageSize: number }): void {
    this.currentPage.set(event.page);
    this.pageSize.set(event.pageSize);
    this.facade.load(event.page, event.pageSize, true);
  }

  toggleForm(reset = true): void {
    this.showForm.update(v => !v);
    if (reset) this.resetForm();
  }

  resetForm(): void {
    this.selectedClient.set(null);
    this.isEditMode.set(false);
  }

  openAddClient(): void {
    this.resetForm();
    this.showForm.set(true);
  }

  onEdit(item: Client): void {
    this.isEditMode.set(true);
    this.selectedClient.set(item);
    this.showForm.set(true);
  }

  onClientSaved(): void {
    this.closeClientModal();
    this.facade.load(this.currentPage(), this.pageSize(), true);
  }

  closeClientModal(): void {
    this.showForm.set(false);
    this.resetForm();
  }

  onDelete(item: Client): void {
    Swal.fire({
      title: 'Delete Confirmation',
      text: 'Are you sure you want to delete this client?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.isDeleting.set(true);
        this.facade.delete(item.id);
        
        // Wait for delete to complete (success or error)
        setTimeout(() => {
          if (this.isDeleting()) {
            // Still marked as deleting means it succeeded (no error caught)
            this.isDeleting.set(false);
            Swal.fire(
              'Deleted!',
              'Client has been deleted.',
              'success'
            );
          }
        }, 1500);
      }
    });
  }

  onView(item: Client): void {
    Swal.fire({
      title: 'Client Details',
      html: `<div style="text-align: left;">
               <p><strong>ID:</strong> ${item.id}</p>
               <p><strong>Client Type:</strong> ${item.clientType}</p>
               <p><strong>Name:</strong> ${item.name}</p>
               <p><strong>Mobile:</strong> ${item.mobile}</p>
               <p><strong>Email:</strong> ${item.email ?? '-'}</p>
               <p><strong>Office Phone:</strong> ${item.officePhone ?? '-'}</p>
               <p><strong>Office Email:</strong> ${item.officeEmail ?? '-'}</p>
               <p><strong>Referral By:</strong> ${item.referralBy ?? '-'}</p>
               <p><strong>Registration No:</strong> ${item.registrationNo ?? '-'}</p>
               <p><strong>Property Name:</strong> ${item.propertyName}</p>
               <p><strong>Address:</strong> ${item.address ?? '-'}</p>
             </div>`,
      icon: 'info',
      confirmButtonText: 'Close'
    });
  }

}
