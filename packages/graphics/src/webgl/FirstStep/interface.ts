export type Color = [number, number, number, number];

export interface Point {
    gl_point_x: number;
    gl_point_y: number;
    gl_point_color: Color;
}
