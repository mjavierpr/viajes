const Multer = require('multer');
const storage = Multer.diskStorage({
    destination: (req, imgFiles, callback) => {
        callback(null, './public/uploads');
    },     
    filename: (req, imgFiles, callback) => {
        // callback(null, Date.now() + parseInt(Math.random()*100)) + imgFiles.originalname;
        callback(null, "img" + Date.now() + parseInt(Math.random()*100) + imgFiles.originalname);
    } 
});
const upload = Multer({storage}); 

module.exports = upload;