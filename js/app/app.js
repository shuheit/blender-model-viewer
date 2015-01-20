var app = app || {};

$(function() {
	Backbone.pubSub = _.extend({}, Backbone.Events);
	app.canvas = new fabric.Canvas('canvas');

	new app.FaceViewer();
	new app.ModelViewer();
});