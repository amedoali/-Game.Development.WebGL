import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { AlphaFormat } from 'three'
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';


/**
 * Base
 */
// Debug
// const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Models
 */
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')

const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

let mixer = null

// gltfLoader.load(
//     '/models/Tree/untitled.gltf',
//     (gltf) =>
//     {
//         gltf.scene.scale.set(0.3, 0.3, 0.3)
//         gltf.scene.rotation.set(0,3,0)
        

//         scene.add(gltf.scene)

//         // // Animation
//         // mixer = new THREE.AnimationMixer(gltf.scene)
//         // const action = mixer.clipAction(gltf.animations[2])
//         // action.play()


//         gltf.scene.traverse( function ( object ) {

//             if ( dracoLoader.isMesh ) dracoLoader.castShadow = true;
        
//         } );
//     }
    
// )


gltfLoader.load( '/models/Tree/untitled.gltf', function ( gltf ) {
    
    gltf.scene.scale.set(0.3, 0.3, 0.3)
    gltf.scene.rotation.set(0,3,0)


    gltf.scene.traverse( function( node ) {
    if ( node.isMesh ) { 
        // node.position.set(0,0,0);
        node.castShadow = true;
        
        console.log("castShadow is enable")
        }
    } );

    gltf.scene.traverse( function( node ) {
    if ( node.isMesh ) { 
        // node.position.set(0,0,0);
        node.reseiveShadow = true;
        
        console.log("castShadow is enable")
        }
    } );

    scene.add(gltf.scene);
    console.log(gltf.scene)
} );


/**
 * Floor
//  */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(45, 45),
    new THREE.MeshStandardMaterial({color: 0x000000})
)
floor.castShadow = false;
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

// //cubee

// const geometry = new THREE.BoxGeometry( 1, 1, 1 );
// const material = new THREE.MeshBasicMaterial( {color: 0x000000} );
// const cube = new THREE.Mesh( geometry, material );
// cube.position.set(-2, 1,3)

// cube.castShadow = true
// cube.receiveShadow = true


// scene.add( cube );
// console.log(cube)


/**
 * Lights
 */
// const ambientLight = new THREE.AmbientLight(0xffffff,2)
// scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = -1
directionalLight.shadow.camera.top = 4
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(-1, 7, 1)
scene.add(directionalLight)
console.log(directionalLight.shadow)

// const helper = new THREE.DirectionalLightHelper( directionalLight, 5 );
// scene.add( helper );


const light = new THREE.PointLight( 0xffffff,4, 100 );
light.position.set( -3, 2, 5 );
light.castShadow = true
scene.add( light );

// const sphereSize = 1;
// const pointLightHelper = new THREE.PointLightHelper( light, sphereSize );
// scene.add( pointLightHelper );

// ////////

// const lightA = new THREE.PointLight( 0xffffff, 8, 100 );
// lightA.position.set( 5, 30, 7 );
// scene.add( lightA );

// const hemisphereLight = new THREE.HemisphereLight(0xFFFCCC, 0xFFFCCC, 2)
// scene.add(hemisphereLight)

const rectAreaLight = new THREE.RectAreaLight(0xffffff, 5, 10, 100)
rectAreaLight.position.set( -3, 2, 5)
scene.add(rectAreaLight)


///// Dir Light ////


                const loader = new THREE.TextureLoader().setPath( 'static/textures/' );
				const filenames = [ 'disturb.jpg', 'colors.png', 'uv_grid_opengl.jpg' ];

				const textures = { none: null };

				for ( let i = 0; i < filenames.length; i ++ ) {

					const filename = filenames[ i ];

					const texture = loader.load( filename );
					texture.minFilter = THREE.LinearFilter;
					texture.magFilter = THREE.LinearFilter;
					texture.encoding = THREE.sRGBEncoding;

					textures[ filename ] = texture;

				}


const spotLight = new THREE.SpotLight( 0xffffff, 5 );

				spotLight.position.set( -3, 2, 5 );
				spotLight.angle = Math.PI / 6;
				spotLight.penumbra = 1;
				spotLight.decay = 2;
				spotLight.distance = 100;
				spotLight.map = textures['disturb.jpg'];

				spotLight.receiveShadow = false;
				spotLight.castShadow = true;
				spotLight.shadow.mapSize.width = 1024;
				spotLight.shadow.mapSize.height = 1024;
				spotLight.shadow.camera.near = 10;
				spotLight.shadow.camera.far = 200;
				spotLight.shadow.focus = 0;
				scene.add( spotLight );

				// const lightHelper = new THREE.SpotLightHelper( spotLight );
				// scene.add( lightHelper );





                ///////////////////// GUI/////////////////////////

				const gui = new GUI();

				const params = {
					map: textures[ 'disturb.jpg' ],
					// color: spotLight.color.getHex(),
					color: 0xfecda4,
					intensity:( 5),
					distance: (50),
					angle: spotLight.angle,
					penumbra: spotLight.penumbra,
					decay: spotLight.decay,
					focus: spotLight.shadow.focus,
					shadows: true
				};

				gui.add( params, 'map', textures ).onChange( function ( val ) {

					spotLight.map = val;

				} );

				gui.addColor( params, 'color' ).onChange( function ( val ) {

					spotLight.color.setHex( val );

				} );

				gui.add( params, 'intensity', 10 ).onChange( function ( val ) {

					spotLight.intensity = val;

				} );


				gui.add( params, 'distance', 50, 200 ).onChange( function ( val ) {

					spotLight.distance = val;

				} );

				gui.add( params, 'angle', 0, Math.PI / 3 ).onChange( function ( val ) {

					spotLight.angle = val;

				} );

				gui.add( params, 'penumbra', 0, 1 ).onChange( function ( val ) {

					spotLight.penumbra = val;

				} );

				gui.add( params, 'decay', 1, 2 ).onChange( function ( val ) {

					spotLight.decay = val;

				} );

				gui.add( params, 'focus', 0, 1 ).onChange( function ( val ) {

					spotLight.shadow.focus = val;

				} );


				gui.add( params, 'shadows' ).onChange( function ( val ) {

					renderer.shadowMap.enabled = val;

					scene.traverse( function ( child ) {

						if ( child.material ) {

							child.material.needsUpdate = true;

						}

					} );

				} );

				gui.open(false);

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(30, sizes.width / sizes.height, 0.1, 100)
camera.position.set( -12.717288524933476,  3.325468130856387, 6.012140100112587)
// camera.lookAt(gltfLoader)
scene.add(camera)

// {x: 9.81426228242155, y: 4.115907955944265, z: -7.683516107109629}
// {x: -9.81426228242155, y: 4.115907955944265, z: 7.683516107109629}
// Vector3 {x: -10.136572816053437, y: 2.934194707389882, z: 6.227706189781948} Vector3 {x: -11.578975538658346, y: 3.646623401459869, z: 4.5241969603664565}

// Controls

const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 1.9, 3)
controls.enableDamping = true


/// the triger 

controls.enabled = false;

//helper 

// const size = 100;
// const divisions = 50;

// const gridHelper = new THREE.GridHelper( size, divisions );
// scene.add( gridHelper );

/**
 * Renderer
*/
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
    
})
renderer.shadowMap.enabled = true
// renderer.shadowMap.type = THREE.ShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

//shadow
// renderer.shadowMap.enabled = true

function cameraDistanceForRectangle(camera, objWidth, objHeight, canvasWidth, canvasHeight) {
	var aspectRatio = canvasWidth / canvasHeight, a, b;
	if(objWidth > objHeight) {
		a = Math.max(objWidth, objHeight) / 2/ aspectRatio / Math.tan(Math.PI * camera.fov / 360),
		b = Math.min(objWidth, objHeight) / 2 / Math.tan(Math.PI * camera.fov / 2);
	}
	else {
		a = Math.min(objWidth, objHeight) / 2 / aspectRatio / Math.tan(Math.PI * camera.fov / 360),
		b = Math.max(objWidth, objHeight) / 2 / Math.tan(Math.PI * camera.fov / 2);
	}
	return Math.max(a, b);
}

/**
 * Animate
*/
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime
    
    // Model animation
    if(mixer)
    {
        mixer.update(deltaTime)
    }
    
    const time = performance.now() / 3000;
    
    light.position.x = Math.cos( time ) * 5;
    light.position.z = Math.sin( time ) * 5;
    
    // console.log(camera.position)
    
    
    
    // lightHelper.update();
    
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()