import mongoose from 'mongoose'
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const _model = new Schema({
    type: { type: String, enum: ['email', 'mobile', 'work', 'address', 'home'], required: true },
    value: { type: String, required: true },
    contactId: { type: ObjectId, ref: 'Contact', required: true },
    authorId: { type: ObjectId, ref: 'User', required: true }
}, { timestamps: true })


export default class ContactDetailsService {
    get repository() {
        return mongoose.model('ContactDetails', _model)
    }
}