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
  // fileFilter: (req, res, file, cb) => {
  //   const ext = path.extname(file.originalname)
  //   if (ext !== '.jpg' && ext !== '.jpeg ' && ext !== '.png')
  //     return callback(new Error('Only images .jpg are allowed'))
  //   cb(null, true)
  // }
})

module.exports = upload

// app.post('/upload', upload.single('image'), (req, res) => {
//   res.send('Image uploaded successfully');
// });

//   In this example, we are using the upload.single() method to handle a single file upload with the field name of image.

//   Finally, you can test your image upload endpoint using a form with an input field of type file:


// <form action="/upload" method="post" enctype="multipart/form-data">
//   <input type="file" name="image">
//     <button type="submit">Upload Image</button>
// </form>



