var app = app || {};

app.ModelViewer = Backbone.View.extend({
	el: '#model-viewer',

	initialize: function(){
		Backbone.pubSub.on('svgLoaded', this.loadObjs, this);

		this.initScene();
		this.animate();

		// This function which exports the models as a OBJ file is not working well.
		// Will be fixed later.
		document.addEventListener('keydown', function(event) {
			if(event.keyCode === 8){
				event.preventDefault();
//				var exporter = new THREE.OBJExporter();
				var result = JSON.stringify(new THREE.OBJExporter().parse( app.obj ));
				var ts = Math.round(new Date().getTime() / 1000);
				console.log(app.obj);
				saveAs(result, 'exported_' + ts + '.js');
			} else if (event.keyCode === 46){
				event.preventDefault();
			}
		}, false);;
	},

	events: {
	},

	initScene: function() {
		app.scene = new THREE.Scene();

		camera = new THREE.PerspectiveCamera( 75, $("#model-viewer").width() / $("#model-viewer").height(), 1, 10000 );
		camera.position.set( 0, 0, 1600 );
		//scene.add( camera );

		trackball = new THREE.TrackballControls( camera );

		app.scene.add(new THREE.AmbientLight(0x999999));
		var light = new THREE.DirectionalLight(0xffffff);
		light.position.set(1, 1, 1);
		app.scene.add(light);

        app.renderer = new THREE.WebGLRenderer();
        app.renderer.setSize( $("#model-viewer").width(), $("#model-viewer").height() );
        app.renderer.setClearColor( 0xffffff, 1 );
        $("#model-viewer").append( app.renderer.domElement );
	},

	animate: function() {
		requestAnimationFrame( function() {
			app.ModelViewer.prototype.animate();
		} );
		app.renderer.render( app.scene, camera );
		trackball.update();
	},

	loadObjs: function() {
		var faceLoader = new THREE.JSONLoader();
		faceLoader.load( 'assets/model/face_01.js', function ( geometry, materials ) {
			var canvas = document.getElementById('canvas');
			var faceMaterial = new THREE.MeshFaceMaterial( materials );
			faceMaterial.needsUpdate = true;

			var texture = new THREE.Texture( canvas );
			texture.needsUpdate = true;

			var g = app.ModelViewer.prototype.assignUVs( geometry );
			g.buffersNeedUpdate = true;
			g.uvsNeedUpdate = true;
			var material = new THREE.MeshBasicMaterial({
				map: texture,
				transparent: true,
				side: THREE.DoubleSide
			});
			material.needsUpdate = true;
			var colorMaterial = new THREE.MeshBasicMaterial( {color: 0xFFE4C4} );

			var mesh = new THREE.SceneUtils.createMultiMaterialObject( g, [ material, colorMaterial ] );
			mesh.position.set( 0, 0, 0);
			mesh.scale.set( 100, 100, 100 );
			app.scene.add( mesh );
        } );
 
		var hairLoader = new THREE.JSONLoader();
		hairLoader.load( 'assets/model/hair_01.js', function ( geometry, materials ) {
			var faceMaterial = new THREE.MeshFaceMaterial( materials );
			var colorMaterial = new THREE.MeshBasicMaterial( {color: 0x000000} );
			var g = app.ModelViewer.prototype.assignUVs( geometry );
			g.buffersNeedUpdate = true;
			g.uvsNeedUpdate = true;

			//var mesh = new THREE.SceneUtils.createMultiMaterialObject( g, [ material, colorMaterial ] );
			var mesh = new THREE.Mesh( g, colorMaterial );
			mesh.position.set( 0, 0, 0);
			mesh.scale.set( 100, 100, 100 );
			app.scene.add( mesh );
        } );

        var bodyLoader = new THREE.JSONLoader();
		bodyLoader.load( 'assets/model/body_01_lp.js', function ( geometry, materials ) {
			var faceMaterial = new THREE.MeshFaceMaterial( materials );
			var mesh = new THREE.Mesh( geometry, faceMaterial );
			mesh.position.set( 0, 0, 0);
			mesh.scale.set( 100, 100, 100 );
			app.scene.add( mesh );
        } );
        
	},

	assignUVs: function( geometry ) {
		geometry.computeBoundingBox();
		var max     = geometry.boundingBox.max;
		var min     = geometry.boundingBox.min;

		var offset  = new THREE.Vector2(0 - min.x, 0 - min.y);
		var range   = new THREE.Vector2(max.x - min.x, max.y - min.y);

		geometry.faceVertexUvs[0] = [];
		var faces = geometry.faces;

		for (i = 0; i < geometry.faces.length ; i++) {
			var v1 = geometry.vertices[faces[i].a];
			var v2 = geometry.vertices[faces[i].b];
			var v3 = geometry.vertices[faces[i].c];

			geometry.faceVertexUvs[0].push([
				new THREE.Vector2( ( v1.x + offset.x ) / range.x , ( v1.y + offset.y ) / range.y ),
				new THREE.Vector2( ( v2.x + offset.x ) / range.x , ( v2.y + offset.y ) / range.y ),
				new THREE.Vector2( ( v3.x + offset.x ) / range.x , ( v3.y + offset.y ) / range.y )
				]);
		}

		geometry.uvsNeedUpdate = true;

		return geometry;
	}

});