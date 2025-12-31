// src/app/core/services/base.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export abstract class BaseService {
  protected apiUrl: string = environment.apiUrl;

  constructor(protected http: HttpClient) {}

  /**
   * GET request
   */
  protected get<T>(endpoint: string,params?: any,requiresAuth: boolean = true): Observable<T> {
    const options = this.buildHttpOptions(params, requiresAuth);
    return this.http
      .get<T>(`${this.apiUrl}/${endpoint}`, options)
      .pipe(catchError(this.handleError));
  }

  /**
   * POST request
   */
  protected post<T>(
    endpoint: string,
    body: any,
    requiresAuth: boolean = true
  ): Observable<T> {
    const options = this.buildHttpOptions(null, requiresAuth);
    return this.http
      .post<T>(`${this.apiUrl}/${endpoint}`, body, options)
      .pipe(catchError(this.handleError));
  }

  /**
   * PUT request
   */
  protected put<T>(
    endpoint: string,
    body: any,
    requiresAuth: boolean = true
  ): Observable<T> {
    const options = this.buildHttpOptions(null, requiresAuth);
    return this.http
      .put<T>(`${this.apiUrl}/${endpoint}`, body, options)
      .pipe(catchError(this.handleError));
  }

  /**
   * DELETE request
   */
  protected delete<T>(
    endpoint: string,
    requiresAuth: boolean = true
  ): Observable<T> {
    const options = this.buildHttpOptions(null, requiresAuth);
    return this.http
      .delete<T>(`${this.apiUrl}/${endpoint}`, options)
      .pipe(catchError(this.handleError));
  }

  /**
   * PATCH request
   */
  protected patch<T>(
    endpoint: string,
    body: any,
    requiresAuth: boolean = true
  ): Observable<T> {
    const options = this.buildHttpOptions(null, requiresAuth);
    return this.http
      .patch<T>(`${this.apiUrl}/${endpoint}`, body, options)
      .pipe(catchError(this.handleError));
  }

  /**
   * Build HTTP options with headers and params
   */
  private buildHttpOptions(params?: any, requiresAuth: boolean = true): {
    headers: HttpHeaders;
    params: HttpParams;
  } {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    // Add Authorization header if required
    if (requiresAuth) {
      const token = this.getToken();
      if (token) {
        headers = headers.set('Authorization', `Bearer ${token}`);
      }
    }

    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key].toString());
        }
      });
    }

    return {
      headers: headers,
      params: httpParams
    };
  }

  /**
   * Get token from localStorage
   */
  private getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  /**
   * Handle HTTP errors
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      if (error.error && error.error.message) {
        errorMessage = error.error.message;
      }
    }

    console.error('API Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}