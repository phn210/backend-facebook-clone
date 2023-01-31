const multer = require('multer');
const path = require('path');
const uuid = require('uuid').v4;

const response = require('../controllers/responses');
const ERROR = require('../controllers/responses/error')
const File = require('../models/File');

const IMAGE_TYPES = /jpeg|jpg|png/;
const IMAGE_MAX_SIZE = 4 * 1000 * 1000;

const VIDEO_TYPES = /mp4|mov|avi|mpe|mpeg|mpeg4|wmv|gif|3g2|3gp|3gpp|mkv|x-matroska/;
const VIDEO_MAX_SIZE = 10 * 1000 * 1000;

function checkFile(file, cb, type){
    // Allowed ext
    const filetypes = (type == 'video') ? VIDEO_TYPES : IMAGE_TYPES;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);
  
    if (!(mimetype && extname)) cb(ERROR.PARAMETER_TYPE_IS_INVALID);

    const limit = (type == 'video') ? VIDEO_MAX_SIZE : IMAGE_MAX_SIZE;
    if (file.size > limit) cb(ERROR.FILE_SIZE_IS_TOO_BIG);

    cb(null, true);
}

function upload() {
    return multer({ 
        storage: multer.diskStorage({
            destination: `./public/uploads/`,
            filename: function ( req, file, cb ) {
                cb(null, file.fieldname+'-'+uuid()+path.extname(file.originalname));
            }
        }),
        fileFilter: function(_req, file, cb){
            if (file.fieldname == 'video') checkFile(file, cb, 'video');
            else checkFile(file, cb, 'image');
        }
    })
    .fields([
        { name: 'avatar', maxCount: 1 },
        { name: 'cover', maxCount: 1 },
        { name: 'image', maxCount: 4 },
        { name: 'video', maxCount: 1  }
    ]);
}

module.exports = {
    upload
}