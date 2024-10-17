export interface IShortParking {
  name: string,
  value?: string,
  adress: {
    type: any,
    zip_code: string,
    number: string,
    neighborhood?: string,
    street: string
  },
  phone: {
    ddd: string,
    number: string
  }
}
