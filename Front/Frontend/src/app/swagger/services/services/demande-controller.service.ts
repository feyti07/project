/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { delete$ } from '../fn/demande-controller/delete';
import { Delete$Params } from '../fn/demande-controller/delete';
import { DemandeDto } from '../models/demande-dto';
import { findAll } from '../fn/demande-controller/find-all';
import { FindAll$Params } from '../fn/demande-controller/find-all';
import { findById } from '../fn/demande-controller/find-by-id';
import { FindById$Params } from '../fn/demande-controller/find-by-id';
import { save } from '../fn/demande-controller/save';
import { Save$Params } from '../fn/demande-controller/save';

@Injectable({ providedIn: 'root' })
export class DemandeControllerService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `save()` */
  static readonly SavePath = '/api/demandes/create';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `save()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  save$Response(params: Save$Params, context?: HttpContext): Observable<StrictHttpResponse<number>> {
    return save(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `save$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  save(params: Save$Params, context?: HttpContext): Observable<number> {
    return this.save$Response(params, context).pipe(
      map((r: StrictHttpResponse<number>): number => r.body)
    );
  }

  /** Path part for operation `findById()` */
  static readonly FindByIdPath = '/api/demandes/{demande-id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `findById()` instead.
   *
   * This method doesn't expect any request body.
   */
  findById$Response(params: FindById$Params, context?: HttpContext): Observable<StrictHttpResponse<DemandeDto>> {
    return findById(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `findById$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  findById(params: FindById$Params, context?: HttpContext): Observable<DemandeDto> {
    return this.findById$Response(params, context).pipe(
      map((r: StrictHttpResponse<DemandeDto>): DemandeDto => r.body)
    );
  }

  /** Path part for operation `delete()` */
  static readonly DeletePath = '/api/demandes/{demande-id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `delete()` instead.
   *
   * This method doesn't expect any request body.
   */
  delete$Response(params: Delete$Params, context?: HttpContext): Observable<StrictHttpResponse<void>> {
    return delete$(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `delete$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  delete(params: Delete$Params, context?: HttpContext): Observable<void> {
    return this.delete$Response(params, context).pipe(
      map((r: StrictHttpResponse<void>): void => r.body)
    );
  }

  /** Path part for operation `findAll()` */
  static readonly FindAllPath = '/api/demandes/list';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `findAll()` instead.
   *
   * This method doesn't expect any request body.
   */
  findAll$Response(params?: FindAll$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<DemandeDto>>> {
    return findAll(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `findAll$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  findAll(params?: FindAll$Params, context?: HttpContext): Observable<Array<DemandeDto>> {
    return this.findAll$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<DemandeDto>>): Array<DemandeDto> => r.body)
    );
  }


   /** Path part for operation `getModifiedDemandes()` */
   static readonly GetModifiedDemandesPath = '/api/demandes/modified';

   getModifiedDemandes$Response(context?: HttpContext): Observable<StrictHttpResponse<Array<DemandeDto>>> {
    return this.http.get<Array<DemandeDto>>(`${this.rootUrl}${DemandeControllerService.GetModifiedDemandesPath}`, { observe: 'response', context }).pipe(
      map((res: HttpResponse<Array<DemandeDto>>): StrictHttpResponse<Array<DemandeDto>> => {
        const body = res.body ?? []; // Utilisation de la coalescence nulle pour garantir que body n'est jamais null
        return res.clone({ body }) as StrictHttpResponse<Array<DemandeDto>>;
      })
    );
  }

  getModifiedDemandes(context?: HttpContext): Observable<Array<DemandeDto>> {
    return this.getModifiedDemandes$Response(context).pipe(
      map((r: StrictHttpResponse<Array<DemandeDto>>): Array<DemandeDto> => r.body)
    );
  }
}
