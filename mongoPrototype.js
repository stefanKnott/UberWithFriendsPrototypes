//collections = tables

var http = require('http');
// Retrieve
var MongoClient = require('mongodb').MongoClient;


var user = {
	name : "Bob Ross",
	number : "317-910-6685",
	contacts : [{ //TODO: populate from phone contacts list
		name:"John", 
		number:"555-555-5555"
	},{
		name:"Susie",
		number:"556-666-6666"
	}]
}

function queryContacts(number, db){
	var cursor = db.collection('userContacts').find({number: number});
	
	function getNewContact(){ //TODO: Get contact info from user
		var newContact = {
			name: "Joey", 
  			number: "999-900-0000" 
  		}	
		
		return newContact;
	}

	cursor.each(function(err, doc){
		if(doc != null && doc.number == number){
			console.log("Queried ",number,"for contacts: \n", doc.contacts);
			function addContact(){
  				var contacts = db.collection('userContacts');
  				var newContact = getNewContact();
  				doc.contacts.push(newContact)
  				contacts.update({number: number}, {name:doc.name, number:doc.number, contacts: doc.contacts})
			}
			addContact();
		}
	});
};

function addContact(currContacts, contact, db){
	console.log("CURRENT CONTACTS: ", currContacts);
	console.log("Adding: ", contact);

	//TODO: query for current contact list...append new contact...update collection
	//collection.update({number:userNumber}, )

}

var printError = function(err){
	if(err != undefined){
		console.log(err.errmsg);
	}
}

var server = http.createServer(function(request, response) {
	response.writeHead(200, {"Content-Type": "text/plain"});

	//only init callback once...
	if (request.url == '/'){
		// Connect to the db
		MongoClient.connect("mongodb://localhost:27017/uberDB", function(err, db) {
 			if(!err) {
 			   console.log("Connected to uberDB");
  			}

  			db.createCollection('userContacts', function(err, collection){});

  			var contacts = db.collection('userContacts');


  			//INSERT INFO
  			var friend0 = user["contacts"][0];
  			var friend1 = user["contacts"][1];
  			var doc = {name:user["name"],  number:user["number"], contacts: [friend0, friend1]};
  			var doc2 = {name:user["name"], number:"303-867-5309", contacts: [friend0, friend1]};
  		  	var doc3 = {name:user["name"], number:"317-999-9999", contacts: [friend0, friend1]};
  		  	var doc4 = {name:"Stefan Knott", number:"317-000-9900", contacts: [friend0, friend1]};

  			console.log("Inserting contacts if unique...");
  			contacts.insert(doc, {w:1}, function(err, resp){
  				printError(err);
  			});
  			contacts.insert(doc2, {w:1}, function(err,resp){
  				printError(err);
  			});
  			contacts.insert(doc3, {w:1}, function(err,resp){
  				printError(err);
  			});
  			contacts.insert(doc4, {w:1}, function(err,resp){
  				printError(err);
  			});

  			//TODO: get number to query from user's phone
  			var contactList = queryContacts('317-910-6685', db);
  			console.log("Returned contacts: ", contactList);
  			});

		response.end("inserted contact\n");
	}
});

server.listen(8000);

console.log("Server running at http://127.0.0.1:8000/");

