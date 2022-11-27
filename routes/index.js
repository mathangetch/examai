const router = require('express').Router();
const user_controller = require('../controller/index');
require("../config/db_config")


router.post('/signup', user_controller.register);
router.get('/login', user_controller.login);
router.post('/uploadfiles', user_controller.uploadfiles);
router.get('/getall', user_controller.getall);
router.get('/getall_files', user_controller.getall_files);




module.exports = router;