﻿namespace TSE {

    /**
     * Represents a 2-dimensional sprite which is drawn on the screen.
     * */
    export class Sprite {

        protected _name: string;
        protected _width: number;
        protected _height: number;

        protected _buffer: GLBuffer;
        private _materialName:string;
        private _material:Material;

        public position:Vector3 = new Vector3();   // 只是 暂时存储位置数据

        /**
         * Creates a new sprite.
         * @param name The name of this sprite.
         * @param materialName The name of the material to use with this sprite.
         * @param width The width of this sprite.
         * @param height The height of this sprite.
         */
        public constructor(name: string, materialName:string,  width: number = 100, height: number = 100) {
            this._name = name;
            this._materialName = materialName;
            this._material = MaterialManager.getMaterial(materialName);
            this._width = width;
            this._height = height;
        }

        public get name(): string {
            return this._name;
        }

        public destroy(): void {
            this._buffer.destroy();
            MaterialManager.releaseMaterial(this._materialName);
            this._material = undefined;
            this._materialName = undefined;
        }

        /**
         * Performs loading routines on this sprite.
         * */
        public load(): void {    // 把 engine.ts 中的 craeteBuffer 函数内容拷贝过来。 
            this._buffer = new GLBuffer();
            let positionArribute = new AttributeInfo();
            positionArribute.location = 0//this._shader.getAttributeLocation("a_position");
            positionArribute.offset = 0;
            positionArribute.size = 3;
            this._buffer.addAttributeLocation(positionArribute);

            let texCoordArribute = new AttributeInfo();
            texCoordArribute.location = 1//this._shader.getAttributeLocation("a_position");
            texCoordArribute.offset = 3;
            texCoordArribute.size = 2;
            this._buffer.addAttributeLocation(texCoordArribute);

            let vertices = [
                // x, y, z
                0, 0, 0, 0 ,0 ,
                0, this._height, 0, 0, 1.0, 
                this._width, this._height, 0, 1.0, 1.0, 

                this._width, this._height, 0, 1.0, 1.0, 
                this._width, 0, 0, 1.0, 0,
                0, 0, 0,  0, 0
            ];

            this._buffer.pushBackData(vertices);
            this._buffer.upload();
            this._buffer.unbind();
        }

        /**
         * Performs update routines on this sprite.
         * @param time The delta time in milliseconds since the last update call.
         */
        public update(time: number): void {

        }

        /** Draws this sprite. */
        public draw(shader: Shader, model: Matrix4x4): void {
            // set uniform 
            let colorPosition = shader.getUniformLocation("u_tint");
            //gl.uniform4f(colorPosition, 1, 1, 1, 1);
            gl.uniform4fv(colorPosition, this._material.tint.toFloat32Array());

            let modelPosition = shader.getUniformLocation("u_model");
            gl.uniformMatrix4fv(modelPosition, false, model.toFloat32Array());

            if (this._material.diffuseTexture !== undefined) {
                this._material.diffuseTexture.activateAndBind(0);
                let diffuseLocation = shader.getUniformLocation("u_diffuse");
                gl.uniform1i(diffuseLocation, 0);
            }

            this._buffer.bind();
            this._buffer.draw();
        }
    }
}