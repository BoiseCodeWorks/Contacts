import express from 'express'
import ContactService from '../services/ContactService'
import { Authorize } from '../middleware/authorize.js'
import ContactDetailsService from '../services/ContactDetailsService'

let _contactService = new ContactService().repository
let _contactDetailsService = new ContactDetailsService().repository


export default class ContactController {
    constructor() {
        this.router = express.Router()
            //NOTE all routes after the authenticate method will require the user to be logged in to access
            .use(Authorize.authenticated)
            .get('', this.getAll)
            .get('/:id', this.getById)
            .get('/:id/details', this.getContactDetails)
            .post('', this.create)
            .put('/:id', this.edit)
            .delete('/:id', this.delete)
    }

    async getAll(req, res, next) {
        try {
            //NOTE adding authorId insures to only get objects for the person who is logged in
            let data = await _contactService.find({ authorId: req.session.uid })
                .populate('authorId', 'name')
            return res.send(data)
        } catch (error) { next(error) }

    }

    async getById(req, res, next) {
        try {
            let data = await _contactService.findOne({ _id: req.params.id, authorId: req.session.uid })
            if (!data) {
                throw new Error("Invalid Id")
            }
            res.send(data)
        } catch (error) { next(error) }
    }

    async getContactDetails(req, res, next) {
        try {
            let data = await _contactDetailsService.find({ contactId: req.params.id })
                .populate('authorId', 'name')
                .populate('contactId', 'name')
            return res.send(data)
        } catch (error) { next(error) }
    }

    async create(req, res, next) {
        try {
            //NOTE the user id is accessable through req.body.uid, never trust the client to provide you this information
            req.body.authorId = req.session.uid
            let data = await _contactService.create(req.body)
            res.send(data)
        } catch (error) { next(error) }
    }

    async edit(req, res, next) {
        try {
            let data = await _contactService.findOneAndUpdate({ _id: req.params.id, authorId: req.session.uid }, req.body, { new: true })
            if (data) {
                return res.send(data)
            }
            throw new Error("invalid id")
        } catch (error) {
            next(error)
        }
    }

    async delete(req, res, next) {
        try {
            let data = await _contactService.findOneAndRemove({ _id: req.params.id, authorId: req.session.uid })
            if (!data) {
                throw new Error("invalid id")
            }
            res.send("deleted Contact")
        } catch (error) { next(error) }

    }

}