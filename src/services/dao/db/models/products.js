import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const collectionName = 'products'

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

const productSchema = new mongoose.Schema(
  {
    title: stringTypeSchemaNonUniqueRequired,
    description: stringTypeSchemaNonUniqueRequired,
    code: stringTypeSchemaUniqueRequired,
    price: numberTypeSchemaNonUniqueRequired,
    status: {
      type: String,
      enum: ['Out of Stock', 'Inactive', 'Active'],
      default: 'Active',
    },
    stock: numberTypeSchemaNonUniqueRequired,
    category: stringTypeSchemaNonUniqueRequired,
    thumbnails: {
      type: [
        {
          name: String,
          reference: String,
        },
      ],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      default: 'Admin',
    },
  },
  { timestamps: true }
)

productSchema.plugin(mongoosePaginate)

productSchema.pre('findOne', function () {
  this.populate('owner')
})

const productsModel = mongoose.model(collectionName, productSchema)
export default productsModel
