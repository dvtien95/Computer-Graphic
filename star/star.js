// Tien Dinh - Computer Graphic - Moving Star

var gl, program;
var modelViewStack=[];
var vertices;
var delay = 100;      // delay time
var x1translation = -1;   // xPos translation to each time
var y1translation = -1;   // yPos translation to each time
var STEPS = 100;      // How many steps
var countSteps = 1;   // Just for displaying result in Javascript Developer Console

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

    // 1 branch of the star definition
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
    // one branch
    s = scale4(1/15, 1/15, 1);
    //r = rotate(-360/12, 0, 0, 1);
    modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, s);
    //modelViewMatrix = mult(modelViewMatrix, r);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays( gl.LINE_STRIP, 0, 7);

}

function render() {

    gl.clear( gl.COLOR_BUFFER_BIT );
    var r1;
    var t1;

    if (x1translation >= 1)
    {
      if (y1translation < -1) // when the star ends up at bottom right, reset it to bottom left (-1,-1)
      {
        x1translation = -1;
        y1translation = -1;
      }
      else
      {
        x1translation = 1;
        y1translation -= 2 / STEPS; // bydoing 2/STEPS, I can achieve 100 steps from (1,1) to (1,-1)
        console.log(countSteps++);  // Open Java Developer to see the steps from 101-200 (first time)
      }
    }
    else   // Starting from -1,-1 position, move to where xPos >= 1 (top right)
    {
      x1translation += 2 / STEPS;   // 2 is the translate distance (from -1 to 1)
      y1translation += 2 / STEPS;   // by doing 2/STEPS, I can achieve 100 steps from (-1,-1) to (1,1)
      console.log(countSteps++);  // Open Java Developer to see the steps from 1-100 (first time)
    }

    // Draw 5 branches star
    for (var i=0; i<5; i++)
    {
         r1 = rotate(360/5*i, 0, 0, 1);
         t1 = translate(x1translation, y1translation, 0);
         modelViewMatrix = mult(t1, r1);
         DrawOneBranch();
    }

    // Recursively call render
    setTimeout(   function ()
    {
      requestAnimFrame(render);
    }, delay);
}
