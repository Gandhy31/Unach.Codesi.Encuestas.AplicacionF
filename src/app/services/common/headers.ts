import { HttpHeaders } from '@angular/common/http';

import { Injectable, } from '@angular/core';

 

 

@Injectable({

    providedIn: 'root'

})

export class Headers {

 

    constructor() { }

 

    public Headers() {

        return new HttpHeaders({

            "Content-type": "application/json",

           // "Authorization": "Basic " + btoa("user:user")

        });

    }
  
       

}

 