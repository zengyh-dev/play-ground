attribute vec4 a_Position;
attribute float a_PointSize;
void main() {
    // Set the vertex coordinates of the point
    gl_Position = a_Position;
    // Set the point size
    gl_PointSize = a_PointSize;
}