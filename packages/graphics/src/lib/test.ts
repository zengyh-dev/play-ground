/* eslint-disable no-prototype-builtins */
export class Matrix4 {
    elements: Float32Array;

    constructor(opt_src?: { elements: Float32Array }) {
        if (opt_src && typeof opt_src === "object" && opt_src.hasOwnProperty("elements")) {
            const s = opt_src.elements;
            const d = new Float32Array(16);
            for (let i = 0; i < 16; ++i) {
                d[i] = s[i];
            }
            this.elements = d;
        } else {
            this.elements = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
        }
    }

    setIdentity(): Matrix4 {
        const e = this.elements;
        e[0] = 1;
        e[4] = 0;
        e[8] = 0;
        e[12] = 0;
        e[1] = 0;
        e[5] = 1;
        e[9] = 0;
        e[13] = 0;
        e[2] = 0;
        e[6] = 0;
        e[10] = 1;
        e[14] = 0;
        e[3] = 0;
        e[7] = 0;
        e[11] = 0;
        e[15] = 1;
        return this;
    }

    set(src: { elements: Float32Array }): Matrix4 {
        const s = src.elements;
        const d = this.elements;

        if (s === d) {
            return this;
        }

        for (let i = 0; i < 16; ++i) {
            d[i] = s[i];
        }

        return this;
    }

    concat(other: Matrix4): Matrix4 {
        const e = this.elements;
        const a = this.elements;
        let b = other.elements;

        if (e === b) {
            b = new Float32Array(16);
            for (let i = 0; i < 16; ++i) {
                b[i] = e[i];
            }
        }

        for (let i = 0; i < 4; i++) {
            const ai0 = a[i];
            const ai1 = a[i + 4];
            const ai2 = a[i + 8];
            const ai3 = a[i + 12];
            e[i] = ai0 * b[0] + ai1 * b[1] + ai2 * b[2] + ai3 * b[3];
            e[i + 4] = ai0 * b[4] + ai1 * b[5] + ai2 * b[6] + ai3 * b[7];
            e[i + 8] = ai0 * b[8] + ai1 * b[9] + ai2 * b[10] + ai3 * b[11];
            e[i + 12] = ai0 * b[12] + ai1 * b[13] + ai2 * b[14] + ai3 * b[15];
        }

        return this;
    }

    multiply(other: Matrix4): Matrix4 {
        return this.concat(other);
    }

    multiplyVector3(pos: { elements: Float32Array }): { elements: Float32Array } {
        const e = this.elements;
        const p = pos.elements;
        const v = new Vector3();
        const result = v.elements;

        result[0] = p[0] * e[0] + p[1] * e[4] + p[2] * e[8] + e[12];
        result[1] = p[0] * e[1] + p[1] * e[5] + p[2] * e[9] + e[13];
        result[2] = p[0] * e[2] + p[1] * e[6] + p[2] * e[10] + e[14];

        return v;
    }

    multiplyVector4(pos: { elements: Float32Array }): { elements: Float32Array } {
        const e = this.elements;
        const p = pos.elements;
        const v = new Vector4();
        const result = v.elements;

        result[0] = p[0] * e[0] + p[1] * e[4] + p[2] * e[8] + p[3] * e[12];
        result[1] = p[0] * e[1] + p[1] * e[5] + p[2] * e[9] + p[3] * e[13];
        result[2] = p[0] * e[2] + p[1] * e[6] + p[2] * e[10] + p[3] * e[14];
        result[3] = p[0] * e[3] + p[1] * e[7] + p[2] * e[11] + p[3] * e[15];

        return v;
    }

    transpose(): Matrix4 {
        const e = this.elements;
        let t;
        t = e[1];
        e[1] = e[4];
        e[4] = t;
        t = e[2];
        e[2] = e[8];
        e[8] = t;
        t = e[3];
        e[3] = e[12];
        e[12] = t;
        t = e[6];
        e[6] = e[9];
        e[9] = t;
        t = e[7];
        e[7] = e[13];
        e[13] = t;
        t = e[11];
        e[11] = e[14];
        e[14] = t;
        return this;
    }
}
