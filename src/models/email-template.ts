import { Schema, model } from 'mongoose'

export interface IEmailTemplate {
  type: string
  body: string
  subject: string
}

const emailTemplateSchema = new Schema<IEmailTemplate>({
  type: { type: String, required: true },
  body: { type: String, required: true },
  subject: { type: String, required: true }
})

const EmailTemplate = model<IEmailTemplate>('EmailTemplate', emailTemplateSchema)

export default EmailTemplate


// 