#define SH_COEFF 9
attribute vec3 aVertexPosition;
attribute vec3 aNormalPosition;
attribute vec2 aTextureCoord;
attribute mat3 aPrecomputeLT;
uniform mat3 uPrecomputeL0;
uniform mat3 uPrecomputeL1;
uniform mat3 uPrecomputeL2;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform float uPrecomputeL[SH_COEFF * 3];

varying vec3 vColor;

float dotSH(mat3 uPrecomputeL, mat3 aPrecomputeLT) 
{
    float result = 0.0;
    result += dot(uPrecomputeL[0], aPrecomputeLT[0]);
    result += dot(uPrecomputeL[1], aPrecomputeLT[1]);
    result += dot(uPrecomputeL[2], aPrecomputeLT[2]); 
    return result; 
}

void main(void) 
{
  gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix *
                vec4(aVertexPosition, 1.0);
  vColor = vec3(dotSH(aPrecomputeLT, uPrecomputeL0), dotSH(aPrecomputeLT, uPrecomputeL1) ,dotSH(aPrecomputeLT, uPrecomputeL2));
}