#version 300 es

// attribute vec3 aVertexPosition;
// attribute vec3 aNormalPosition;
// attribute vec2 aTextureCoord;

layout(location = 0) in vec3 aVertexPosition;
layout(location = 1) in vec3 aNormalPosition;
layout(location = 2) in vec2 aTextureCoord;

uniform mat4 uLightVP;
uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

// varying mat4 vWorldToLight;

// varying highp vec2 vTextureCoord;
// varying highp vec3 vNormalWorld;
// varying highp vec4 vPosWorld;
// varying highp float vDepth;

out mat4 vWorldToLight;

out vec2 vTextureCoord;
out vec3 vNormalWorld;
out vec4 vPosWorld;
out float vDepth;

void main(void) {
    vec4 posWorld = uModelMatrix * vec4(aVertexPosition, 1.0f);
    vPosWorld = posWorld.xyzw / posWorld.w;

    vec4 normalWorld = uModelMatrix * vec4(aNormalPosition, 0.0f);
    vNormalWorld = normalize(normalWorld.xyz);

    vTextureCoord = aTextureCoord;

    vWorldToLight = uLightVP;

    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aVertexPosition, 1.0f);
    // w表示透视除法因子, 而1/w表示透视除法后的深度值
    // 将深度值存储在vDepth中是为了传递给片段着色器，并不会自动执行透视除法
    // 透视除法是在顶点着色器之后、光栅化阶段之前由OpenGL自动执行的

    // w分量本身不是深度值，但它隐式地包含了深度信息
    // 由于透视投影的效果，w分量随着物体离相机的距离而变化，因此可以通过w分量的比例来推断物体的深度
    vDepth = gl_Position.w;
}