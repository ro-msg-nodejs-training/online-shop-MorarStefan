const multer = require("multer");

const imageStorage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, "./tmp/");
  },
  filename: function (_req, file, cb) {
    cb(null, Date.now() + file.originalname);
    // "Multer.File.originalname" is a property that returns the name of the file on the uploader's computer
  },
});

const imageFilter = (_req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: imageStorage,
  limits: {
    fileSize: 3 * 1024 * 1024,
  },
  fileFilter: imageFilter,
});

module.exports = upload;
