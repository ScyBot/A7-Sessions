var http = require('http')
  , fs = require('fs')
  , url = require('url')
  , path = require('path')
  , qs = require('querystring')
  , port = process.argv[2] || 8000
  , cookie = require('cookie')

var server = http.createServer (function (req, res) {
	var uri = url.parse(req.url);
	var query = url.parse(req.url).query;
	res.writeHead(200, {
		'Set-Cookie': ['author=Seb; Max-Age=30'],});	
	console.log(uri.pathname);
	switch( uri.pathname ) {
		case '/':
			sendFile(res, 'index.html', 'text/html')
			break
		case '/search':
			handlePost(res, uri)
			break
		case '/index.html':
			sendFiles(res, 'index.html', 'text/html')
			break
		case '/README.md':
			sendFile(res, 'README.md', 'text/markdown')
			break
		case '/package.json':
			sendFile(res, 'package.json', 'text/json')
			break
		case '/classes':
			sendCLasses(req, res)
			break
		default:
			res.end('404 not found')
	}

})


server.listen(process.env.PORT || port)
console.log('listening on ' + port);

//subroutines

function sendFile(res, filename, contentType) {
	contentType = contentType || 'text/html'
	fs.readFile(filename, function(error, content) {
		//res.writeHead(200, {'Content-type': contentType})
		res.writeHead(200, {'Set-Cookie':'Max-Age=30'});
		res.end(content, 'utf-8')
	})
}

function handlePost(res, uri) {
	var contentType = 'text/html'
		, html = ''

	html = html + '<html>'

	html = html + '<head>'
	html = html + '</head>'

	html = html + '<body>'

	html = html + '<form action="/search" method="get">'
	html = html + '<input type="text" name="search" />'
	html = html + '<button type="submit">Search</button>'
	html = html + '</form>'

	var data = qs.parse(uri.query)
	html += '<ol>' + data + '</ol>';
	html += '</body>'
	html += '</html>'

	res.writeHead(200, {'Content-type': contentType})
	res.end(html, 'utf-8')
}

function parseCookie(req) {
  if( !req.headers.cookie ) return {}
  var rc = req.headers.cookie
  return cookie.parse( rc )
}

var expiredate = new Date();
	//increase date by 5 hours
expiredate.setHours( expiredate.getHours() + 5);
document.cookie = 'cookiename=cookievalue; expires='  + expiredate.toUTCString() + 'path=/example/; domain=test.envato.com';


function writeCookie(cookieName, cookieValue, expireHours, path, domain){
	var date =  new Date();
	date.setHours(date.getHours + expireHours);
	document.cookie = cookieName + '=' + cookieValue + '; expires=' + date + '; path=' + path + '; domain=' + domain;
}
 
function readCookie(cookieName){
	var textArray = document.cookie.split(';');
	for(var i = 0; i < textArray.length; i++){
		var textPiece = textArray[i]; 
		while(textPiece(0)==' ') textPiece = textPiece.substring(1,textPiece.length);
			if (textPiece.indexOf(cookieName)== 0) return textPiece.substring(cookieName.length,c.length);
	}
}


function sendClasses(req, res) {
  var cook = parseCookie(req)
  res.writeHead(200, {
    'Content-type': 'application/json'
  })
  res.write( 
    JSON.stringify( 
      classes.filter(function(c) { return c.instructor == cook.instructor})
    )
  )
  res.end()
}
