import { Schema, model } from 'mongoose'

export interface IServiceCountry {
  name: string
  code: string
  billingCurrency: string
  currencyName: string
  currencyCode: string
  callingCode: string
}

const serviceCountrySchema = new Schema<IServiceCountry>({
  name: { type: String, required: true },
  code: { type: String, required: true },
  billingCurrency: { type: String, required: true },
  currencyName: { type: String, required: true },
  currencyCode: { type: String, required: true },
  callingCode: { type: String, required: true }
})

const ServiceCountry = model<IServiceCountry>('ServiceCountry', serviceCountrySchema)

export default ServiceCountry