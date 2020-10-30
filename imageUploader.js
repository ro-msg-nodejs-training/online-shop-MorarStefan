const multer = require('multer');

const imageStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './tmp/');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + file.originalname);
    }
});

const imageFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({
    storage: imageStorage,
    limits: {
        fileSize: 3 * 1024 * 1024
    },
    fileFilter: imageFilter
});

module.exports = upload;