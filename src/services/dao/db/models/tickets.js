import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const collectionName = 'tickets'

const stringTypeSchemaUniqueRequired = {
  type: String,
  unique: true,
  required: true,
}

const stringTypeSchemaNonUniqueRequired = {
  type: String,
  required: true,
}

const numberTypeSchemaNonUniqueRequired = {
  type: Number,
  required: true,
}

const ticketSchema = new mongoose.Schema(
  {
    code: stringTypeSchemaUniqueRequired,
    amount: numberTypeSchemaNonUniqueRequired,
    purchaser: stringTypeSchemaNonUniqueRequired,
  },
  { timestamps: true }
)

ticketSchema.plugin(mongoosePaginate)

const ticketsModel = mongoose.model(collectionName, ticketSchema)
export default ticketsModel
