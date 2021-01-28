export interface creditCardDto {
  creditCardNumber: string,
  cardHolder: string,
  expirationDate: Date,
  securityCode?: string,
  amount: number,
  cardId?: string
}


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
export interface CardState {
  cardDetails: creditCardDto,
  sourceToken: string
}
