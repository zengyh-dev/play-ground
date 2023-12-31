export interface Attrib {
    name: string;
    array: Float32Array;
}

export class Mesh {
    public indices;
    public count;
    public hasVertices;
    public hasNormals;
    public hasTexcoords;
    public vertices;
    public verticesName;
    public normals;
    public normalsName;
    public texcoords;
    public texcoordsName;

    constructor(
        verticesAttrib: Attrib,
        normalsAttrib: Attrib | null,
        texcoordsAttrib: Attrib | null,
        indices: number[]
    ) {
        this.indices = indices;
        this.count = indices.length;
        this.hasVertices = false;
        this.hasNormals = false;
        this.hasTexcoords = false;
        // const extraAttribs = [];

        if (verticesAttrib != null) {
            this.hasVertices = true;
            this.vertices = verticesAttrib.array;
            this.verticesName = verticesAttrib.name;
        }
        if (normalsAttrib != null) {
            this.hasNormals = true;
            this.normals = normalsAttrib.array;
            this.normalsName = normalsAttrib.name;
        }
        if (texcoordsAttrib != null) {
            this.hasTexcoords = true;
            this.texcoords = texcoordsAttrib.array;
            this.texcoordsName = texcoordsAttrib.name;
        }
    }

    static cube() {
        // prettier-ignore
        const positions = [
			// Front face
			-1.0, -1.0, 1.0,
			1.0, -1.0, 1.0,
			1.0, 1.0, 1.0,
			-1.0, 1.0, 1.0,

			// Back face
			-1.0, -1.0, -1.0,
			-1.0, 1.0, -1.0,
			1.0, 1.0, -1.0,
			1.0, -1.0, -1.0,

			// Top face
			-1.0, 1.0, -1.0,
			-1.0, 1.0, 1.0,
			1.0, 1.0, 1.0,
			1.0, 1.0, -1.0,

			// Bottom face
			-1.0, -1.0, -1.0,
			1.0, -1.0, -1.0,
			1.0, -1.0, 1.0,
			-1.0, -1.0, 1.0,

			// Right face
			1.0, -1.0, -1.0,
			1.0, 1.0, -1.0,
			1.0, 1.0, 1.0,
			1.0, -1.0, 1.0,

			// Left face
			-1.0, -1.0, -1.0,
			-1.0, -1.0, 1.0,
			-1.0, 1.0, 1.0,
			-1.0, 1.0, -1.0,
		];
        // prettier-ignore
        const indices = [
			0, 1, 2, 0, 2, 3,    // front
			4, 5, 6, 4, 6, 7,    // back
			8, 9, 10, 8, 10, 11,   // top
			12, 13, 14, 12, 14, 15,   // bottom
			16, 17, 18, 16, 18, 19,   // right
			20, 21, 22, 20, 22, 23,   // left
		];
        return new Mesh({ name: "aVertexPosition", array: new Float32Array(positions) }, null, null, indices);
    }
}
