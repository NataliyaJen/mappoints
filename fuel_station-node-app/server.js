const express = require('express');
//const fileUpload = require('express-fileupload');
const cors = require('cors');
//const fs = require('fs');

const app = express();


// middle ware
//app.use(express.static('public')); //to access the files in public folder
app.use(cors()); // it enables all cors requests
//app.use(fileUpload());


// file upload api
app.post('/upload', (req, res) => {
    res.setHeader("Content-Type", "multipart/form-data");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent");
  
    try{

        
        if (!req.files) {
            return res.status(500).send({ msg: "file not found"})
        }
            // accessing the file
        const myFile = req.files;
        console.log(myFile);

        var buffer = myFile.data;
        var obj=buffer.toString('utf8');
        console.log(JSON.parse(obj));   

        return res.send(JSON.parse(obj)); 
    }catch(e){
        return res.status(500).send({ msg: "error1: "+e})
    }  
 
})

// file download api
app.post('/download', (req, res) => { 
    
    res.setHeader("Content-Type", "multipart/form-data");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent");


    if (!req.body.json) {
        return res.status(500).send({ msg: "body: "+req.body })
    }
    res.set({"Content-Disposition":"attachment; filename=\"current.json\""});

    res.send(JSON.stringify(req.body.json));  
    
})

module.exports = app

/* app.listen(4500, () => {
    console.log('server is running at port 4500');
}) */