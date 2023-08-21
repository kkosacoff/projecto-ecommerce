export default class UserDTO {
  constructor(user) {
    this.email = user.email
    this.fullName = user.first_name + ' ' + user.last_name
    ;(this.role = user.role), (this.lastConnection = user.lastConnection)
  }
}
