import { required } from 'joi'
import { Schema, model } from 'mongoose'

export interface IContent {
  userId: string
  type: string
  publicId: string
  url: string
  createdAt: Date
}

const contentSchema = new Schema<IContent>({
  userId: { type: String, required: true },
  type: { type: String, required: true },
  publicId: { type: String, required: true },
  url: {type: String},
  createdAt: {type: Date}
})

const Content = model<IContent>('Content', contentSchema)

export default Content
