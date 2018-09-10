var renderer = null, 
scene = null, 
camera = null,
solarSystem = null,
planetGroup = null,
sun = null,
mercury = null,
venus = null,
earth = null,
mars = null,
jupiter = null,
saturn = null,
uranus = null,
neptune = null,
pluto = null,
moon = null,
earthOrbit = null;

var theta = 0;

var orbits = [];
var planets = [];

var day = 0;
var pause = false;
var timeScale = 1;
var duration = 5000;
var currentTime = Date.now();

var planetGroup, planet_1, planet_2;
var planet_1_orbit;


//All variables are taken in relation to Earth's measurements
var orbitTimes = [.241, .615, 1, 1.881, 11.862, 29.447, 84.015, 164.787, 247.495];
var dayTimes = [58.646, -243.025, 1, 1.026, .4125, .448, 0.719, .671, .4];

//orbit distance is circular. As real orbits are elliptical, the number used for this project is the average radius of its orbit. Units are Astronomical Units. 1 AU is Earth's orbit radius.
var orbitDistance = [0.4, 0.7, 1, 1.5, 5.2, 9.5, 19.2, 30.1, 39];

//Most planets, especially gas giants, have a larger ecuatorial radius. Radius used here is the average planet radius, in relation to earth's, multiplied by 10
var planetRaduis = [3.83, 9.5, 5.33, 10, 109.73, 91.4, 39.81, 38.65, 1.87]

var sunRadius = 1091.98

//distance of astronomical units in our arbitrary scale
var AU = 23481;

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
        console.log(Math.cos(theta));
        //planets[i].position.z = Math.sin(fract * orbitTimes[i]) * orbitDistance[i];
    }

    // Rotate the sun about its Y axis
    sun.rotation.y += angle;

    moon.rotation.z += angle;
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

    // Tilt the mesh toward the viewer
    // sun.rotation.x = Math.PI / 5;
    // sun.rotation.y = Math.PI / 5;

    // Add the sun mesh to our group
    solarSystem.add( sun );

    // Create a group for the planet
    planetGroup = new THREE.Object3D;
    solarSystem.add(planetGroup);
    
    // Move the planet group up and back from the sun
    planetGroup.position.set(0, 0, orbitDistance[2]*AU);

    for (var i = 0; i < 9; i++) {
        var planetTexture = new THREE.TextureLoader().load(planetURL[i]);
        var planetMaterial = new THREE.MeshLambertMaterial({ map: planetTexture });
        geometry = new THREE.SphereGeometry(planetRaduis[i], 100, 100);
        planets[i] = new THREE.Mesh(geometry, planetMaterial);
        planets[i].position.set(0, 0, -orbitDistance[i]*AU);
        solarSystem.add(planets[i]);
    }
    // Create the planet geometry
    




    // Create the moon geometry
    geometry = new THREE.SphereGeometry(.1, 20, 20);

    // And put the geometry and material together into a mesh
    moon = new THREE.Mesh(geometry, moonMaterial);

    // Move the moon up and out from the planet
    moon.position.set(1, 1, -.667);
        
    // Add the moon mesh to our group
    planetGroup.add( moon );
    


    // Now add the group to our scene
    scene.add( solarSystem );

}