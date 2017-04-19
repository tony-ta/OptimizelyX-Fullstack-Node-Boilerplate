var express = require('express');
var session = require('express-session');
var engine = require('ejs-locals');
var path = require('path');
var cookieParser = require('cookie-parser');
var optimizely = require('optimizely-server-sdk');
var rp = require('request-promise');
var optly;
var experiments = {};
var app = express();
var url = 'https://cdn.optimizely.com/json/8336234782.json';
var options = {uri: url, json: true};
var cookie;

app.use(session({
	secret: 'ssh123',
	resave: true,
	saveUninitialized: true
}));

app.use(cookieParser());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', engine);
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

//axios.get(url).then(function(res) {
rp(options).then(function(datafile) {
	optly = optimizely.createInstance({ datafile: datafile });
});

app.use(function(req, res, next) {
	var cookie = req.cookies.optimizelyUser;
  	if (cookie === undefined) {
		var randomNumber=Math.random().toString();
	    randomNumber=randomNumber.substring(2,randomNumber.length);
	    res.cookie('optimizelyUser',randomNumber, { maxAge: 900000, httpOnly: true });
	}

	var optly_experiments = optly.configObj.experiments;

	for (var i = 0; i < optly_experiments.length; i++) {
		var experiment = optly_experiments[i];
		var variation = optly.activate(experiment.key, '' + cookie);

		experiments[i] = {
			name: experiment.key,
			variation: variation
		}

	}

	next();
});

app.get('/', function(req, res) {
	randNum = Math.floor((Math.random() * 3000) + 1);
	if (req.session.count==null) {
		req.session.count=0;
	}
	req.session.count+=1;
	res.render('index', { title:'The index page!', session:req.session, experiments: experiments });
});

app.listen(7878,function(){
  console.log("Live at Port 7878");
});
