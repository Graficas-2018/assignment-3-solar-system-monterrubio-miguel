var renderer = null, 
scene = null, 
camera = null,
solarSystem = null,
planetGroups = [],
sun = null,
earthOrbit = null;
moonsGroup = null;
var asteroids = [],
kuiper = [];

var theta = 0;

var orbits = [];
var planets = [];

var day = 1;
var pause = false;
var timeScale = 1;
var duration = 5000;
var currentTime = Date.now();

var planetGroup;


//All variables are taken in relation to Earth's measurements
var orbitTimes = [.241, .615, 1, 1.881, 11.862, 29.447, 84.015, 164.787, 247.495];
var dayTimes = [58.646, -243.025, 1, 1.026, .4125, .448, 0.719, .671, .4];

//orbit distance is circular and not to scale. Due to size, gas giants are further apart than the rocky planets
var orbitDistance = [0.1, 0.2, 0.3, 0.4, 0.6, 0.9, 1.2, 1.4, 1.8];

//All planets are to scale in relation to Earth except Pluto, which is 5 times bigger for better visibility
var planetRaduis = [3.83, 9.5, 5.33, 10, 109.73, 91.4, 39.81, 38.65, 1.87*5]

//Sun radius downsized by 100 so other planets can be seen
var sunRadius = 10.9198;

//arbitrary measurement so planets aren't so small compared to sun
var AU = 1200;

//how many moons each planet has
var hasMoon = [0, 0, 1, 2, 20, 10, 5, 5, 1]
var moons = [];

function animate() 
{
    var now = Date.now();
    var deltat = now - currentTime;
    currentTime = now;
    var fract = deltat / duration;
    var angle = Math.PI * 2 * fract;
    var orbitPeriod = 365 * fract;
    var movement = now * 0.001;
    var timestamp = Date.now();


    for (var i = 0; i < 9; i++) {
    	planets[i].rotation.y += angle / dayTimes[i];
    }
    theta += angle;
    for (var i = 0; i < 9; i++) {

    	planets[i].position.x = orbitDistance[i] * AU * Math.cos(theta / orbitTimes[i]);
    	planets[i].position.z = orbitDistance[i] * AU * Math.sin(theta / orbitTimes[i]);
    	//planets[i].position.z = Math.sin(fract * orbitTimes[i]) * orbitDistance[i];
    }

    // Rotate the sun about its Y axis
    sun.rotation.y += angle;
}

function run() {
    requestAnimationFrame(function() { run(); });
    
        // Render the scene
        renderer.render( scene, camera );

        if (!pause) {
            animate();
        }
}

function createScene(canvas)
{    
    // Create the Three.js renderer and attach it to our canvas
    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );

    // Set the viewport size
    renderer.setSize(canvas.width, canvas.height);
    
    // Create a new Three.js scene
    scene = new THREE.Scene();

    // Set the background color 
    scene.background = new THREE.Color( 0.2, 0.2, 0.2 );

    // Add  a camera so we can view the scene
    camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height, 1, 400000000000 );
    camera.position.z = 100;
    camera.position.y = 0;
    scene.add(camera);

    // Create a group to hold all the objects
    solarSystem = new THREE.Object3D;
    
    // Add a point light for the sun
    var light = new THREE.PointLight( 0xffffff, 2, 0, 2);

    //create orbits
    for (var i = 0; i < 9; i++) {
    	var lineMaterial = new THREE.LineBasicMaterial( { color: 0xffffff } );
    	var lineGeometry = new THREE.CircleGeometry( orbitDistance[i]*AU, 1024);
    	lineGeometry.vertices.shift();
    	orbits[i] = new THREE.LineLoop( lineGeometry, lineMaterial );
    	orbits[i].rotation.x = Math.PI / 2;
    	solarSystem.add(orbits[i]);
    }

   	//planet texture urls stored in array
    var planetURL = ["images/mercurymap.jpg", "images/venusmap.jpg", "images/earthmap1k.jpg", "images/mars_1k_color.jpg", "images/jupitermap.jpg", "images/saturnmap.jpg", "images/uranusmap.jpg", "images/neptunemap.jpg", "images/plutomap1k.jpg"]
    var moonUrl = "images/moonmap1k.jpg";
    var sunUrl = "images/sunmap.jpg";
    var moonTexture = new THREE.TextureLoader().load(moonUrl);
    var sunTexture = new THREE.TextureLoader().load(sunUrl);
    var moonMaterial = new THREE.MeshPhongMaterial({ map: moonTexture });
    var sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture });

    // Create the sun geometry
    var geometry = new THREE.SphereGeometry(sunRadius, 100, 100);

    // And put the geometry and material together into a mesh
    sun = new THREE.Mesh(geometry, sunMaterial);

    sun.add(light);

    // Add the sun mesh to our group
    solarSystem.add( sun );

    // Create a group for the planet
    planetGroup = new THREE.Object3D;
    solarSystem.add(planetGroup);
    
    // Move the planet group up and back from the sun
    planetGroup.position.set(0, 0, orbitDistance[2]*AU);


    //create the planets
    for (var i = 0; i < 9; i++) {
    	var planetTexture = new THREE.TextureLoader().load(planetURL[i]);
    	var planetMaterial = new THREE.MeshLambertMaterial({ map: planetTexture });
    	geometry = new THREE.SphereGeometry(planetRaduis[i], 100, 100);
    	planets[i] = new THREE.Mesh(geometry, planetMaterial);
    	planets[i].position.set(0, 0, -orbitDistance[i]*AU);
    	solarSystem.add(planets[i]);
    }

    //create moons
    var counter = 0;
    for (var i = 0; i < 9; i++) {
    	for (var j = 0; j < hasMoon[i]; j++) {
    		var moonTexture = new THREE.TextureLoader().load(moonUrl);
    		var moonMaterial = new THREE.MeshLambertMaterial({ map: moonTexture });
    		geometry = new THREE.SphereGeometry((Math.random() * 2) + 1, 10, 10);
    		moons.push(new THREE.Mesh(geometry, moonMaterial));
    		var angle = Math.random() * Math.PI * 2;
    		moons[counter].position.set(planetRaduis[i] * 1.5 * Math.cos(angle), (Math.random() * planetRaduis[i] * 2) - planetRaduis[i], planetRaduis[i] * 1.5 * Math.sin(angle));
    		planets[i].add(moons[counter]);
    		counter++;
    	}
    }
    
    //create asteroids
	for (var k = 0; k < 60; k++) {
		var moonTexture = new THREE.TextureLoader().load(moonUrl);
		var moonMaterial = new THREE.MeshLambertMaterial({ map: moonTexture });
		geometry = new THREE.SphereGeometry((Math.random() * 2) + 1, 10, 10);
		asteroids.push(new THREE.Mesh(geometry, moonMaterial));
		var angle = Math.random() * Math.PI * 2;
		var distance = (Math.random() * .1) + .45;
		asteroids[k].position.set(AU * distance * Math.cos(angle), 0, AU * distance * Math.sin(angle));
		//moons[k].position.set(planetRaduis[i] + 5, planetRaduis[i] + 5, planetRaduis[i] + 5);
		console.log(asteroids[k].position.x, asteroids[k].position.z);
		sun.add(asteroids[k]);
	}

	//create asteroids in kuiper belt
	for (var k = 0; k < 60; k++) {
		var moonTexture = new THREE.TextureLoader().load(moonUrl);
		var moonMaterial = new THREE.MeshLambertMaterial({ map: moonTexture });
		geometry = new THREE.SphereGeometry((Math.random() * 2) + 1, 10, 10);
		kuiper.push(new THREE.Mesh(geometry, moonMaterial));
		var angle = Math.random() * Math.PI * 2;
		var distance = (Math.random() * .1) + 1.85;
		kuiper[k].position.set(AU * distance * Math.cos(angle), 0, AU * distance * Math.sin(angle));
		//moons[k].position.set(planetRaduis[i] + 5, planetRaduis[i] + 5, planetRaduis[i] + 5);
		console.log(kuiper[k].position.x, kuiper[k].position.z);
		sun.add(kuiper[k]);
	}


    // Now add the group to our scene
    scene.add( solarSystem );

}	