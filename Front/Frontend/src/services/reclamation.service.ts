import { HttpClient, HttpContext, HttpErrorResponse, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, filter, map, Observable, throwError } from 'rxjs';
import { Reclamation } from '../app/Models/Reclamation'; // Adjust import according to your model
import { ApiConfiguration } from './ApiConfiguration';
import { StrictHttpResponse } from './StrictHttpResponse';
import { RequestBuilder } from './RequestBuilder';
import { ReclamationDto } from '../app/Models/ReclamationDto'; // Adjust import according to your model
import { BaseService } from './BaseService';
import { PaginatedResponse } from '../app/Models/PaginatedResponse';

@Injectable({
  providedIn: 'root'
})
export class ReclamationService extends BaseService {

  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation findAll
   */
  static readonly FindAllPath = '/api/reclamations/list';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `findAll()` instead.
   *
   * This method doesn't expect any request body.
   */
  findAll$Response(params?: {
    context?: HttpContext
  }): Observable<StrictHttpResponse<Array<ReclamationDto>>> {

    const rb = new RequestBuilder(this.rootUrl, ReclamationService.FindAllPath, 'get');
    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => r as StrictHttpResponse<Array<ReclamationDto>>)
    );
  }

  /**
   * This method provides access to only the response body.
   * To access the full response (for headers, for example), `findAll$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  findAll(params?: {
    context?: HttpContext
  }): Observable<Array<ReclamationDto>> {

    return this.findAll$Response(params).pipe(
      map((r: StrictHttpResponse<Array<ReclamationDto>>) => r.body as Array<ReclamationDto>)
    );
  }

  /**
   * Path part for operation save
   */
  static readonly SavePath = '/api/reclamations/create';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `save()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
 
  /**
 * This method sends `multipart/form-data` and handles request body of type `FormData`.
 */
  save$Response(params: {
    context?: HttpContext;
    body: FormData; // Change this to FormData
  }): Observable<StrictHttpResponse<number>> {
    const rb = new RequestBuilder(this.rootUrl, ReclamationService.SavePath, 'post');
    rb.body(params.body); // No need to specify content type here, since FormData sets it automatically
  
    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => (r as HttpResponse<any>).clone({ body: parseFloat(String((r as HttpResponse<any>).body)) }) as StrictHttpResponse<number>)
    );
  }
  
  /**
   * This method sends `multipart/form-data` and handles request body of type `FormData`.
   */
  save(params: {
    context?: HttpContext;
    body: FormData; // Change this to FormData
  }): Observable<number> {
    return this.save$Response(params).pipe(
      map((r: StrictHttpResponse<number>) => r.body as number)
    );
  }


  /**
   * Path part for operation findById
   */
  static readonly FindByIdPath = '/api/reclamations/{reclamation-id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `findById()` instead.
   *
   * This method doesn't expect any request body.
   */
  findById$Response(params: {
    'reclamation-id': number;
    context?: HttpContext;
  }): Observable<StrictHttpResponse<ReclamationDto>> {

    const rb = new RequestBuilder(this.rootUrl, ReclamationService.FindByIdPath, 'get');
    rb.path('reclamation-id', params['reclamation-id'], {});
    
    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => r as StrictHttpResponse<ReclamationDto>)
    );
  }

  /**
   * This method provides access to only the response body.
   * To access the full response (for headers, for example), `findById$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  findById(params: {
    'reclamation-id': number;
    context?: HttpContext;
  }): Observable<ReclamationDto> {

    return this.findById$Response(params).pipe(
      map((r: StrictHttpResponse<ReclamationDto>) => r.body as ReclamationDto)
    );
  }

  /**
   * Path part for operation delete
   */
  static readonly DeletePath = '/api/reclamations/d/{reclamation-id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `delete()` instead.
   *
   * This method doesn't expect any request body.
   */
  delete$Response(params: {
    'reclamation-id': number;
    context?: HttpContext;
  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ReclamationService.DeletePath, 'delete');
    rb.path('reclamation-id', params['reclamation-id'], {});
    
    return this.http.request(rb.build({
      responseType: 'text',
      accept: '',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>)
    );
  }

  /**
   * This method provides access to only the response body.
   * To access the full response (for headers, for example), `delete$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  delete(params: {
    'reclamation-id': number;
    context?: HttpContext;
  }): Observable<void> {

    return this.delete$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  // Add additional methods as needed for your reclamations

  /**
   * Method for handling errors.
   */
  

  static readonly UpdateReclamationPath = '/api/reclamations/u/{reclamation-id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `updateReclamation()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  updateReclamation$Response(params: {
    'reclamation-id': number;
    context?: HttpContext;
    body: FormData; // Changer le type ici
  }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, ReclamationService.UpdateReclamationPath, 'put');
    rb.path('reclamation-id', params['reclamation-id'], {});
    rb.body(params.body, 'multipart/form-data'); // Assurez-vous que c'est bien 'multipart/form-data'
    
    return this.http.request(rb.build({
      responseType: 'text',
      accept: '',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      }),
      catchError(this.handleError) // Ajoutez une méthode pour gérer les erreurs
    );
  }
  
  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `updateReclamation$Response()` instead.
   *
   * This method sends `multipart/form-data` and handles request body of type `FormData`.
   */
  updateReclamation(reclamationId: number, formData: FormData, params: {
  'reclamation-id': number;
  context?: HttpContext;
  body: FormData; // Changer le type ici
}): Observable<void> {
    return this.updateReclamation$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    return throwError(error);
  }

  static readonly UpdateReclamationStatusPath = '/api/reclamations/{reclamation-id}/status';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `updateReclamationStatus()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  updateReclamationStatus$Response(params: {
    'reclamation-id': number;
    context?: HttpContext;
    body: { status: string };
  }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, ReclamationService.UpdateReclamationStatusPath, 'put');
    if (params) {
      rb.path('reclamation-id', params['reclamation-id'], {});
      rb.body(params.body, 'application/json');
    }
    return this.http.request(rb.build({
      responseType: 'text',
      accept: '',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      }),
      catchError(this.handleError) // Ajouter une méthode pour gérer les erreurs
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `updateReclamationStatus$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  updateReclamationStatus(params: {
    'reclamation-id': number;
    context?: HttpContext;
    body: { status: string };
  }): Observable<void> {
    return this.updateReclamationStatus$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  getPaginatedReclamations(page: number, size: number): Observable<PaginatedResponse<ReclamationDto>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<PaginatedResponse<ReclamationDto>>(`${this.rootUrl}/api/reclamations/paginated`, { params });
  }
}
