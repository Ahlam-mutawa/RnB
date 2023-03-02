const multer = require('multer');
const path = require('path')


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log(file.fieldname)
    if (file.fieldname === 'profileImage') {
      cb(null, './public/images/profile/')
    } else if (file.fieldname === 'itemImage')
      cb(null, './public/images/items/')
    else cd(null, false)
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '.' + file.originalname.split('.').pop());
  }
});


const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  }

})

module.exports = upload