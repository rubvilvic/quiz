var path = require('path');

var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name = (url[6]||null);
var user = (url[2]||null);
var pwd = (url[3]||null);
var protocol = (url[1]||null);
var dialect = (url[1]||null);
var port = (url[5]||null);
var host = (url[4]||null);
var storage = process.env.DATABASE_STORAGE;

//Cargar el modelo ORM.
var Sequelize = require('sequelize');

//Usar BBDD SQLite.
var sequelize = new Sequelize(DB_name, user, pwd,
								{
									dialect: protocol,
									protocol: protocol,
									port: port,
									host: host, 
									storage: storage,
									omitNull: true
								}
							);

//Importar la definición de la tabla Quiz en quiz.js.
var Quiz = sequelize.import(path.join(__dirname,'quiz'));

exports.Quiz = Quiz; //exportar definición de la tabla Quiz.

//Crea e inicializa tabla de preguntas en BBDD.
sequelize.sync().then(function(){
	// success() ejecuta el manejador una vez creada la tabla.
	Quiz.count().success(function(count){
		if(count === 0){ //La tabla se inicializa solo si está vacía.
			Quiz.create({
				pregunta: 'Capital de Italia',
				respuesta: 'Roma',
				tema: "humanidades" 
			});
			Quiz.create({
				pregunta: 'Capital de Portugal',
				respuesta: 'Lisboa',
				tema: "humanidades"
			})
			.success(function(){console.log('Base de datos inicializada')});
		}
	});

});

