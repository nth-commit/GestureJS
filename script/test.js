/*jslint browser:true*/
/*global Test, GestureJS, CustomDomEvents*/
function main() {
	"use strict";

	var Gestures = GestureJS.Gestures,
		IGesture = Gestures.IGesture;

	if (typeof (Object.create) !== 'function') {
		Object.create = function (o) {
			function F() {}
			F.prototype = o;
			return new F();
		};
	}

	var testCanvas = document.getElementById("test-canvas");
	
	var testGesture = Object.create(new IGesture({
		name: "test",
		time: 1000
	}));

	testGesture.isMatch = function () {
		return false;
	};

	testGesture.register(testCanvas);

	initView(testCanvas);
}

function initView(canvasElement) {
	"use strict";

	var STROKE_COLOR_R = 255,
		STROKE_COLOR_G = 215,
		STROKE_COLOR_B = 0,
		STROKE_OPACITY = 1;

	var PointTracker = GestureJS.PointTracker;

	var canvasContext,
		width,
		height;

	canvasContext = canvasElement.getContext("2d");
	window.onresize = setSize;
	canvasElement.addEventListener("mousemove", onMouseMove);
	setSize();

	function setSize() {
		var width = canvasElement.clientWidth;
		var height = canvasElement.clientHeight;
		canvasElement.setAttribute("width", width);
		canvasElement.setAttribute("height", height);
	}

	function onMouseMove() {
		var points = PointTracker.getPoints(),
			numberOfPoints = points.length,
			firstPoint = points[0],
			currentTime = new Date().getTime(),
			pointLifetime = PointTracker.getPointLifetime(),
			timeToDeath,
			currentPoint;

		if (firstPoint) {
			canvasContext.beginPath();
			canvasContext.moveTo(firstPoint.x, firstPoint.y);

			for (var i = numberOfPoints - 1; i >= 0; i--) {
				currentPoint = points[i];
				timeToDeath = Math.max(0, currentPoint.time - currentTime + pointLifetime);
				canvasContext.setStrokeColor(STROKE_COLOR_R, STROKE_COLOR_G, STROKE_COLOR_B, STROKE_OPACITY * timeToDeath / pointLifetime);
				canvasContext.lineTo(currentPoint.x, currentPoint.y);
				canvasContext.lineWidth = 5;
				canvasContext.stroke();
			}
		}
	}
}