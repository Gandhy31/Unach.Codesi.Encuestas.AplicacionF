import { HttpClient, HttpHeaders } from '@angular/common/http';

 

import { Injectable, } from '@angular/core';

import { environment } from './global';

import { Headers } from './headers';

 

 

const apiUrl = environment.apiUrl;

 

 

 

@Injectable({

  providedIn: 'root'

})

export class Request {

 

 

  constructor(private http: HttpClient, public headers:Headers) {}

 


 

   public  ejecutarQueryPost<T>(query: string, body: any) {

    query = apiUrl + query;

    return this.http.post<T>(query, body, {headers:this.headers.Headers()})

  }

 

 
  public ejecutarQueryGet<T>(query: string) {

 

    query = apiUrl + query;

    return this.http.get<T>(query, { headers:this.headers.Headers()})

  }

 

  
 

  public  ejecutarQueryPut<T>(query: string, body:any) {

    query = apiUrl + query;

    return this.http.put<T>(query, body,{headers:this.headers.Headers()})

  }

 

 

 


 

  public  ejecutarQueryDelete<T>(query: string) {

    query = apiUrl + query;

    return this.http.delete<T>(query, { headers:this.headers.Headers() })

 

  }

 

 

 

 

 

}