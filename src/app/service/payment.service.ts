import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { rejects } from 'assert';
import { resolve } from 'dns';
import { promise } from 'protractor';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { creditCardDto } from '../dto/creditCardDto';


export interface sourceType {
  sourceToken: string,
  customerId: string,
}

export interface payemtDetailsTypes {
  amount: number,
  cardId: string,
  customerId: string,
}

export interface customerObject {
  description: string,
  email: string,
  name: string,
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private http: HttpClient) { }

  loadStripe() {
    return new Promise<boolean>((res, rej)=>{
      if (!window.document.getElementById('stripe-custom-form-script')) {
        const s = window.document.createElement("script");
        s.id = "stripe-custom-form-script";
        s.type = "text/javascript";
        s.src = environment.stripeUrl;
        s.onload = () => {
          window['Stripe'].setPublishableKey(environment.publishStripeKey);
          res(true);
        }

        s.onerror = (err)=> rej(err);

        window.document.body.appendChild(s);
      }
    })


  }

  createToken(formData: creditCardDto): Promise<{card: {id: string}, id: string}> {

    const { creditCardNumber, expirationDate, securityCode } = formData;

    return new Promise((resolve, reject) => {

      (<any>window).Stripe.card.createToken({
        number: creditCardNumber,
        exp_month: (expirationDate.getMonth() + 1),
        exp_year: expirationDate.getFullYear(),
        cvc: securityCode,
      }, (status: number, response: any) => {

        if (status === 200) {
          resolve(response);
        } else {
          reject(response.error);
        }
      }
      )

    })

  }


  createCustomer(customerData: customerObject): Promise<{cus: {id: string}}> {
    return this.http.post<{cus: {id: string}}>(`${environment.api}/createCustomer`, customerData).toPromise();
  }


  createSource(sourceType: sourceType): Promise<any> {
    return this.http.post(`${environment.api}/createSource`, sourceType).toPromise();
  }

  createPayment(payemtDetails: payemtDetailsTypes): Promise<any> {

    console.log(payemtDetails);

    return this.http.post(`${environment.api}/createPayment`, payemtDetails).toPromise();
  }




}
