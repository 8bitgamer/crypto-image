var passwordHash = require('password-hash');
var mailer = require('../Mail/mailer');
//---------------------------------------------signup page call------------------------------------------------------
exports.signup = function(req, res){
   message = '';
   if(req.method == "POST"){
        var post  = req.body;
        var name= post.user_name;
        var pass = passwordHash.generate(post.password);
        var fname= post.first_name;
        var lname= post.last_name;
        var mob= post.mob_no;
        var sql = "INSERT INTO `users`(`first_name`,`last_name`,`mob_no`,`user_name`, `password`) VALUES ('" + fname + "','" + lname + "','" + mob + "','" + name + "','" + pass + "')";
        var query = db.query(sql, function(err, result) {
            message = "Succesfully! Your account has been created.";
            res.render('signup.ejs',{message: message});
        });

      // send confirmation email
      mailer.sendMail();

   } else {
      res.render('signup');
   }
};
 
//-----------------------------------------------login page call------------------------------------------------------
exports.login = function(req, res){
   var message = '';
   var sess = req.session; 

   if(req.method == "POST"){
      var post  = req.body;
      var name= post.user_name;
      var passwordEntered = post.password;

        var sql="SELECT id, first_name, last_name, user_name, password FROM `users` WHERE `user_name`='"+name+"'";                        
        
        db.query(sql, function(err, results) {       
            if(results.length){
                req.session.userId = results[0].id;
                req.session.user = results[0];
                req.session.password = results[0].password;

                if (passwordHash.verify(passwordEntered,req.session.password)){
                   console.log ("login successful");
                   res.redirect('/home/dashboard');
                }
                else {
                    console.log("incorrect password");
                    message = 'Wrong Password.';
                    res.render('index.ejs',{message: message});
                }
            }
            else{
                message = 'User Not FOUND, you idiot.';
                res.render('index.ejs',{message: message});
            }
                 
        });
   } else {
      res.render('index.ejs',{message: message});
   }
           
};
//-----------------------------------------------dashboard page functionality----------------------------------------------
           
exports.dashboard = function(req, res, next){
           
   var user =  req.session.user,
   userId = req.session.userId;
   console.log('UserID: '+userId);
   if(userId == null){
      res.redirect("/login");
      return;
   }

   var sql="SELECT * FROM `users` WHERE `id`='"+userId+"'";

   db.query(sql, function(err, results){
      res.render('dashboard.ejs', {user:user});    
   });       
};
//------------------------------------logout functionality----------------------------------------------
exports.logout=function(req,res){
   req.session.destroy(function(err) {
      res.redirect("/login");
   })
};
//--------------------------------render user details after login--------------------------------
exports.profile = function(req, res){

   var userId = req.session.userId;
   if(userId == null){
      res.redirect("/login");
      return;
   }

   var sql="SELECT * FROM `users` WHERE `id`='"+userId+"'";          
   db.query(sql, function(err, result){  
      res.render('profile.ejs',{data:result});
   });
};
//---------------------------------edit users details after login----------------------------------
exports.editprofile=function(req,res){
   var userId = req.session.userId;
   if(userId == null){
      res.redirect("/login");
      return;
   }

   var sql="SELECT * FROM `users` WHERE `id`='"+userId+"'";
   db.query(sql, function(err, results){
      res.render('edit_profile.ejs',{data:results});
   });
};


