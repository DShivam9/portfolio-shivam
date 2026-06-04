"use client";

import React, { useEffect, useRef } from "react";

export default function FooterShaderBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const activeCanvas = canvas;

    const gl = canvas.getContext("webgl", { antialias: false, powerPreference: "high-performance" });
    if (!gl) {
      console.warn("WebGL not supported in this browser.");
      return;
    }
    const activeGl = gl;

    // Vertex Shader: full-screen quad
    const vsSource = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    // Fragment Shader: fire particles and smoke (GLSL dependency ordered)
    const fsSource = `
      precision highp float;
      uniform vec2 iResolution;
      uniform float iTime;

      #define PI 3.1415927
      #define TWO_PI 6.283185

      #define ANIMATION_SPEED 1.5
      #define MOVEMENT_SPEED 1.0
      #define MOVEMENT_DIRECTION vec2(0.7, -1.0)

      #define PARTICLE_SIZE 0.009

      #define PARTICLE_SCALE (vec2(0.5, 1.6))
      #define PARTICLE_SCALE_VAR (vec2(0.25, 0.2))

      #define PARTICLE_BLOOM_SCALE (vec2(0.5, 0.8))
      #define PARTICLE_BLOOM_SCALE_VAR (vec2(0.3, 0.1))

      #define SPARK_COLOR vec3(1.0, 0.4, 0.05) * 1.5
      #define BLOOM_COLOR vec3(1.0, 0.4, 0.05) * 0.8
      #define SMOKE_COLOR vec3(1.0, 0.43, 0.1) * 0.8

      #define SIZE_MOD 1.05
      #define ALPHA_MOD 0.9
      #define LAYERS_COUNT 15

      // --- UTILITIES (Top declarations to prevent compilation errors) ---
      float hash1_2(in vec2 x)
      {
        return fract(sin(dot(x, vec2(52.127, 61.2871))) * 521.582);   
      }

      vec2 hash2_2(in vec2 x)
      {
        return fract(sin(x * mat2(20.52, 24.1994, 70.291, 80.171)) * 492.194);
      }

      vec2 noise2_2(vec2 uv)
      {
        vec2 f = smoothstep(0.0, 1.0, fract(uv));
        vec2 uv00 = floor(uv);
        vec2 uv01 = uv00 + vec2(0,1);
        vec2 uv10 = uv00 + vec2(1,0);
        vec2 uv11 = uv00 + 1.0;
        vec2 v00 = hash2_2(uv00);
        vec2 v01 = hash2_2(uv01);
        vec2 v10 = hash2_2(uv10);
        vec2 v11 = hash2_2(uv11);
        
        vec2 v0 = mix(v00, v01, f.y);
        vec2 v1 = mix(v10, v11, f.y);
        return mix(v0, v1, f.x);
      }

      float noise1_2(in vec2 uv)
      {
        vec2 f = fract(uv);
        vec2 uv00 = floor(uv);
        vec2 uv01 = uv00 + vec2(0,1);
        vec2 uv10 = uv00 + vec2(1,0);
        vec2 uv11 = uv00 + 1.0;
        
        float v00 = hash1_2(uv00);
        float v01 = hash1_2(uv01);
        float v10 = hash1_2(uv10);
        float v11 = hash1_2(uv11);
        
        float v0 = mix(v00, v01, f.y);
        float v1 = mix(v10, v11, f.y);
        return mix(v0, v1, f.x);
      }

      float layeredNoise1_2(in vec2 uv, in float sizeMod, in float alphaMod, in int layers, in float animation)
      {
        float noise = 0.0;
        float alpha = 1.0;
        float size = 1.0;
        vec2 offset = vec2(0.0);
        for (int i = 0; i < 15; i++) // Constant loop bound for WebGL compatibility
        {
            if (i >= layers) break;
            offset += hash2_2(vec2(alpha, size)) * 10.0;
            noise += noise1_2(uv * size + iTime * animation * 8.0 * MOVEMENT_DIRECTION * MOVEMENT_SPEED + offset) * alpha;
            alpha *= alphaMod;
            size *= sizeMod;
        }
        
        noise *= (1.0 - alphaMod)/(1.0 - pow(alphaMod, float(layers)));
        return noise;
      }

      vec2 rotate(in vec2 point, in float deg)
      {
        float s = sin(deg);
        float c = cos(deg);
        return mat2(s, c, -c, s) * point;
      }

      vec2 voronoiPointFromRoot(in vec2 root, in float deg)
      {
        vec2 point = hash2_2(root) - 0.5;
        float s = sin(deg);
        float c = cos(deg);
        point = mat2(s, c, -c, s) * point * 0.66;
        point += root + 0.5;
        return point;
      }

      float degFromRootUV(in vec2 uv)
      {
        return iTime * ANIMATION_SPEED * (hash1_2(uv) - 0.5) * 2.0;   
      }

      vec2 randomAround2_2(in vec2 point, in vec2 range, in vec2 uv)
      {
        return point + (hash2_2(uv) - 0.5) * range;
      }

      vec3 fireParticles(in vec2 uv, in vec2 originalUV)
      {
        vec3 particles = vec3(0.0);
        vec2 rootUV = floor(uv);
        float deg = degFromRootUV(rootUV);
        vec2 pointUV = voronoiPointFromRoot(rootUV, deg);
        float dist = 2.0;
        float distBloom = 0.0;
       
        vec2 tempUV = uv + (noise2_2(uv * 2.0) - 0.5) * 0.1;
        tempUV += -(noise2_2(uv * 3.0 + iTime) - 0.5) * 0.07;

        dist = length(rotate(tempUV - pointUV, 0.7) * randomAround2_2(PARTICLE_SCALE, PARTICLE_SCALE_VAR, rootUV));
        distBloom = length(rotate(tempUV - pointUV, 0.7) * randomAround2_2(PARTICLE_BLOOM_SCALE, PARTICLE_BLOOM_SCALE_VAR, rootUV));

        particles += (1.0 - smoothstep(PARTICLE_SIZE * 0.6, PARTICLE_SIZE * 3.0, dist)) * SPARK_COLOR;
        particles += pow((1.0 - smoothstep(0.0, PARTICLE_SIZE * 6.0, distBloom)) * 1.0, 3.0) * BLOOM_COLOR;

        float border = (hash1_2(rootUV) - 0.5) * 2.0;
        float disappear = 1.0 - smoothstep(border, border + 0.5, originalUV.y);
        
        border = (hash1_2(rootUV + 0.214) - 1.8) * 0.7;
        float appear = smoothstep(border, border + 0.4, originalUV.y);
        
        return particles * disappear * appear;
      }

      vec3 layeredParticles(in vec2 uv, in float sizeMod, in float alphaMod, in int layers, in float smoke) 
      { 
        vec3 particles = vec3(0);
        float size = 1.0;
        float alpha = 1.0;
        vec2 offset = vec2(0.0);
        vec2 noiseOffset = vec2(0.0);
        vec2 bokehUV = vec2(0.0);
        
        for (int i = 0; i < 15; i++) // Constant loop bound for WebGL compatibility
        {
            if (i >= layers) break;
            noiseOffset = (noise2_2(uv * size * 2.0 + 0.5) - 0.5) * 0.15;
            bokehUV = (uv * size + iTime * MOVEMENT_DIRECTION * MOVEMENT_SPEED) + offset + noiseOffset; 
            particles += fireParticles(bokehUV, uv) * alpha * (1.0 - smoothstep(0.0, 1.0, smoke) * (float(i) / float(layers)));
            offset += hash2_2(vec2(alpha, alpha)) * 10.0;
            alpha *= alphaMod;
            size *= sizeMod;
        }
        
        return particles;
      }

      void mainImage( out vec4 fragColor, in vec2 fragCoord )
      {
        vec2 uv = (2.0 * fragCoord - iResolution.xy) / iResolution.x;
        float vignette = 1.0 - smoothstep(0.4, 1.4, length(uv + vec2(0.0, 0.3)));
        uv *= 1.8;
        
        float smokeIntensity = layeredNoise1_2(uv * 10.0 + iTime * 4.0 * MOVEMENT_DIRECTION * MOVEMENT_SPEED, 1.7, 0.7, 6, 0.2);
        smokeIntensity *= pow(1.0 - smoothstep(-1.0, 1.6, uv.y), 2.0); 
        vec3 smoke = smokeIntensity * SMOKE_COLOR * 0.8 * vignette;
        
        smoke *= pow(layeredNoise1_2(uv * 4.0 + iTime * 0.5 * MOVEMENT_DIRECTION * MOVEMENT_SPEED, 1.8, 0.5, 3, 0.2), 2.0) * 1.5;
        
        vec3 particles = layeredParticles(uv, SIZE_MOD, ALPHA_MOD, LAYERS_COUNT, smokeIntensity);
        
        vec3 col = particles + smoke + SMOKE_COLOR * 0.02;
        col *= vignette;
        col = smoothstep(-0.08, 1.0, col);

        fragColor = vec4(col, 1.0);
      }

      void main() {
        mainImage(gl_FragColor, gl_FragCoord.xy);
      }
    `;

    // Shader Helper Functions
    function compileShader(glContext: WebGLRenderingContext, source: string, type: number): WebGLShader | null {
      const shader = glContext.createShader(type);
      if (!shader) return null;
      glContext.shaderSource(shader, source);
      glContext.compileShader(shader);
      if (!glContext.getShaderParameter(shader, glContext.COMPILE_STATUS)) {
        console.error("Shader compilation error:", glContext.getShaderInfoLog(shader));
        glContext.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vs = compileShader(gl, vsSource, gl.VERTEX_SHADER);
    const fs = compileShader(gl, fsSource, gl.FRAGMENT_SHADER);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Shader linking error:", gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    // Vertex positions (full-screen quad)
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1.0, -1.0,
         1.0, -1.0,
        -1.0,  1.0,
        -1.0,  1.0,
         1.0, -1.0,
         1.0,  1.0,
      ]),
      gl.STATIC_DRAW
    );

    const positionLoc = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    const uResolution = gl.getUniformLocation(program, "iResolution");
    const uTime = gl.getUniformLocation(program, "iTime");

    let isVisible = true;
    let animationFrameId: number;
    let accumulatedTime = 0;
    let lastTime = performance.now();

    // Resize Handler
    function resize() {
      if (!activeCanvas) return;
      const width = activeCanvas.clientWidth;
      const height = activeCanvas.clientHeight;
      if (activeCanvas.width !== width || activeCanvas.height !== height) {
        activeCanvas.width = width;
        activeCanvas.height = height;
        activeGl.viewport(0, 0, width, height);
      }
    }
    resize();
    window.addEventListener("resize", resize);

    // Render loop
    function render(now: number) {
      if (!isVisible) return;

      resize();

      const delta = (now - lastTime) / 1000;
      lastTime = now;
      accumulatedTime += delta;

      activeGl.uniform2f(uResolution, activeCanvas.width, activeCanvas.height);
      activeGl.uniform1f(uTime, accumulatedTime);

      activeGl.drawArrays(activeGl.TRIANGLES, 0, 6);

      animationFrameId = requestAnimationFrame(render);
    }

    // IntersectionObserver to pause rendering when canvas is off-screen
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
          if (isVisible) {
            lastTime = performance.now();
            animationFrameId = requestAnimationFrame(render);
          } else {
            cancelAnimationFrame(animationFrameId);
          }
        });
      },
      { threshold: 0.05 }
    );

    observer.observe(activeCanvas);

    // Cleanup
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      activeGl.deleteBuffer(positionBuffer);
      activeGl.deleteProgram(program);
      activeGl.deleteShader(vs);
      activeGl.deleteShader(fs);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0 bg-transparent opacity-85"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
