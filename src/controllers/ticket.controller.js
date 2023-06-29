import TicketManager from '../services/dao/db/services/ticket.services.js'

const tm1 = new TicketManager()

export default class TicketController {
  getTicket = async (req, res) => {
    const ticket = await tm1.getTicket(req.params.tid)

    if (ticket) {
      res.send({ status: 'Success', msg: ticket })
    } else {
      res.send({
        status: 'Error',
        msg: `Ticket ${req.params.tid} could not be found`,
      })
    }
  }
}
