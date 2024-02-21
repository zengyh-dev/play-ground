attribute vec3 aVertexPosition;
attribute vec3 aNormalPosition;
attribute mat3 aPrecomputeLT;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

uniform mat3 uPrecomputeL[3];

varying highp vec3 vNormal;
varying highp mat3 vPrecomputeLT;
varying highp vec3 vColor;

float L_dot_LT(mat3 PrecomputeLT, mat3 PrecomputeL) {
    float result = 0.0;
    // 这里PrecomputeLT和PrecomputeL都是矩阵
    // 比如：取[0]取的是第一列,都是R通道,点积就是向量每一项相乘相加，得到某个通道的值
    result += dot(PrecomputeLT[0], PrecomputeL[0]);
    result += dot(PrecomputeLT[1], PrecomputeL[1]);
    result += dot(PrecomputeLT[2], PrecomputeL[2]);
    return result;
}

void main(void) {
  // 无实际作用，避免aNormalPosition被优化后产生警告
    vNormal = (uModelMatrix * vec4(aNormalPosition, 0.0)).xyz;

    for(int i = 0; i < 3; i++) {
        vColor[i] = L_dot_LT(aPrecomputeLT, uPrecomputeL[i]);
    }

    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aVertexPosition, 1.0);
}