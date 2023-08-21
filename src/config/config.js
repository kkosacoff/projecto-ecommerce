import * as dotenv from 'dotenv'
import { Command } from 'commander'
import { prodLogger, debugLogger } from '../logger.js'
// import { log } from 'winston'

const program = new Command() //Crea la instancia de comandos de commander.

program
  .option('-d', 'Variable para debug', false)
  .option('--persist <mode>', 'Modo de persistencia', 'mongodb')
  .option('--mode <mode>', 'Modo de trabajo', 'prod')
program.parse()

//console.log("Options: ", program.opts());
console.log('Environment Mode Option: ', program.opts().mode)
console.log('Persistence Mode Option: ', program.opts().persist)

const environment = program.opts().mode

dotenv.config({
  path:
    environment === 'prod'
      ? './src/config/.env.production'
      : './src/config/.env.development',
})

const logger = environment === 'prod' ? prodLogger : debugLogger

export default {
  port: process.env.PORT,
  mongoUrl: process.env.MONGO_URL,
  persistence: program.opts().persist,
  githubClient: process.env.GITHUB_CLIENT_ID,
  githubSecret: process.env.GITHUB_CLIENT_SECRET,
  gmailAccount: process.env.GOOGLE_APP_EMAIL,
  gmailAppPassword: process.env.GOOGLE_APP_PASSWORD,
  logger: logger,
}
