var renderer = null, 
scene = null, 
camera = null,
solarSystem = null,
sun = null,
planetGroup = null,
planet = null,
moon = null,
earthOrbit = null,
orbits = null;


var pause = false;
var timescale = 1;
var duration = 5000;
var currentTime = Date.now();

var planetGroup, planet_1, planet_2;
var planet_1_orbit;

var orbitTimes = [.241, .615, 1, 1.881, 11.862, 29.447, 84.015, 164.787, 247.495];
var dayTimes = [58.646, -243.025, 1, 1.026, .4125, .448, 0.719, .671, .4]

function animate() 
{
    var now = Date.now();
    var deltat = now - currentTime;
    currentTime = now;
    var fract = deltat / duration;
    var angle = Math.PI * 2 * fract;
    var movement = now * 0.001;




    // Rotate the sun about its Y axis
    sun.rotation.y += angle;

    // Rotate the solar system about its Y axis
    solarSystem.rotation.y -= angle;

    // Rotate the earth about its Y axis
    planetGroup.rotation.y += angle;
    planet.rotation.y += angle;

    // Rotate the moon about its X axis (tumble forward)
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
    camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height, 1, 4000 );
    camera.position.z = 10;
    camera.position.y = 0;
    scene.add(camera);

    // Create a group to hold all the objects
    solarSystem = new THREE.Object3D;
    
    // Add a point light for the sun
    var light = new THREE.PointLight( 0xffffff, 2, 0, 2);

    
    var lineMaterial = new THREE.LineBasicMaterial( { color: 0xffffff } ),
        lineGeometry = new THREE.CircleGeometry( 4, 64);

    // Remove center vertex
    lineGeometry.vertices.shift();

    earthOrbit = new THREE.LineLoop( lineGeometry, lineMaterial );
    earthOrbit.rotation.x = Math.PI / 2;
    //earthOrbit = new THREE.LineLoop( lineGeometry, lineMaterial );

    // Non closed circle with one open segment:
    //scene.add( new THREE.Line( geometry, material ) );

    // To get a closed circle use LineLoop instead (see also @jackrugile his comment):
    solarSystem.add(earthOrbit);


    var moonUrl = "../images/moonmap1k.jpg";
    var sunUrl = "../images/sunmap.jpg"
    var earthUrl = "../images/earthmap1k.jpg"
    var moonTexture = new THREE.TextureLoader().load(moonUrl);
    var sunTexture = new THREE.TextureLoader().load(sunUrl);
    var earthTexture = new THREE.TextureLoader().load(earthUrl);
    var moonMaterial = new THREE.MeshPhongMaterial({ map: moonTexture });
    var earthMaterial = new THREE.MeshLambertMaterial({ map: earthTexture });
    var sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture });

    // Create the sun geometry
    var geometry = new THREE.SphereGeometry(1, 100, 100);

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
    planetGroup.position.set(0, 0, -4);

    // Create the planet geometry
    geometry = new THREE.SphereGeometry(1, 20, 20);
    
    // And put the geometry and material together into a mesh
    planet = new THREE.Mesh(geometry, earthMaterial);

    // Add the planet mesh to our group
    planetGroup.add( planet );




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