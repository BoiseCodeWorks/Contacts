import express from 'express'
import ContactDetailsService from '../services/ContactDetailsService'
import { Authorize } from '../middleware/authorize.js'

let _repo = new ContactDetailsService().repository

export default class ContactDetailsController {
    constructor() {
        this.router = express.Router()
            //NOTE all routes after the authenticate method will require the user to be logged in to access
            .use(Authorize.authenticated)
            .get('/:id', this.getById)
            .post('', this.create)
            .put('/:id', this.edit)
            .delete('/:id', this.delete)
    }
    async getById(req, res, next) {
        try {
            let data = await _repo.findOne({ _id: req.params.id, authorId: req.session.uid })
            if (!data) {
                throw new Error("Invalid Id")
            }
            res.send(data)
        } catch (error) { next(error) }
    }

    async create(req, res, next) {
        try {
            req.body.authorId = req.session.uid
            let data = await _repo.create(req.body)
            res.send(data)
        } catch (error) { next(error) }
    }
    async edit(req, res, next) {
        try {
            let data = await _repo.findOneAndUpdate({ _id: req.params.id, authorId: req.session.uid }, req.body, { new: true })
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
            let data = await _repo.findOneAndRemove({ _id: req.params.id, authorId: req.session.uid })
            if (!data) {
                throw new Error("invalid id")
            }
            res.send("deleted Details")
        } catch (error) { next(error) }

    }








}