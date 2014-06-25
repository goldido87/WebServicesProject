var restify = require('restify');
var server = restify.createServer({
 name : "restifysample"
});
server.listen(1400 ,'127.0.0.1', function(){
 console.log('%s listening at %s ', server.name ,server.url);
});
server.use(restify.queryParser());
server.use(restify.bodyParser());

function findStudent(req,res,next)
{
 console.log("inside findStudent(req,res,next) req.params.studid="+req.params.studid);
 var id = req.params.studid;
 //fetching data from db
 //...
 if(id==123123)
 {
 res.send(200, {'id':123123,'name':'danidin','average':98});
 return next();
 }
}

function deleteStudent(req,res,next)
{
 console.log("inside deleteStudent(req,res,next) req.params.studid="+req.params.studid);
 var id = req.params.id;
 //deleting data from db
 //...
 res.send(200,{'id':123123,'deleted':true});
 return next();
}

function findStudents(req,res,next)
{
 console.log("inside findStudents(req,res,next)");
 //getting data from db
 //...
 res.send(200,[
 {'id':123123,'name':'danidin','average':98},
 {'id':234234,'name':'spiderman','average':88},
 {'id':543543,'name':'wonderwoman','average':94}
 ]);
 return next();
}

function addStudent(req,res,next)
{
 var student = {};
 student.id = req.params.id;
 student.name = req.params.name;
 student.average = req.params.average;
 //adding data to db
 //...
 res.send(student);
 return next();
}

var PATH = '/students';
server.get(PATH+'/:studid', findStudent);
server.post(PATH, addStudent);
server.get(PATH,findStudents);
server.del(PATH+'/:id', deleteStudent);

