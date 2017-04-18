var express = require('express');
var session = require('express-session');
var engine = require('ejs-locals');
var path = require('path');

var app = express();

app.use(session({
	secret: 'ssh123',
	resave: true,
	saveUninitialized: true
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', engine);
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
	randy = Math.floor((Math.random() * 3000) + 1);
	if (req.session.count==null) {
		req.session.count=0;
	}
	req.session.count+=1;
	res.render('index', { title:'The index page!', session:req.session });
});

app.listen(9292,function(){
  console.log("Live at Port 9292");
});
