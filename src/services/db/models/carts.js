import mongoose from 'mongoose'

const collectionName = 'cart'

const cartSchema = new mongoose.Schema(
  {
    products: {
      type: [
        {
          product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'products',
          },
          quantity: { type: Number },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
)

cartSchema.pre('findOne', function () {
  this.populate('products.product')
})

const cartsModel = mongoose.model(collectionName, cartSchema)
export default cartsModel
