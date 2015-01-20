var app = app || {};

app.FaceViewer = Backbone.View.extend({
	el: '#face-viewer',

	initialize: function(){
		this.setCanvasSize();
		this.loadSVG();
	},

	events: {
	},

	setCanvasSize: function() {
		app.canvas.setWidth($('#face-viewer').width());
		app.canvas.setHeight($('#face-viewer').height());
	},

	loadSVG: function() {
		var info = {};

		fabric.loadSVGFromURL('assets/texture/face.svg', function(objects,options) {
			var loadedObject = fabric.util.groupSVGElements(objects, options);
			loadedObject.set({
                left: 65,
                top: 100,
                scaleX: 0.3,
                scaleY: 0.3
            });

            loadedObject.setCoords();
            loadedObject.hasControls = loadedObject.hasBorders = false;
            loadedObject.lockMovementX = loadedObject.lockMovementY = true;
			app.canvas.add(loadedObject).renderAll();

			Backbone.pubSub.trigger( 'svgLoaded' );
		}, function( item, object ) {
			//object.set('pos', info);
        });
	},

	addTexture: function(){
		var texture = new THREE.Texture( app.canvas );
		var material = new THREE.MeshLambertMaterial({map:texture});
	}

});