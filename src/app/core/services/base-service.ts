// src/app/core/services/base.service.ts

import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpErrorResponse
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export abstract class BaseService {

  protected apiUrl: string = environment.apiUrl;

  constructor(protected http: HttpClient) {}

  /* =========================================
     GET
  ========================================= */
  protected get<T>(endpoint: string, params?: any): Observable<T> {
    const options = this.buildHttpOptions(params);
    return this.http
      .get<T>(`${this.apiUrl}/${endpoint}`, options)
      .pipe(catchError(this.handleError));
  }

  /* =========================================
     POST
  ========================================= */
  protected post<T>(endpoint: string, body: any): Observable<T> {
    const options = this.buildHttpOptions();
    return this.http
      .post<T>(`${this.apiUrl}/${endpoint}`, body, options)
      .pipe(catchError(this.handleError));
  }

  /* =========================================
     PUT
  ========================================= */
  protected put<T>(endpoint: string, body: any): Observable<T> {
    const options = this.buildHttpOptions();
    return this.http
      .put<T>(`${this.apiUrl}/${endpoint}`, body, options)
      .pipe(catchError(this.handleError));
  }

  /* =========================================
     DELETE
  ========================================= */
  protected delete<T>(endpoint: string): Observable<T> {
    const options = this.buildHttpOptions();
    return this.http
      .delete<T>(`${this.apiUrl}/${endpoint}`, options)
      .pipe(catchError(this.handleError));
  }

  /* =========================================
     PATCH
  ========================================= */
  protected patch<T>(endpoint: string, body: any): Observable<T> {
    const options = this.buildHttpOptions();
    return this.http
      .patch<T>(`${this.apiUrl}/${endpoint}`, body, options)
      .pipe(catchError(this.handleError));
  }

  /* =========================================
     HTTP OPTIONS (NO TOKEN HERE ❗)
  ========================================= */
  private buildHttpOptions(params?: any): {
    headers: HttpHeaders;
    params: HttpParams;
    withCredentials: boolean;
  } {

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    });

    let httpParams = new HttpParams();

    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key].toString());
        }
      });
    }

    return {
      headers,
      params: httpParams,
      withCredentials: true
    };
  }

  /* =========================================
     ERROR HANDLING
  ========================================= */
  private handleError(error: HttpErrorResponse): Observable<never> {

    let errorMessage = 'An error occurred';

    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    console.error('API Error:', errorMessage);

    return throwError(() => new Error(errorMessage));
  }
}
