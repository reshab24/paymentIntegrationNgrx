export interface creditCardDto{
  creditCardNumber:string,
  cardHolder:string,
  expirationDate:Date,
  securityCode?:string,
  amount:number,
  cardId?: string
}
