var fs = require('fs');
var mysql = require('mysql');
var qs = require('querystring');
const express = require('express');
var session = require('express-session');
const filestore = require("session-file-store")(session);
var flash = require('connect-flash');
var url = require('url');

var app = express();
var router = express.Router();

var connect = mysql.createConnection({
    host: "localhost",
    user: "tues",
    password: "tuesMysql",
    database: "tues"
});

connect.connect(function(err) {
    if (err) throw err;
})

app.use(session({
    name: "Session",
    secret: "aertsysjdhtjfjytr",
    resave: false,
    store: new filestore()
}));

app.use(express.static(__dirname + '/../FrontEnd'));

function checkLog(logged) {
    if (logged != "" && logged != null) {
        return 1;
    }
    if (logged == "" || logged == null) {
        return 0;
    }
}

router.get('/', (req, res) => {
    var link = url.parse(req.url, true);
    var Errorr = link.query;
    var error_replace;

    if (Errorr.error == 1) {
        error_replace = "<p id='error_message' style='color:red;'>No such user.</p>";
    } else if (Errorr.error == 2) {
        error_replace = "<p id='error_message' style='color:red;'>Wrong password.</p>";
    }
    fs.readFile("../FrontEnd/Login/Login.html", "utf8", function(err, data) {
        if (err) throw err;
        res.writeHead(200, { 'Content-Type': 'text/html' });
        if (Errorr.error) {
            data = data.replace("<!-- NODE.jshfgdhraezsc jvfcbfd hgfxjby  -->", error_replace);
        }
        res.write(data);
        return res.end();
    });
});

router.get('/chat/', (req, res) => {
	if(checkLog(req.session.user)==0){
		res.writeHead(302,{
			location: "http://52.0.201.73:9988/"
		});
	}
    var data = "";
    var Sql = "SELECT message,username FROM messages";
    connect.query(Sql, function(err, result) {
        if (err) throw err;
        Object.keys(result).forEach(function(key) {
            var row = result[key];

            data += "<p id='ChatUsername'>" + row.username + "</p><br><p id='ChatMessage'>" + row.message + "</p><br>";
        });

        res.writeHead(200, { 'Content-Type': 'text/html' });

        res.write(data);
        return res.end();
    });
});

router.post('/chat/', (req, res)=>{
	let data = [];
	req.on('data' ,(chunk)=>{
		data.push(chunk);
	}).on('end',()=>{
	data = Buffer.concat(data).toString();	
    var message = JSON.parse(data);
    if(message['message'] == ""){
    	return false;
    }
	var Sql = "INSERT INTO messages(username,message) VALUES(" + mysql.escape(req.session.user) + "," + mysql.escape(message['message']) + ")";
	connect.query(Sql);
	});
	res.writeHead(302,{
		location: "http://52.0.201.73:9988/chat/"
	});
	return res.end();
});

router.post('/page/', (req,res)=>{

	let body = [];
	req.on('data', (dat)=>{
		body.push(dat);
	}).on('end',()=>{
		body = Buffer.concat(body).toString();
		const{username,password} = qs.parse(body);

		var Sql = "SELECT pass FROM logs WHERE name=" + mysql.escape(username);
		connect.query(Sql,function(err,result){
			
			if(err||result[0]==null){
				res.writeHead(302,{
					location: "http://52.0.201.73:9988/?error=1"
				});
				//res.write("Error: No such user");
				res.end();
			}
			else if(result[0].pass == password){
				req.session.user = username;
				res.writeHead(200,{'Content-Type': 'text/html'});
				fs.readFile("../FrontEnd/MainPage/Index.html", function(err,data){
					if(err) throw err;
					res.write(data);
					return res.end();
				});
				res.end();
			}
			else{
				res.writeHead(302,{
					location: "http://52.0.201.73:9988/?error=2"
				});
				//res.end("Password is wrong");
				res.end();
			}
		});
	});
	});

router.get("/SignUp/SignUp.html", (req, res) => {
    var link = url.parse(req.url, true);
    var Errorr = link.query;
    var error_message;
    res.writeHead(200, { 'Content-Type': 'text/html' });

    if (Errorr.error) {
        if (Errorr.error == 1) {
            error_message = "<p id='error_message_2' style='color:red;'>Passwords are not the same.</p>";
        }
        if (Errorr.error == 2) {
            error_message = "<p id='error_message_2' style='color:green;'>Your profile is added.</p>";
        }
        if (Errorr.error == 3) {
            error_message = "<p id='error_message_2' style='color:red;'>There is already user with that name.</p>";
        }
        fs.readFile("../FrontEnd/SignUp/SignUp.html", "utf8", function(err, data) {
            if (err) throw err;
            data = data.replace("<!--fdgdhertcyvsudbtewarvsydjktrecwqwarysrtertwasdjybk-->", error_message);
            res.write(data);
        });
    }
    res.end();
});

router.post("/SignUp/SignUp.html", (req, res) => {
    let body = [];
    req.on('data', (dat) => {
        body.push(dat);
    }).on('end', () => {
        body = Buffer.concat(body).toString();
        const { username, password, password_2 } = qs.parse(body);

        var Sql = "SELECT pass FROM logs WHERE name=" + mysql.escape(username);

        connect.query(Sql, function(err, result) {
            if (err || result[0] == null) {
                if (password != password_2) {
                    res.writeHead(302, {
                        location: "http://52.0.201.73:9988/SignUp/SignUp.html/?error=1"
                    });
                    //res.write("Password doesn't mach.");
                    res.end();
                } else {
                    var Sql_2 = "INSERT INTO logs(name,pass)	VALUES(" + mysql.escape(username) + "," + mysql.escape(password) + ")";
                    connect.query(Sql_2);
                    res.writeHead(302, {
                        location: "http://52.0.201.73:9988/SignUp/SignUp.html/?error=2"
                    });
                    //res.write("Your profile is added!");
                    res.end();
                }
            } else {
                res.writeHead(302, {
                    location: "http://52.0.201.73:9988/SignUp/SignUp.html/?error=3"
                });
                //res.write("There is user with that name.");
                res.end();
            }
        });
    });
});


app.use("/", router);
app.use("/page/", router);
app.listen(9988, () => {});