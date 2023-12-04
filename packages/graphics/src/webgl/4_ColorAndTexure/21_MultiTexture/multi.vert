attribute vec4 a_Position;
attribute vec2 a_TexCoord;
varying vec2 v_TexCoord;

void main() {
    gl_Position = a_Position;
    // 顶点着色器接收顶点的纹理坐标，光栅化后传递给片元着色器
    v_TexCoord = a_TexCoord;
}