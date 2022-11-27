#1 after clone 'npm install --save'
#2 to start the server 'npm start'
#3 main file is 'server.js'
#4 routes are as below:
    #URL->POST->localhost:3000/api/signup
        api->body->form->req.body(sample)
        email:"sample@mail.com"
        password:"sample_password"
        confirm_password:"sample_password"
        Files:"Files"

    #URL->GET->localhost:3000/api/login    
        api->body->json->req.body(sample)
        "email":"sample@mail.com",
        "password":"sample_password"

    #URL->POST->localhost:3000/api/uploadfiles    
        api->body->form->req.body(sample)
        Files:"Files"

    #URL->GET->localhost:3000/api/getall
        Note:To fetch all user records

    #URL->GET->localhost:3000/api/getall_files
        Note:To fetch all Files records