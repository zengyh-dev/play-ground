#version 300 es
#ifdef GL_ES
// #extension GL_EXT_draw_buffers: enable
precision highp float;
#endif

layout(location = 0) out vec4 Frag0;
layout(location = 1) out vec4 Frag1;
layout(location = 2) out vec4 Frag2;
layout(location = 3) out vec4 Frag3;
layout(location = 4) out vec4 Frag4;
// layout(location = 5) out vec4 Frag5;

uniform sampler2D uKd; // 漫反射纹理的采样器
uniform sampler2D uNt; // 切线法线纹理的采样器(Tangent Normal)
uniform sampler2D uShadowMap;

// varying mat4 vWorldToLight;
// varying highp vec2 vTextureCoord;
// varying highp vec4 vPosWorld;
// varying highp vec3 vNormalWorld;
// varying highp float vDepth;

in mat4 vWorldToLight;
in vec2 vTextureCoord;
in vec4 vPosWorld;
in vec3 vNormalWorld;
in float vDepth;

// 阴影映射算法
// 根据世界坐标位置和一个偏差值来计算阴影的强度。具体的实现包括将世界坐标转换到光空间坐标，计算阴影纹理坐标，获取阴影深度值，然后根据深度值差异和偏差值来判断阴影的存在与否
float SimpleShadowMap(vec3 posWorld, float bias) {
    // 世界坐标转换到光空间坐标
    vec4 posLight = vWorldToLight * vec4(posWorld, 1.0f);
    // 计算阴影纹理坐标
    vec2 shadowCoord = clamp(posLight.xy * 0.5f + 0.5f, vec2(0.0f), vec2(1.0f));
    // 获取阴影深度值
    float depthSM = texture(uShadowMap, shadowCoord).x;
    // 当前片元的深度值
    float depth = (posLight.z * 0.5f + 0.5f) * 100.0f;

    // 根据深度值差异和偏差值来判断阴影的存在与否
    // 如果x小于edge，则返回0.0; 如果x大于等于edge，则返回1.0
    return step(0.0f, depthSM - depth + bias);
}

// 计算基于法线的局部坐标系
// 它接收一个法线向量并计算出两个正交的向量，用于在切线空间中对法线贴图进行采样
void LocalBasis(vec3 n, out vec3 b1, out vec3 b2) {
    float sign_ = sign(n.z);
    if(n.z == 0.0f) {
        sign_ = 1.0f;
    }
    float a = -1.0f / (sign_ + n.z);
    float b = n.x * n.y * a;
    b1 = vec3(1.0f + sign_ * n.x * n.x * a, sign_ * b, -sign_ * n.x);
    b2 = vec3(b, sign_ + n.y * n.y * a, -n.y);
}

// 将纹理中的法线向量从局部切线空间转换为世界空间
vec3 ApplyTangentNormalMap() {
    vec3 t, b;
    LocalBasis(vNormalWorld, t, b);
    // 法向量，范围从[0,1]映射到[-1,1]
    vec3 nt = texture(uNt, vTextureCoord).xyz * 2.0f - 1.0f;
    // 局部切线空间转换为世界空间，并归一化
    nt = normalize(nt.x * t + nt.y * b + nt.z * vNormalWorld);
    return nt;
}

#define u_Near 1e-2
#define u_Far 1000.0f

float LinearizeDepth(float depth) {
    float z = depth * 2.0f - 1.0f;
    return (2.0f * u_Near * u_Far) / (u_Far + u_Near - z * (u_Far - u_Near));
}

void main(void) {
    vec3 kd = texture(uKd, vTextureCoord).rgb;
  // gl_FragData[0] = vec4(kd, 1.0);
  // gl_FragData[1] = vec4(vec3(vDepth), 1.0);
  // gl_FragData[2] = vec4(ApplyTangentNormalMap(), 1.0);
  // gl_FragData[3] = vec4(vec3(SimpleShadowMap(vPosWorld.xyz, 1e-2)), 1.0);
  // gl_FragData[4] = vec4(vec3(vPosWorld.xyz), 1.0);

    // 纹理
    Frag0 = vec4(kd, 1.0f);

    // 深度
    Frag1 = vec4(vec3(vDepth), 1.0f);

    // 世界空间的法向量
    Frag2 = vec4(ApplyTangentNormalMap(), 1.0f);

    // 阴影判断
    Frag3 = vec4(vec3(SimpleShadowMap(vPosWorld.xyz, 1e-2f)), 1.0f);

    // 片元位置
    Frag4 = vec4(vec3(vPosWorld.xyz), 1.0f);
  // Frag5 = vec4(vec3(vDepth), 1.0);
  // Frag5 = vec4(vec3(LinearizeDepth(gl_FragCoord.z)/150.), 1.0);
}
