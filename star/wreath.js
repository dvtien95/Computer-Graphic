// Tien Dinh - Computer Graphic - 12 stars

var gl, program;
var modelViewStack=[];
var vertices;
var rotateCount = 0;
var x = 1;
var angle = Math.PI / 12;

function main()
{
    var canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    vertices = GeneratePoints();

    initBuffers();

    render();
};

function initBuffers() {

    //  Configure WebGL
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

    // Associate our shader variables with our data buffer
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    // Prepare to send the model view matrix to the vertex shader
    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
}

// Form the 4x4 scale transformation matrix
function scale4(a, b, c) {
   var result = mat4();
   result[0][0] = a;
   result[1][1] = b;
   result[2][2] = c;
   return result;
}

function GeneratePoints()
{
    var vertices=[];

    vertices.push(vec2(0, 2));
    vertices.push(vec2(0.1, 1));
    vertices.push(vec2(0.4, 1));
    vertices.push(vec2(0, 4));
    vertices.push(vec2(-1, -0.3));
    vertices.push(vec2(-0.5, -0.5));
    vertices.push(vec2(0, 2));

    return vertices;
}

function DrawOneBranch()
{
    var s;
    // one star
    s = scale4(1/15, 1/15, 1);
    r = rotate(rotateCount*(-360/12), 0, 0, 1);
    modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, s);
    modelViewMatrix = mult(modelViewMatrix, r);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays( gl.LINE_STRIP, 0, 7);


}

function render() {

    gl.clear( gl.COLOR_BUFFER_BIT );
    var r1;
    var t1;

    // Get odd number x for 12 correct position of stars
    for (x; x < 26; x+= 2)
    {
      rotateCount++;
      // draw and position a star
      for (var i=0; i<5; i++)
      {
           r1 = rotate(360/5*i, 0, 0, 1);
           // t1 is translation matrix translate around each point of a circle that has radius 0.6
           t1 = translate(0.6 * Math.sin(x*angle) , 0.6 * Math.cos(x*angle), 0);
           modelViewMatrix = mult(t1, r1);
           DrawOneBranch();
      }
    }
}
