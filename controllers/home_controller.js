const File = require('../models/file');

const csv = require("csv-parser");
const fs = require("fs");
const path = require("path");
const FILES_PATH = path.join("/uploads/csv");

// export home
module.exports.home = async function (req, res) {

    try {
        let files = await File.find({})
        .sort('-createdAt');
        // console.log(files)
        return res.render('home', {
            title: 'CSV Upload',
            files: files,
        });

    } catch (error) {
        console.log('Error', error);

    }
}


//update user datails
module.exports.uploadFile = async function (req, res) {
    try {
        // let user = await User.findById(req.params.id);

        //as its multipart/formdata cant use params DIRECTLY so will use static functions
        File.uploadedCSV(req, res, async function (err) {
            if (err) { console.log('******Multer Error: ', err); }



            console.log(req.file);
            if (
                (req.file && req.file.mimetype == "application/vnd.ms-excel") ||
                (req.file && req.file.mimetype == "text/csv")
            ) {

                console.log("true");
                console.log(req.file);




                let file = await File.create({
                    filePath: req.file.path,
                    file: req.file.filename,
                    originalName: req.file.originalname
                });


                if (err) {
                    console.log(err);
                    return res.status(400).json({
                        message: 'Error in creating Note or Uploading File',
                    });
                }
                console.log("file Uploaded")
                return res.redirect('back');



            } else {
                console.log("Please Upload CSV Format file");

                // todo add alert
                return res.redirect("back");
            }



            return res.redirect('back');

        });

    } catch (error) {

        console.log('cant update', error);
        return res.redirect('back');
    }

}

//showing the file
module.exports.showFile = async function (req, res) {

    console.log('inside showfile', req.query);

    let filePath = await File.findById(req.query.file_id);
    console.log(filePath);

    const results = [];
    const header = [];

    //STEAMING THE FILE
    fs.createReadStream(filePath.filePath)
        .pipe(csv())
        .on("headers", (Headers) => {
            Headers.map((head) => {
                header.push(head);
            });
            console.log("header => ", header);

        })
        .on("data", (data) => results.push(data))
        .on("end", () => {
            console.log(results.length);
            let page = req.query.page;
            console.log('page => ',req.query.page);
            let startSlice = (page - 1) * 100 + 1;
            let endSlice = page * 100;
            let SliceResults = [];
            let totalPages = Math.ceil(results.length / 100);

            if (endSlice < results.length) {
                SliceResults = results.slice(startSlice, endSlice + 1);
            } else {
                SliceResults = results.slice(startSlice);
            }

            return res.render('file', {
                title: filePath.originalName,
                head: header,
                data: SliceResults,
                length: results.length,
                page: req.query.page,
                totalPages: totalPages,
                file: filePath
            })
        });


}


//delete files
module.exports.deleteFile = async function(req, res){
    console.log(req.params.id);
    try {
        
        const fileName = req.params.id;
        const isFile = await File.findOne({file: fileName});
        console.log(isFile)
        if(isFile){

            fs.unlinkSync(isFile.filePath);
            await File.deleteOne({file: fileName});
            console.log('File is delted');
            return res.redirect('back');
        }else{
            console.log('file  not found');
            return res.redirect('back');

        }



    } catch (error) {
        console.log(error);
        return res.statu(500).json({
           message: "Internal Server Error",
        });
    }
}