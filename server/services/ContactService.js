import mongoose from "mongoose"
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const _model = new Schema({
    name: { type: String, required: true },
    relationship: { type: String, required: true },
    authorId: { type: ObjectId, ref: 'User', required: true }
}, { timestamps: true })

export default class ContactService {
    get repository() {
        return mongoose.model('Contact', _model)
    }
}