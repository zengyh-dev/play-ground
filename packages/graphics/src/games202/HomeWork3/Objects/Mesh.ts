import { ReadonlyVec3 } from "gl-matrix";
import { TRSTransform } from "../Renderers/WebGLRenderer";

export interface Attrib {
    name: string;
    array: Float32Array;
}

export interface Transform {
    modelTransX: number;
    modelTransY: number;
    modelTransZ: number;
    modelScaleX: number;
    modelScaleY: number;
    modelScaleZ: number;
    modelRotateX: number;
    modelRotateY: number;
    modelRotateZ: number;
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
    public transform;

    constructor(
        verticesAttrib: Attrib,
        normalsAttrib: Attrib | null,
        texcoordsAttrib: Attrib | null,
        indices: number[],
        transform: Transform
    ) {
        this.indices = indices;
        this.count = indices.length;
        this.hasVertices = false;
        this.hasNormals = false;
        this.hasTexcoords = false;
        // const extraAttribs = [];

        const modelTranslation: ReadonlyVec3 = [transform.modelTransX, transform.modelTransY, transform.modelTransZ];
        const modelScale: ReadonlyVec3 = [transform.modelScaleX, transform.modelScaleY, transform.modelScaleZ];
        const modelRotate: ReadonlyVec3 = [transform.modelRotateX, transform.modelRotateY, transform.modelRotateZ];
        const meshTrans = new TRSTransform(modelTranslation, modelScale, modelRotate);
        this.transform = meshTrans;

        // let extraAttribs = [];

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

    static cube(transform: Transform) {
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

        return new Mesh(
            { name: "aVertexPosition", array: new Float32Array(positions) },
            null,
            null,
            indices,
            transform
        );
    }

    static Quad(transform: Transform) {
        const positions = [-1.0, 1.0, 0.0, -1.0, -1.0, 0.0, 1.0, 1.0, 0.0, 1.0, -1.0, 0.0];

        const texcoords = [0.0, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0, 0.0];

        const indices = [
            0,
            1,
            2,
            1,
            2,
            3, // front
        ];

        return new Mesh(
            { name: "aVertexPosition", array: new Float32Array(positions) },
            null,
            { name: "aTextureCoord", array: new Float32Array(texcoords) },
            indices,
            transform
        );
    }
}
