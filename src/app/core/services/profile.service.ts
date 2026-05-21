import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from './base-service';
import { UserProfileModel } from '../models/profile.model';
import { ApiEndpoints } from '../constants/api-endpoints';

export interface ApiResponse<T> {
  status: boolean;
  message: string;
  statusCode: number;
  timestamp: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService extends BaseService {

  private resolveEndpoint(path: string, userId: string): string {
    return path.replace('{{user_id}}', userId);
  }

  /* =========================================
     GET USER PROFILE
  ========================================= */
  getUserProfile(userId: string): Observable<ApiResponse<UserProfileModel>> {
    return this.get<ApiResponse<UserProfileModel>>(
      this.resolveEndpoint(ApiEndpoints.USER.PROFILE, userId)
    );
  }

  /* =========================================
     UPDATE USER PROFILE
  ========================================= */
  updateProfile(profile: UserProfileModel): Observable<ApiResponse<UserProfileModel>> {
    return this.put<ApiResponse<UserProfileModel>>(
      this.resolveEndpoint(ApiEndpoints.USER.UPDATE_PROFILE, profile.userId),
      profile
    );
  }

  /* =========================================
     UPDATE PERSONAL INFO
  ========================================= */
  updatePersonalInfo(userId: string, data: any): Observable<ApiResponse<UserProfileModel>> {
    return this.put<ApiResponse<UserProfileModel>>(
      this.resolveEndpoint(ApiEndpoints.USER.UPDATE_PROFILE, userId),
      data
    );
  }

  /* =========================================
     UPDATE PROFESSIONAL INFO
  ========================================= */
  updateProfessionalInfo(userId: string, data: any): Observable<ApiResponse<UserProfileModel>> {
    return this.put<ApiResponse<UserProfileModel>>(
      this.resolveEndpoint(ApiEndpoints.USER.UPDATE_PROFILE, userId),
      data
    );
  }

  /* =========================================
     UPDATE ADDRESS
  ========================================= */
  updateAddress(userId: string, addressId: string, data: any): Observable<ApiResponse<any>> {
    return this.put<ApiResponse<any>>(
      this.resolveEndpoint(ApiEndpoints.USER.UPDATE_ADDRESS, userId).replace('{{address_id}}', addressId),
      data
    );
  }

  /* =========================================
     ADD ADDRESS
  ========================================= */
  addAddress(userId: string, data: any): Observable<ApiResponse<any>> {
    return this.post<ApiResponse<any>>(
      this.resolveEndpoint(ApiEndpoints.USER.ADDRESS, userId),
      data
    );
  }

  /* =========================================
     DELETE ADDRESS
  ========================================= */
  deleteAddress(userId: string, addressId: string): Observable<ApiResponse<any>> {
    return this.delete<ApiResponse<any>>(
      this.resolveEndpoint(ApiEndpoints.USER.DELETE_ADDRESS, userId).replace('{{address_id}}', addressId)
    );
  }

  /* =========================================
     UPDATE CONTACT
  ========================================= */
  updateContact(userId: string, contactId: string, data: any): Observable<ApiResponse<any>> {
    return this.put<ApiResponse<any>>(
      this.resolveEndpoint(ApiEndpoints.USER.UPDATE_CONTACT, userId).replace('{{contact_id}}', contactId),
      data
    );
  }

  /* =========================================
     ADD CONTACT
  ========================================= */
  addContact(userId: string, data: any): Observable<ApiResponse<any>> {
    return this.post<ApiResponse<any>>(
      this.resolveEndpoint(ApiEndpoints.USER.CONTACT, userId),
      data
    );
  }

  /* =========================================
     DELETE CONTACT
  ========================================= */
  deleteContact(userId: string, contactId: string): Observable<ApiResponse<any>> {
    return this.delete<ApiResponse<any>>(
      this.resolveEndpoint(ApiEndpoints.USER.DELETE_CONTACT, userId).replace('{{contact_id}}', contactId)
    );
  }

  /* =========================================
     UPDATE WORK LOCATION
  ========================================= */
  updateWorkLocation(userId: string, locationId: string, data: any): Observable<ApiResponse<any>> {
    return this.put<ApiResponse<any>>(
      this.resolveEndpoint(ApiEndpoints.USER.UPDATE_WORK_LOCATION, userId).replace('{{location_id}}', locationId),
      data
    );
  }

  /* =========================================
     ADD WORK LOCATION
  ========================================= */
  addWorkLocation(userId: string, data: any): Observable<ApiResponse<any>> {
    return this.post<ApiResponse<any>>(
      this.resolveEndpoint(ApiEndpoints.USER.WORK_LOCATION, userId),
      data
    );
  }

  /* =========================================
     DELETE WORK LOCATION
  ========================================= */
  deleteWorkLocation(userId: string, locationId: string): Observable<ApiResponse<any>> {
    return this.delete<ApiResponse<any>>(
      this.resolveEndpoint(ApiEndpoints.USER.DELETE_WORK_LOCATION, userId).replace('{{location_id}}', locationId)
    );
  }

  /* =========================================
     UPDATE BILLING INFO
  ========================================= */
  updateBillingInfo(userId: string, data: any): Observable<ApiResponse<any>> {
    return this.put<ApiResponse<any>>(
      this.resolveEndpoint(ApiEndpoints.USER.UPDATE_BILLING, userId).replace('{{billing_id}}', data.id || ''),
      data
    );
  }

  /* =========================================
     UPLOAD PROFILE IMAGE
  ========================================= */
  uploadProfileImage(userId: string, file: File): Observable<ApiResponse<any>> {
    const formData = new FormData();
    formData.append('file', file);
    return this.post<ApiResponse<any>>(
      this.resolveEndpoint(ApiEndpoints.USER.PROFILE, userId) + '/image',
      formData
    );
  }
}
