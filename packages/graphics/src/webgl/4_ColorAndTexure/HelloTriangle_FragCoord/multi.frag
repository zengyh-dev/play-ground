// 需要声明浮点数精度，否则报错No precision specified for (float)  
precision mediump float;
uniform float u_Width;
uniform float u_Height;
void main() {
    gl_FragColor = vec4(gl_FragCoord.x / u_Width, 0.0, gl_FragCoord.y / u_Height, 1.0);
}