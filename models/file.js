/****************IMPORTING MONGOOSE*******************************/
const mongoose = require('mongoose');

const multer = require('multer');
const path = require('path');

const FILE_PATH = path.join('uploads/csv');

/***************CREATING USER SCHEMA*****************************/
const fileSchema = new mongoose.Schema({
    filePath: {
        type: String,
     },
     originalName: {
        type: String,
     },
     file: {
        type: String,
     },
},{
    timestamps: true,
});


/*******SETTINGS FOR UPLOADING FILE USING MULTER****************/
const storage = multer.diskStorage({
    destination : function(req, file, cb) {
        cb(null, path.join(__dirname,"..",FILE_PATH));
    }, filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '_' + uniqueSuffix);
    }
});

//static methods

fileSchema.statics.uploadedCSV = multer({ storage: storage}).single('file');
fileSchema.statics.csvPath = FILE_PATH;

/******************MAKING MODEL*********************************/

const File = mongoose.model('File', fileSchema);

/******************Exporting MODEL*********************************/

module.exports = File;