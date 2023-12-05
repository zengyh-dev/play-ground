// 需要声明浮点数精度，否则报错No precision specified for (float)  
#ifdef GL_ES
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
#endif

uniform sampler2D u_Sampler0;
uniform sampler2D u_Sampler1;

varying vec2 v_TexCoord;

void main() {
    // 片元着色器根据片元的纹理坐标，从纹理图像中抽出纹素颜色，赋给当前片元
    vec4 color0 = texture2D(u_Sampler0, v_TexCoord);
    vec4 color1 = texture2D(u_Sampler1, v_TexCoord);
    gl_FragColor = color0 * color1;
}