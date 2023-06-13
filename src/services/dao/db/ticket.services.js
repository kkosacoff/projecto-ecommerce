import ticketsModel from './models/tickets.js'

export default class TicketManager {
  constructor() {}

  // Class Methods

  createTicket = async (amount, purchaser) => {
    const newTicket = await ticketsModel.create({
      code: Date.now(),
      amount,
      purchaser,
    })
    return newTicket
  }

  getTicket = async (id) => {
    const ticket = ticketsModel.findById(id)
    return ticket ? ticket : ''
  }
}
