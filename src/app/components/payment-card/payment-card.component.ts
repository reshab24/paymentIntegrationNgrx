import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, NativeDateAdapter } from '@angular/material/core';
import { State, Store } from '@ngrx/store';

import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { exhaustMap,switchMap, tap } from 'rxjs/operators';
import { custCreateCard, initCardStripe ,initiatePayCard,paymentCreateCard,paymentFailureCard, sourceCreateCard} from 'src/app/actions/card.actions';

import { PaymentService } from 'src/app/service/payment.service';
import { ToastServiceService } from 'src/app/service/toast-service.service';


export class CustomDateAdapter extends NativeDateAdapter {
  format(date: Date): string {
    var formatString = 'MM YYYY';
    return moment(date).format(formatString);
  }
}

@Component({
  selector: 'app-payment-card',
  templateUrl: './payment-card.component.html',
  styleUrls: ['./payment-card.component.scss'],
  providers: [
    {
      provide: DateAdapter, useClass: CustomDateAdapter
    }
  ]
})

export class PaymentCardComponent implements OnInit,OnDestroy {

  form: FormGroup;
  minData: Date;

  @ViewChild('saveButton', { static: true }) saveButton: ElementRef;

  cusId: string;

  private cardCallsSubs:Subscription;

  constructor(
    private _FB: FormBuilder,
    private paymentService: PaymentService,
    private tost: ToastServiceService,
    private store: Store<any>
  ) { }

  ngOnInit(): void {

    this.store.dispatch(initCardStripe());

    // this.paymentService.loadStripe();
    this.minData = new Date();

    // this.store.dispatch(paymentFailureCard({error: {}, message: 'error'}))

    this.form = this._FB.group({
      creditCardNumber: ['', Validators.required],
      cardHolder: ['', Validators.required],
      expirationDate: [new Date(), Validators.required],
      securityCode: ['', Validators.minLength(3)],
      amount: ['', [Validators.required]]
    })
  }

  // ngAfterViewInit() {

  //   fromEvent<any>(this.saveButton.nativeElement, 'click')
  //       .pipe(
  //           // exhaustMap(() => this.paymentService.createToken(this.form.value))
  //       )
  //       .subscribe(res=>{
  //         // console.log(res,"responce");
  //       });

  // }


  async pay() {

    if (this.form.invalid) {
      return;
    }

   this.store.dispatch(initiatePayCard({data:this.form.value}))

    //  this.store.dispatch(sourceCreateCard({data:this.store.select()}))


  //  console.log(result,"result");

    //  this.store.dispatch(custCreateCard({data:{'description': "test","email": "reshab24vai@gmail.com", "name": "reshab" }}))

    // this.store.dispatch(sourceCreateCard({data:{'customerId':this.store.select('')}}))


    // const { id, card } = await this.paymentService.createToken(this.form.value);

    // this.cardCallsSubs=this.paymentService.createCustomer({ 'description': "test", "email": "reshab24vai@gmail.com", "name": "reshab" })
    //   .pipe(
    //     tap(res => { this.cusId = res.cus.id }),
    //     switchMap(() => this.paymentService.createSource({ sourceToken: id, customerId: this.cusId })),
    //     switchMap(() => this.paymentService.createPayment({ amount: this.form.value.amount, cardId: card.id, customerId: this.cusId }))
    //   )
    //   .subscribe(res => {
    //     this.tost.openSnackBar("Card Data inserted successfully");
    //   })

  }


  ngOnDestroy(){
    this.cardCallsSubs.unsubscribe();
  }



}
