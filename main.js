/* global GLOW: true */
// shim layer with setTimeout fallback
window.requestAnimFrame = (function () {
    "use strict";
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) { window.setTimeout(callback, 1000 / 60); };
}());

(function () {
    "use strict";
    var ctx, startTime, time, container, cubeShaderInfo, cube;
    ctx = new GLOW.Context();
    startTime = Date.now();
    time = 0;
    container = document.getElementById('container');

    if (!!ctx) {
        container.innerHTML = "With your current configuration the demo is unable to run.  Check to make sure your browser supports WebGL.";
        return;
    }
    
    cubeShaderInfo = {
        vertexShader   : document.getElementById('shader-vs').text,
        fragmentShader : document.getElementById('shader-fs').text,
        data : {

            // create uniform data
            transform: new GLOW.Matrix4(),
            cameraInverse: GLOW.defaultCamera.inverse,
            cameraProjection: GLOW.defaultCamera.projection,
            startTime: new GLOW.Float(startTime),
            time: new GLOW.Float(time),
            resolution : new GLOW.Vector2(window.innerWidth, window.innerHeight),

            // create attribute data
            vertices: GLOW.Geometry.Cube.vertices(500),
            uvs: GLOW.Geometry.Cube.uvs(),
            normals: GLOW.Geometry.faceNormals(GLOW.Geometry.Cube.vertices(), GLOW.Geometry.Cube.indices())
        },
        // create element data
        indices: GLOW.Geometry.Cube.indices(),
        primitives: GLOW.Geometry.Cube.primitives()
    };

    cube = new GLOW.Shader(cubeShaderInfo);

    ctx.setupClear({red: 0, green: 0, blue: 0});
    container.appendChild(ctx.domElement);

    GLOW.defaultCamera.localMatrix.setPosition(0, 0, 1500);
    GLOW.defaultCamera.update();

    function render() {
        ctx.cache.clear();
        ctx.clear();
        cube.time.value[0] = ((Date.now() - startTime) / 1000); // Update Shader
        cube.transform.addRotation(0.001, 0.005, 0.0025);
        cube.draw();
    }

    (function loop() {
        render();
        window.requestAnimFrame(loop);
    }());
}());