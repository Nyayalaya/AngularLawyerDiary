import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationService } from '../../shared/notification.service';
import { AuthFacade } from '../auth/facade/auth.facade';
@Component({
  selector: 'app-profile',
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {

  profileForm!: FormGroup;
  isEditMode = false;
  isLoading = true;
  userId!: string;
  role!: 'Corporate' | 'Individual';
  returnUrl = '';
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authFacade: AuthFacade
  ) { }

  ngOnInit(): void {
    this.authFacade.user$.subscribe(user => {
      if (!user) return;

      this.userId = user.id;
      this.role = user.role as any;
      this.loadProfile();
      this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
    });
  }

  loadProfile()
  {

  }
  
}

