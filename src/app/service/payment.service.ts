import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { rejects } from 'assert';
import { resolve } from 'dns';
import { promise } from 'protractor';
import { from, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { creditCardDto, customerObject, payemtDetailsTypes, sourceType } from '../dto/creditCardDto';



@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private http: HttpClient) { }

  loadStripe(): Observable<boolean> {
    return from(
      new Promise<boolean>((res, rej) => {
        if (!window.document.getElementById('stripe-custom-form-script')) {
          const s = window.document.createElement("script");
          s.id = "stripe-custom-form-script";
          s.type = "text/javascript";
          s.src = environment.stripeUrl;
          s.onload = () => {
            window['Stripe'].setPublishableKey(environment.publishStripeKey);
            res(true);
          }

          s.onerror = (err) => rej(err);

          window.document.body.appendChild(s);
        }
      })
    )
  }

  createToken(formData: creditCardDto): Observable<any> {

    const { creditCardNumber, expirationDate, securityCode } = formData;

    return from(
      new Promise((resolve, reject) => {

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
    )

  }


  createCustomer(customerData: customerObject): Observable<{ cus: { id: string } }> {
    return this.http.post<{ cus: { id: string } }>(`${environment.api}/createCustomer`, customerData)
  }

  createSource(sourceType: sourceType): Observable<any> {
    return this.http.post(`${environment.api}/createSource`, sourceType);
  }

  createPayment(payemtDetails: payemtDetailsTypes): Observable<any> {
    return this.http.post(`${environment.api}/createPayment`, payemtDetails);
  }




}
