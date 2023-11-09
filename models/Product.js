const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2');

const cartSchema = new mongoose.Schema(
  {
    id:{type:String, unique:true},
    title:{type:String},
    description:{type:String},
    code:{type:String},
    price:{type:Number},
    status:{type:Boolean},
    stock:{type:Number},
    category:{type:String},
    thumbnails:{type:String}
  })

cartSchema.plugin(mongoosePaginate)

module.exports = mongoose.model('Cart', cartSchema)
