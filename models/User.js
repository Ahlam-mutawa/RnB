const bcrypt = require('bcrypt')
const validator = require('validator')
const mongoose = require('mongoose')
const userSchema = mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  username: { type: String, required: true, unique: true, lowercase: true },
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
    throw Error('Password is weak. Password must be 8 character long and contain a lowercase, an uppercase, a number and a symbol')
  const hash = bcrypt.hashSync(password, 10)
  return { firstName, lastName, username: usernameL, emailAddress: emailAddressL, telNumber, password: hash }
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

// item: [{ type: mongoose.Schema.Types.ObjectId, refPath: 'Item' }],
// review: [{ type: mongoose.Schema.Types.ObjectId, refPath: 'Review' }],

// userSchema.virtual('score').get(async () => {
//     const total = await this.populate({ path: 'item', select: 'score' })
/*

authors = await Author.
find({}).
// Works, foreign field `author` is selected
populate({ path: 'posts', select: 'title author' }).
exec();

AuthorSchema.virtual('posts', {
ref: 'BlogPost',
localField: '_id',
foreignField: 'author',
match: { archived: false } // match option with basic query selector
});

*/

/*
User.find({})
  .populate({
    path: 'items',
    populate: {
      path: 'comments',
      model: 'Comment'
    }
  })
  .exec((err, users) => {
    if (err) {
      console.error(err);
    } else {
      console.log(users);
    }
  });
*/

// })
// userSchema.virtual('item', {
//     ref: 'Item',
//     localField: '_id',
//     foreignField: 'user'
// })
// userSchema.virtual('review', {
//     ref: 'Review',
//     localField: '_id',
//     foreignField: 'user'
// })

// userSchema.virtual('score').get(() => {
//     return this.populate({
//         {path: 'item',select: 'review'},
//         populate: { path: 'review' }
//     })
// })

// exporting User Model
module.exports = mongoose.model('User', userSchema)