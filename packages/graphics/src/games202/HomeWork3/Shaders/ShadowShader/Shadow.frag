#version 300 es

#ifdef GL_ES
// #extension GL_EXT_draw_buffers: enable
precision highp float;
#endif

layout(location = 0) out vec4 Frag0;

uniform vec3 uCameraPos;

// varying highp vec3 vNormal;
// varying highp vec2 vTextureCoord;
// varying highp float vDepth;

in vec3 vNormal;
in vec2 vTextureCoord;
in float vDepth;

vec4 EncodeFloatRGBA(float v) {
    vec4 enc = vec4(1.0f, 255.0f, 65025.0f, 160581375.0f) * v;
    enc = fract(enc);
    enc -= enc.yzww * vec4(1.0f / 255.0f, 1.0f / 255.0f, 1.0f / 255.0f, 0.0f);
    return enc;
}

void main() {
  // gl_FragData[0] = vec4(vec3(gl_FragCoord.z) * 100.0, 1.0);
  // gl_FragData[0] = EncodeFloatRGBA(gl_FragCoord.z * 100.0);

    Frag0 = vec4(vec3(gl_FragCoord.z) * 100.0f, 1.0f);
}