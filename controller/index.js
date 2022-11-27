
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken');
const jwtconfig = require('../config/jwt');
var database = require("../models/users");
var filedb = require("../models/users_files");
const path = require("path")
const SALT_ROUNDS = 10;
require("../config/db_config")
const { create, CID } = require("ipfs-http-client");
const fs = require("fs")





//! user registration
exports.register = async (req, res) => {


    try {
        var data = {}
        
        data.userEmail = req.body.email;
        var password = req.body.password
        var confirm_password = req.body.confirm_password
        if (password === confirm_password) {
            const hash = await bcrypt.hash(req.body.password, SALT_ROUNDS);
            data.userPassword = hash
        } else {
            return res.send({ code: 400, status: false, message: "password dint match" });
        }
        //! Note:If KYC files is not attached
        
        if (req.files === null || req.files === undefined) {

            const user_Data = await database.create(data, (err) => {
                if (err) {
                    console.log(err)
                } else {
                    console.log("User creation success")
                }
            })
            return res.send({ code: 200, status: true, message: "User registered without kyc upload", data: user_Data });
            
        } 
        //! Note:If kyc files is attached 
        else {
            var file_data = req.files.Files
            const userData = await database.create(data, (err, data) => {
                if (err) {
                    console.log(err)
                } else {
                    console.log("creation success")
                }
            })
            var fileBuffer = Buffer.from(file_data.data, 'base64')
            const kyc_doc = await saveipfsFile(fileBuffer)
            console.log("kyc_doc", kyc_doc)
        }
    } catch (err) {
        res.send({
            status: false,
            message: err.message
        })
    }
}
//! user login
exports.login = async (req, res) => {

    try {
        let data = req.body.email;
        //parse data and check it contains mobile or email
        if (data.includes('@')) {
            const userData = await database.find({ userEmail: data })
            if (userData) {
                var keyed_password = req.body.password
                var stored_password = userData[0].userPassword

                var password_validation = bcrypt.compareSync(keyed_password, stored_password, (err, result) => {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log("status", result)
                    }
                })
                if (password_validation) {
                    var token = jwt.sign({ id: userData._id }, jwtconfig.secret, {
                    });
                    res.send({
                        status: true,
                        message: "user found",
                        data: userData,
                        token: token
                    })
                } else {
                    res.send({
                        status: false,
                        message: "Password is incorrect"
                    })
                }
            } else {
                res.send({
                    status: false,
                    message: "No data found"
                })
            }
        } else {
            res.send({
                status: false,
                message: "provide email_id"
            })
        }
    } catch (err) {
        
        res.send({
            status: false,
            message: err.message
        })
    }
}
//! UploadFiles
exports.uploadfiles = async (req, res) => {

    try {
        if (req.files === null || req.files === undefined ) {
            res.json({ status: false, message: "Files object not found" })
        }
        if (Object.keys(req.files).length !== 0) {
            let Filedata = req.files.Files;
            var doc_id = Math.floor(100000 + Math.random() * 1250);
            var file_name = doc_id + Filedata.name
            let uploadPath = path.join(__dirname, '../uploads/')
            var input_data = {}
            let uploadfiles = await Filedata.mv(uploadPath + file_name, function (err, data) {
                if (err) {
                    console.log(err)
                }
                console.log("File uploadeded successfully to directory /uploads")
            });
            input_data.id = doc_id,
                input_data.file_name = Filedata.name,
                input_data.file_size = Filedata.size,
                input_data.file_path = uploadPath
            let saving_file_path = await filedb.create(input_data, (err, data) => {
                if (err) {
                    console.log(err)
                } else {
                    console.log("File record saved successfully to Database")
                }
            })
            res.json({ status: true, message: "Files uploaded successfully", doc_id: doc_id })
        } else {
            res.json({ status: false, message: "Files object not found" })
        }
    } catch (err) {
        console.log(err)
    }
}
//! fetches all users data
exports.getall = async (req, res) => {
    try {
        var response = {}
        var all_data = await database.find({}, (err, data) => {
            if (err) {
                response = { "status": false, "message": "Error fetching data" };
            } else {
                response = { "status": true, "message": data };
            }
            res.json(response);
        })
    } catch (err) {
        console.log(err)
    }
}
//! fetches all uploaded files
exports.getall_files = async (req, res) => {

    try {
        var response = {}
        var all_data = await filedb.find({}, (err, data) => {
            if (err) {
                response = { "status": false, "message": "Error fetching data" };
            } else {
                response = { "status": true, "message": data };
            }
            res.json(response);
        })
    } catch (err) {
        console.log(err)
    }
}




//! ipfs settings
const ipfs_connection = create('http://localhost:5002')

// async function ipfsClient() {
//     const ipfs = await create(
//         {
//             host: "ipfs.infura.io",
//             port: 3000,
//             protocol: "http",
//             // apiPath: '/ipfs/api/v0' 
//         }
//     );
//     return ipfs;
// }

async function saveipfsFile(fileBuffer) {
    console.log("file_path", fileBuffer)
    // let ipfs = await damon.ipfsClientasync();
    // let ipfs = await ipfsClient();
    // var fileBuffer = Buffer.from(file_path, 'base64')
    let data = fileBuffer
    console.log("====================>")
    // fs.readFileSync(file_path.data)
    // let options = {
    //     warpWithDirectory: false,
    //     progress: (prog) => console.log(`Saved :${prog}`)
    // }
    let result = await ipfs_connection.add(data);
    console.log("====================>00")
    console.log("kyc success!!",result)
    return result
}