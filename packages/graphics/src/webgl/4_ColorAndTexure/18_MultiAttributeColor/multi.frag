// 需要声明浮点数精度，否则报错No precision specified for (float)  
precision mediump float;
// 到片元着色器，已经是被内插过的颜色
varying vec4 v_Color;
void main() {
    gl_FragColor = v_Color;
}