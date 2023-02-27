const Review = require('../models/Review')

exports.review_add_post = (req, res) => {
  const data = req.body
  data.score = parseInt(req.body.score)
  const review = new Review(data)
  review.save()
    .then(() => {
      res.redirect('/review')
    })
    .catch(err => console.log(err))
}

exports.review_add_get = (req, res) => {
  res.render('review/add')
}

exports.review_index_get = (req, res) => {
  Review.find()
    .then((reviews) => {
      res.render('review/index', { reviews })
    })
    .catch(err => {
      console.log(err)
    })
}