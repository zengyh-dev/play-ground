precision mediump float;//!!! 需要声明浮点数精度，否则报错No precision specified for (float)
varying vec4 v_Color;
void main() {
    gl_FragColor = v_Color;
}