const express = require('express')
var fs = require("fs");
const app = express()
const port = 3000

var session = require('express-session');

app.use(express.static("public"));
app.use(express.json());

app.use(session({
	secret: 'keyboard cat',
	resave: true,
	saveUninitialized : true,
}))



app.get('/', (req, res) => {
	// res.send("__dir")
	// fs.readFile("./public/login.html","utf-8",function(err,data){
	// 		  if(err){
	// 				  res.end("some wroung occur");
	// 			}else{
	// 				 res.end(data);
	// 			}
	// 	 })
	// console.log(test)
	
		// console.log(req.session.isLoggedIn+" yaha")
	if(req.session.isLoggedIn){

		
		res.sendFile(__dirname+"/public/todo.html");
		
	}
	else{
		res.redirect("/login.html");

	}

})

// app.get('/login.js', (req, res) => {
// 	// res.send("__dir")
// 	fs.readFile("./public/login.js","utf-8",function(err,data){
// 			  if(err){
// 					  res.end("some wroung occur");
// 				}else{
// 					 res.end(data);
// 				}
// 		 })
// })

app.post("/signup", (req, res)=>{

	  var users = [];

		// users.push(req.body);
		readUser(function(err,data){
			if(err){
				users.push(req.body);
				fs.writeFile("./db.txt",JSON.stringify(users),function(err){
															
													if(err){
														res.end("error occured");
													}
													else{
														// console.log(users);
														res.status(200);
														res.end();
													}
											})
			}
			else{

				users = data;
				users.forEach(function(user){
					if(user.username === req.body.username){
						res.status(404);
						res.end("user alreay exist");
					}
				})
				users.push(req.body);
				fs.writeFile("./db.txt",JSON.stringify(users),function(err){
												if(err){
													res.end("error occured");
												}
												else{
													res.status(200);

													res.end();
												}
				})

			}


		})
	
})

app.post("/login", (req, res) => {
	
	// res.sendFile(__dirname+"/public/login.html");
	var username = req.body.username;
	var pass = req.body.password;

  readUser(function (err, users){

		if(err){
			res.status(404);
			res.end("user not found");
		}

		else{

		
			var ouruser = false;
			users.forEach(function(user){
				if(user.username === username && user.password === pass){
					req.session.isLoggedIn = true;
					ouruser = true;
					req.session.user = username;
					console.log(req.session.isLoggedIn+"hkhkh")
					res.status(200)
					res.end("login success");
					// break;
				}
					
			});
				if(ouruser === false){
					res.status(404);
					res.end("login failed");
				}
	

		}

	})

})


function readUser(callback){

	fs.readFile("./db.txt", "utf-8", function(err, data){
		if(err)
		{

			callback(err, null)	;

		}
		else{
			if(data.length){
						 				var users = JSON.parse(data);
										callback(null,users);

							 }else{
								    callback(true,null);
							 }

			// var users = JSON.parse(data);
			// callback(null, users);
		}
	})
}

// todoapp part2 main.js

app.post("/save",function(request,response){
	        //  console.log(request.body);
					var x = request.body;
					 fs.readFile("./dbstore.txt","utf-8",function(err,data){

						  if(err)
							{
								res.status(404)
								res.end("error occurred while saving todo!");
							}
							else{

								var todos = [];
								
								if(data.length > 0){
									 todos = JSON.parse(data);
							  }
								request.body.user = request.session.user;
								todos.push(request.body);
								
								fs.writeFile("./dbstore.txt",JSON.stringify(todos),function(err){
										
										if(err){
											response.end("error occured");
										}
										else
												response.send(x);
												// response.end(x);
				     	  })
							}
						    
			      })		 

				  
})

app.get("/getUserName",function(req,res)
{
	var name = req.session.user;
	console.log(name);
	res.json({name:name});
})


app.get("/todo",function(request,response){
		//	response.end(JSON.stringify(todo));
		fs.readFile("./dbstore.txt","utf-8",function(err,data){
				console.log(data.length, "asdfghj")
				console.log(data)
			 response.end(data);
		})
})



app.post("/update",function(request,response){
	     fs.readFile("./dbstore.txt","utf-8",function(err,data){
						    
								var todos = [];
								// console.log(request.body.id+" ye wali");
								
								if(data.length > 0){
									 todos = JSON.parse(data);	  
							  }
								else if(data.length==0)
								{
										todos.push(request.body);
								}
									
							   var resobject = request.body;
	
								var reviceTodos = todos.map(function(todo){
									    console.log(resobject.id,  todo.id);
									    if(todo.id===resobject.id)
											{
												todo.todo = resobject.todo;
												todo.mark = resobject.mark;
										 
											}
											return todo;
								})
								todos = reviceTodos;
								fs.writeFile("./dbstore.txt",JSON.stringify(todos),function(err){
								       		
										if(err){
											response.end("error occured");
										}
										else
												response.end();
				     	  })
			      })		 
})

app.post("/delete",function(request,response){
			fs.readFile("./dbstore.txt","utf-8",function(err,data){
				  			var todos = [];
								var bodyid = request.body;
								if(data.length > 0){
									 todos = JSON.parse(data);	  
							  }
	console.log(todos)
							  for(var i = 0 ; i<todos.length;i++){
									 if(todos[i].id == bodyid.objectid)
									 {
										 	console.log(todos.splice(i,1))
									 }
								}
								fs.writeFile("./dbstore.txt",JSON.stringify(todos),function(err){
								       		
										if(err){
											response.end("error occured");
										}
										else
											response.end();
				     	  })
			})
})

app.get("/logout", function(req, res){
	req.session.destroy();
	res.status(200)
	res.end();
	
})

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`)
})
