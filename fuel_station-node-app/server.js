const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const fs = require('fs');


const app = express();

// middle ware
app.use(express.static('public')); //to access the files in public folder
app.use(cors()); // it enables all cors requests
app.use(fileUpload());



// file upload api
app.post('/upload', (req, res) => {

    if (!req.files) {
        return res.status(500).send({ msg: "file is not found" })
    }
        // accessing the file
    const myFile = req.files.file;
    console.log(myFile);

    var buffer = myFile.data;
    var obj=buffer.toString('utf8');
    console.log(JSON.parse(obj));
    return res.send(JSON.parse(obj));   

})

// file download api
app.post('/download', (req, res) => {

    if (!req.body.json) {
        return res.status(500).send({ msg: "json is not found" })
    }
    res.set({"Content-Disposition":"attachment; filename=\"current.json\""});
    res.send(JSON.stringify(req.body.json));
   
    
})

// json save api
app.post('/save', (req, res) => {
    //console.log("log:" +JSON.parse(req.body.json));
    if (!req.body.json) {
        return res.status(500).send({ msg: "json is not found" })
    }
    fs.writeFileSync(`${__dirname}/public/jsonMap.json`, req.body.json);

    //console.log("myFile: "+myJson);  
    return  res.send(true);
    
})



app.listen(4500, () => {
    console.log('server is running at port 4500');
})