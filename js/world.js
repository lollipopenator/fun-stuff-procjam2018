// A World has a set of facts, and a set of rules
// It can run clingo to create new sets of rules
// And then update stuff accordingly

function World() {
	this.characters = [];
	for (var i = 0; i < 5; i++) {
		this.addCharacter();
	}
	this.randomize();
}

World.prototype.addCharacter = function() {
	let c = new Character()
	this.characters.push(c);
}

World.prototype.setToFacts = function(solutionSet) {
	for (s in solutionSet) {
		console.log(s)
	}
}

World.prototype.randomize = function() {
	this.relationships = []

	// Create some families
	for (var i = 0; i < this.characters.length/2; i++) {
		let i0 = Math.floor(Math.random() * this.characters.length);
		let i1 = (i0 + 1 + Math.floor(Math.random() * (this.characters.length - 1))) % this.characters.length;
		let c0 = this.characters[i0]
		let c1 = this.characters[i1]

		if (c0.age < c1.age) {
			this.relationships.push({
				r: "isParentOf",
				a: c1.id,
				b: c0.id,
			})
		} else if (c0.age > c1.age) {
			this.relationships.push({
				r: "isParentOf",
				a: c0.id,
				b: c1.id,
			})
		} else {
			this.relationships.push({
				r: "isSiblingOf",
				a: c0.id,
				b: c1.id,
			})
		}
	}
}


// Given this world, create the facts that we know about it
// Characters
// Relationships (in love with, hates, childOf, parentOf)
World.prototype.getFacts = function() {
	let facts = []
	this.characters.forEach(c => facts = facts.concat(c.getFacts()))

	this.relationships.forEach(r => {
		facts = facts.concat(fact(r.r, r.a, r.b))
	})

	return facts;
}

//==========================================================
//==========================================================
//==========================================================
let characterCount = 0;
let names = {
	m: shuffle(["Herbert", "Gregory", "Eustace", "Neville", "Alfred", "Archibald", "Baxter", "Edwin", "Martin", "Oliver", "Ernest", "Victor", "Hugo", "Thaddeus", "Sebastian"]),
	f: shuffle(["Alice", "Jane", "Emma", "Milicent", "Agatha", "Bertha", "Winnie", "Violet", "Mary", "Martha", "Lucy", "Lily", "Lilian", "Josephine", "Henrietta", "Flora"]),
	n: shuffle(["CJ", "Bee", "Chay", "Zay", "Venice", "Mur", "Adder", "Via", "Zinn", "JC", "Jess", "Whymsy", "Squirrel", "Mimsy", "Cat", "Stranger", "Star", "Eke", "Morr", "River", "Pebble", "Tree", "Darkness", "Void"]),
}

function Character() {
	this.idNumber = characterCount++;
	this.id = "c" + this.idNumber;
	this.randomize();
}

// Facts about the character might be
// 	wealth level
//	family members

Character.prototype.randomize = function() {
	this.age = undefined;
	this.wealth = undefined;

	this.age = getRandom([0, 1, 2]);
	this.gender = getRandom(["m", "f", "n"]);
	this.name = names[this.gender].pop();
	this.id = this.name.toLowerCase();

	if (Math.random())
		this.wealth = getRandom(["poor", "rich"]);
	if (this.age > 0)
		this.job = getRandom(["servant", "merchant", "nobility"]);
}

Character.prototype.getFacts = function() {
	let facts = [fact("person", this.id),
	fact("gender", this.id, this.gender)]


	// if (this.wealth !== undefined)
	// 	facts.push(fact("wealth", this.id, this.wealth))
	// if (this.job !== undefined)
	// 	facts.push(fact("job", this.id, this.job))
	// if (this.age !== undefined)
	// 	facts.push(fact("age", this.id, this.age))
return facts

}

function fact(r, ...params) {
	return r + "(" + params.join(",") + ")"
}