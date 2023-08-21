import nodemailer from 'nodemailer'
import config from '../config/config.js'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  port: 587,
  auth: {
    user: config.gmailAccount,
    pass: config.gmailAppPassword,
  },
})

transporter.verify(function (error, success) {
  if (error) {
    console.log(error)
  } else {
    console.log('Server is ready to take our messages')
  }
})

const mailOptions = {
  from: 'Coder Test ' + config.gmailAccount,
  to: config.gmailAccount,
  subject: 'Correo de prueba Coderhouse Programacion Backend clase 30.',
  html: `<div><h1>Esto es un Test de envio de correos con Nodemailer!</h1></div>`,
}

export const sendEmail = (req, res) => {
  try {
    let result = transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error)
        res.status(400).send({ message: 'Error', payload: error })
      }
      console.log('Message sent: ', info.messageId)
      res.send({ message: 'Success', payload: info })
    })
  } catch (error) {
    console.error(error)
    res.status(500).send({
      error: error,
      message: 'No se pudo enviar el email desde:' + config.gmailAccount,
    })
  }
}

export default transporter
