var fs = require('fs');
var mysql = require('mysql');
var qs = require('querystring');
const express = require('express');
var session = require('express-session');
const filestore = require("session-file-store")(session);
var flash = require('connect-flash');

var app = express();
var router = express.Router();

var connect = mysql.createConnection({
	host: "localhost",
  	user: "root",
	password: "",
	database: "test"
});

connect.connect(function(err){
	if(err) throw err;
})

app.use(session({
	name: "Session",
	secret: "aertsysjdhtjfjytr",
	resave: false,
	store: new filestore()
}));

app.use(express.static(__dirname+'/../FrontEnd'));

function checkLog(logged){
	if(logged!=""&&logged!=null){
		return 1;
	}
	if(logged==""||logged==null){
		return 0;
	}
}

router.get('/', (req, res)=>{
	fs.readFile("../FrontEnd/Login/Login.html", function(err,data){
			if(err) throw err;
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.write(data);
			return res.end();
	});
});


router.post('/page/', (req,res)=>{

	let body = [];
	req.on('data', (dat)=>{
		body.push(dat);
	}).on('end',()=>{
		body = Buffer.concat(body).toString();
		const{username,password} = qs.parse(body);

		res.writeHead(200,{'Content-Type': 'text/html'});
		var Sql = "SELECT pass FROM logs WHERE name=" + mysql.escape(username);
		connect.query(Sql,function(err,result){
			
			if(err||result[0]==null){
				res.write("Error: No such user");
				res.end();
			}
			else if(result[0].pass == password){
				req.session.user = username;
				fs.readFile("../FrontEnd/MainPage/Index.html", function(err,data){
					if(err) throw err;
					res.write(data);
					return res.end();
				});
				res.end();
			}
			else{
				
				res.end("Password is wrong");
			}
		});
	});
});

router.post("/SignUp/SignUp.html?",(req,res)=>{
	let body = [];
	req.on('data', (dat)=>{
		body.push(dat);
	}).on('end', ()=>{
		body = Buffer.concat(body).toString();
		const{username,password,password_2} = qs.parse(body);

		var Sql = "SELECT pass FROM logs WHERE name=" + mysql.escape(username);
		res.writeHead(200, {'Content-Type': 'text/html'});
		connect.query(Sql, function(err, result){
			if(err||result[0]==null){
				if(password != password_2){
					res.write("Password doesn't mach.");
					return res.end();
				}
				else{
					var Sql_2 = "INSERT INTO logs(name,pass)	VALUES(" + mysql.escape(username) + "," + mysql.escape(password) + ")";
					connect.query(Sql_2);
					res.write("Your profile is added!");
					return res.end();
				}
			}
			else{
				res.write("There is user with that name.");
				return res.end();
			}
		});
	});
});


app.use("/", router);
app.use("/page/", router);
app.listen(9988, () => {
});