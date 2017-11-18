var gl, points;

function main() {
    var canvas = document.getElementById( "gl-canvas" );  // get a hold to canvas id in html

    gl = WebGLUtils.setupWebGL( canvas ); // set up environment of canvas thourgh gl variable
    if ( !gl ) { alert( "WebGL isn't available" ); }  // if cannot set up, say not available

    // Four Vertices
    var vertices = [
        // Square top left
        vec2(-0.5, 0.5),
        vec2(-0.5,  0),
        vec2(0, 0),
        vec2(0, 0.5),

        // Square bottom right
        vec2(0.5, -0.5),
        vec2(0.5,  0),
        vec2(0, 0),
        vec2(0, -0.5)
    ];

    //  Configure WebGL
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );

    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    // Clear screen, or set screen to black color 0.0, 0.0, 0.0, 1.0
    gl.clear( gl.COLOR_BUFFER_BIT );

    // Get "index" variable from program
    var index = gl.getUniformLocation( program, "index");

    // Draw first square in red
    gl.uniform1i(index, 1);
    renderRED();

    // Draw second square in blue
    gl.uniform1i(index, 2);
    renderBLUE();
};

function renderRED() {
    gl.drawArrays( gl.TRIANGLE_FAN, 0, 4 );
}

function renderBLUE() {
    gl.drawArrays( gl.TRIANGLE_FAN, 4, 4);
}
