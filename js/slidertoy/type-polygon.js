
types.polygon = {
	sliders: ["mystery_parameter", "stroke_weight", "color_1", "color_2"],

	draw: function(dna, g) {

		g.pushMatrix();
		var strokeColor = g.color(0, 10);
		if (dna.color_1 > 0.5) {
			strokeColor = g.color(192, 100, 64, 10);
		}
		if (dna.color_2 > 0.5) {
			strokeColor = g.color(52, 100, 71, 10);
		}


		var scaled_mystery_parameter = dna.mystery_parameter * 100;

		g.translate(g.width/2, g.height/2);
		var circleResolution = Math.floor(g.map(scaled_mystery_parameter, 0, g.height, 2, 80));
		var radius = scaled_mystery_parameter - g.width/2 + 0.5;
		var angle = g.TWO_PI/circleResolution;

		g.strokeWeight(dna.stroke_weight * 5);
		g.stroke(strokeColor);

		g.beginShape();
		for (var i = 0; i <= circleResolution; i++) {
			var x = g.cos(angle*i) * radius;
			var y = g.sin(angle*i) * radius;
			//g.line(0, 0, x, y);
			g.vertex(x,y);

		}
		g.endShape();

		g.popMatrix();
	}
,

	createGeometry: function(scene, canvasMaterial) {
		this.cubes = []
		//var geometry = new THREE.BoxGeometry(100, 100, 100);
		//object = new THREE.Mesh( new THREE.TorusBufferGeometry( 50, 20, 20, 20 ), material );
		var geometry = new THREE.TorusGeometry(50, 20, 20, 20);


		for (var i = 0; i < 5; i++) {
			let m = new THREE.Mesh(geometry, canvasMaterial.material)
			scene.add(m);
			let s = Math.random() * 2 + 1;
			m.scale.set(s, s, s)
			m.position.x = (Math.random() - .5) * 100 * i;
			m.position.y = (Math.random() - .5) * 100 * i;
			m.position.z = (Math.random() - .5) * 100 * i;
			this.cubes.push(m)
		}
	},

	updateGeometry: function(dna, object) {
		// Given some geometry, modify it to match this dna
		for (var i = 0; i < this.cubes.length; i++) {
			let s = (1 + utilities.noise(i, dna.offset))*(1 + 1*dna.cubesize)
			this.cubes[i].scale.set(s, s, s)
		}
	}

}
