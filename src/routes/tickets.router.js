import { Router } from 'express'
import TicketController from '../controllers/ticket.controller.js'

const tc = new TicketController()
const router = Router()

// Query ticket by ID
router.get('/:tid', tc.getTicket)

export default router
