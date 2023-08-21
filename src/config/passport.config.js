import passport from 'passport'
import passportLocal from 'passport-local'
import GithubStrategy from 'passport-github2'
import userModel from '../services/dao/db/models/users.js'
import { createHash, isValidPassword } from '../utils.js'
import * as dotenv from 'dotenv'
dotenv.config()

const LocalStrategy = passportLocal.Strategy

const initializePassport = () => {
  // ? Register
  passport.use(
    'register',
    new LocalStrategy(
      { passReqToCallback: true, usernameField: 'email' },
      async (req, username, password, done) => {
        const { first_name, last_name, email, age, role } = req.body
        try {
          const exists = await userModel.findOne({ email })
          if (exists) {
            console.log('El usuario ya existe.')
            return done(null, false)
          }
          const user = {
            first_name,
            last_name,
            email,
            age,
            role,
            password: createHash(password),
            lastConnection: Date.now(),
          }
          const result = await userModel.create(user)
          return done(null, result)
        } catch (error) {
          return done('Error registrando el usuario: ' + error)
        }
      }
    )
  )

  // ? Login
  passport.use(
    'login',
    new LocalStrategy(
      { usernameField: 'email' },
      async (username, password, done) => {
        try {
          const user = await userModel.findOne({ email: username })
          if (!user) {
            console.log('User does not exist')
            return done(null, false)
          }
          if (!isValidPassword(user, password)) {
            return done(null, false)
          }
          user.lastConnection = Date.now()
          await user.save()
          return done(null, user)
        } catch (err) {
          return done(err)
        }
      }
    )
  )

  // ? Github Login
  passport.use(
    'github',
    new GithubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: '/api/sessions/githubCallback',
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log(`User Profile: ${profile}`)

        try {
          const user = await userModel.findOne({ email: profile._json.email })
          console.log(`User found for login ${user}`)

          if (!user) {
            console.warn(
              `User does not exist with email ${profile._json.email}`
            )
            let newUser = {
              first_name: profile._json.name,
              last_name: '',
              age: 18,
              email: profile._json.email,
              password: '',
              loggedBy: 'github',
              lastConnection: Date.now(),
            }
            const result = await userModel.create(newUser)
            return done(null, result)
          } else {
            // This means user already exists with that email
            return done(null, user)
          }
        } catch (err) {
          return done(err)
        }
      }
    )
  )

  // ? Serialize
  passport.serializeUser((user, done) => {
    done(null, user._id)
  })

  // ?Deserialize
  passport.deserializeUser(async (id, done) => {
    let user = await userModel.findById(id)
    done(null, user)
  })
}

export default initializePassport
