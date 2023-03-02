const bcrypt = require('bcrypt')
const validator = require('validator')
const mongoose = require('mongoose')
const userSchema = mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  username: { type: String, required: true, unique: true, lowercase: true },
  profileImage: { type: String, default: "default.jpg" },
  emailAddress: { type: String, required: true, unique: true, lowercase: true },
  telNumber: { type: String, required: true },
  password: { type: String, required: true },
  credit: { type: Number, default: 0 },

}, { timestamps: true })


// verfiy email and password match
userSchema.statics.verify = async function (emailAddress, password) {
  if (!emailAddress || !password)
    throw Error('All fields must be filled')
  const user = await this.findOne({ emailAddress })
  if (!user)
    throw Error('Incorrect email')
  const match = bcrypt.compareSync(password, user.password)
  if (!match)
    throw Error('Incorrect password')
  return user
}

// validate new user info
userSchema.statics.isValid = async function ({ firstName, lastName, username, emailAddress, telNumber, password }) {
  //validation
  if (!firstName || !lastName || !username || !emailAddress || !telNumber || !password)
    throw Error('All fields must be filled')
  let usernameL = username.toLowerCase()
  let emailAddressL = emailAddress.toLowerCase()
  if (!validator.isEmail(emailAddressL))
    throw Error('Email is not valid')
  if (await this.findOne({ username: usernameL }).exec())
    throw Error('Username already registered')
  const emailExist = this.findOne({ emailAddress: emailAddressL })
  if (await this.findOne({ emailAddress: emailAddressL }))
    throw Error('Email already registered')
  if (!validator.isStrongPassword(password))
    throw Error('Password is weak.')
  const hash = bcrypt.hashSync(password, 10)
  return { firstName, lastName, username: usernameL, emailAddress: emailAddressL, telNumber, password: hash }
}

// change password
userSchema.statics.changePassword = async function ({ id, password, newPassword1, newPassword2 }) {
  if (!password || !newPassword1 || !newPassword2)
    throw Error('All fields must be filled')
  if (newPassword1 !== newPassword2)
    throw Error('New password mismatch')
  if (!validator.isStrongPassword(newPassword1))
    throw Error('Password is weak.')
  const user = await this.findById(id)
  if (!user)
    throw Error('Sign in!')
  const match = bcrypt.compareSync(password, user.password)
  if (!match)
    throw Error('Incorrect password')
  const hash = bcrypt.hashSync(newPassword1, 10)
  user.password = hash
  await user.save()
    .then(console.log('changed'))
    .catch(() => { throw Error('Try again') })
}
userSchema.virtual('item', {
  ref: 'Item',
  localField: '_id',
  foreignField: 'owner'
})
userSchema.virtual('borrowedItem', {
  ref: 'Item',
  localField: '_id',
  foreignField: 'borrower'
})


userSchema.set('toObject', { virtuals: true })

module.exports = mongoose.model('User', userSchema)