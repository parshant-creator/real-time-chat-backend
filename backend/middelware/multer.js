const multer = require("multer")
const path = require("path")

const storage = multer.diskStorage({
    destination:function(req,file,cb){
       cb(null,path.join(__dirname,"..","public","uploads"));
    },
    filename:function(req,file,cb){
    const uniqueSuffix = Date.now() +"-"+Math.random()*1000000
    const pathExt = path.extname(file.originalname)
    cb(null,file.fieldname+uniqueSuffix+pathExt)
    }
})


const fileFilter = (req,file,cb) =>{
    const allowedTypes = ["image/jpeg",'image/png',"Image/jpg","video/mp4","video/webm","application/pdf"];
    if(allowedTypes.includes(file.mimetype)){
        cb(null,true)
    }else{
        cb(new Error("only jpg,png and pdf allowed"),false)
    }
}

const uploads = multer({
    storage:storage,
    fileFilter:fileFilter,
    limits:{
        fieldSize:5*1024*1024  //5mb limit
    }
})

module.exports = uploads