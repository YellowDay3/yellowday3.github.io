class WaveShader {
    constructor(canvas) {
        this.canvas = canvas;
        this.gl = this.canvas.getContext('webgl');
        this.startTime = Date.now();
        this.initWebGL();
        this.render();
    }

    initWebGL() {
        // Resize the canvas to fit the window
        this.resizeCanvas();
        window.addEventListener('resize', this.resizeCanvas.bind(this));

        // Load and compile shaders
        const vertexShaderSource = this.getVertexShaderSource();
        const fragmentShaderSource = this.getFragmentShaderSource();

        const vertexShader = this.createShader(this.gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, fragmentShaderSource);

        this.program = this.createProgram(vertexShader, fragmentShader);
        this.gl.useProgram(this.program);

        // Set up position buffer
        const positionLocation = this.gl.getAttribLocation(this.program, 'a_position');
        const positionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([
            -1, -1, 1, -1, -1, 1, 
            -1, 1, 1, -1, 1, 1
        ]), this.gl.STATIC_DRAW);

        this.gl.enableVertexAttribArray(positionLocation);
        this.gl.vertexAttribPointer(positionLocation, 2, this.gl.FLOAT, false, 0, 0);

        // Uniform locations
        this.iResolutionLocation = this.gl.getUniformLocation(this.program, 'iResolution');
        this.iTimeLocation = this.gl.getUniformLocation(this.program, 'iTime');
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    }

    createShader(type, source) {
        const shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);
        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            console.error(this.gl.getShaderInfoLog(shader));
            this.gl.deleteShader(shader);
            return null;
        }
        return shader;
    }

    createProgram(vertexShader, fragmentShader) {
        const program = this.gl.createProgram();
        this.gl.attachShader(program, vertexShader);
        this.gl.attachShader(program, fragmentShader);
        this.gl.linkProgram(program);
        if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
            console.error(this.gl.getProgramInfoLog(program));
            this.gl.deleteProgram(program);
            return null;
        }
        return program;
    }

    getVertexShaderSource() {
        return `
            attribute vec2 a_position;
            void main() {
                gl_Position = vec4(a_position, 0.0, 1.0);
            }
        `;
    }

    getFragmentShaderSource() {
        return `
            precision mediump float;
            uniform float iTime;
            uniform vec2 iResolution;

            #define s smoothstep
            #define pi 3.1415
            #define rot(a) mat2(cos(a), -sin(a), sin(a), cos(a))

            vec3 red = vec3(0.847, 0.133, 0.325);
            vec3 blue = vec3(0.16, 0.12, 0.32);
            vec3 crimson = vec3(0.714, 0.063, 0.243) * 1.5;
            vec3 fire1 = vec3(0.886, 0.184, 0.400) * 1.2;
            vec3 mist = vec3(0.416, 0.584, 1.51);

            void main() {
                vec2 fragCoord = gl_FragCoord.xy;
                vec2 uv = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;
                vec2 uv2 = uv * 5.0;
                vec2 uv3 = uv;
                vec2 uv4 = uv;

                uv4 *= rot(1.2);
                uv = fract(0.5 + uv * 0.1) - 0.5;
                uv2 *= rot(iTime * 0.1);

                uv3.x -= uv3.y;
                uv3.x += floor(sin(uv3.x * 5.0 - tan(cos(tan(sin(iTime * 0.15)) * uv3.x * 3.0)) * 10.0) * sin(uv3.x * 10.0 - iTime) * cos((uv3.x) * 10.0 - iTime * 0.5) * 2.0) * 0.5 + 1.0;

                uv4.x += sin(uv4.y + iTime) * cos(uv4.x + iTime * 2.0) * tan(cos(uv.x * 50.0) * 0.2) * 0.5;

                vec3 f1 = vec3(min(0.02 / s(0.6, 0.0, abs(uv4.x)), 1.0));
                vec3 f2 = vec3(min(0.02 / s(0.7, 0.0, abs(uv4.x)), 1.0));

                vec3 bg = vec3(0.082, 0.024, 0.153);
                bg += f1 * fire1;
                bg += f2 * fire1;

                uv4 *= rot(pi * 0.25);
                uv4.x -= sin(uv4.y + iTime * 1.5) * tan(sin(uv4.y + iTime * 2.0) + 0.2) * tan(cos(uv4.x * 50.0) * 0.1 + 0.1) * 0.75;

                bg += clamp(vec3(s(0.31, 0.3, abs(uv4.x))), vec3(0.0), 1.0 - min(f1 + vec3(0.0) * 8.0, 1.0)) * mist;

                gl_FragColor = vec4(bg, 1.0);
            }
        `;
    }

    render() {
        const currentTime = (Date.now() - this.startTime) * 0.001;
        this.gl.uniform2f(this.iResolutionLocation, this.canvas.width, this.canvas.height);
        this.gl.uniform1f(this.iTimeLocation, currentTime);

        this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
        requestAnimationFrame(this.render.bind(this));
    }
}

// Initialize the shader on a specific canvas
window.addEventListener('load', () => {
    const canvas = document.getElementById('bg-shader');
    new WaveShader(canvas);
});
