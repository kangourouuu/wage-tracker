import * as THREE from 'three';

const LiquidGlassShader = {
  uniforms: {
    u_time: { type: 'f', value: 0.0 },
    u_color1: { type: 'c', value: new THREE.Color(0x4FC3F7) }, // Primary color
    u_color2: { type: 'c', value: new THREE.Color(0x81D4FA) }, // Light blue
    u_color3: { type: 'c', value: new THREE.Color(0xB3E5FC) }, // Even lighter blue
    u_opacity: { type: 'f', value: 0.6 },
  },
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vPosition;
    
    void main() {
      vUv = uv;
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 u_color1;
    uniform vec3 u_color2;
    uniform vec3 u_color3;
    uniform float u_time;
    uniform float u_opacity;
    varying vec2 vUv;
    varying vec3 vPosition;

    // Noise functions for liquid effect
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

    float snoise(vec2 v) {
      const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                          0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                         -0.577350269189626,  // -1.0 + 2.0 * C.x
                          0.024390243902439); // 1.0 / 41.0
      vec2 i  = floor(v + dot(v, C.yy) );
      vec2 x0 = v -   i + dot(i, C.xx);
      vec2 i1;
      i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod289(i);
      vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
        + i.x + vec3(0.0, i1.x, 1.0 ));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
      m = m*m ;
      m = m*m ;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }

    void main() {
      // Create flowing liquid effect
      vec2 uv = vUv * 3.0;
      float time = u_time * 0.15;
      
      // Multiple layers of noise for depth
      float noise1 = snoise(uv + vec2(time * 0.3, time * 0.2));
      float noise2 = snoise(uv * 2.0 - vec2(time * 0.2, time * 0.3));
      float noise3 = snoise(uv * 0.5 + vec2(time * 0.1, -time * 0.15));
      
      // Combine noises
      float combined = (noise1 * 0.5 + noise2 * 0.3 + noise3 * 0.2);
      
      // Create wave pattern
      float wave = sin(vUv.x * 5.0 + time) * cos(vUv.y * 4.0 - time * 0.7) * 0.3;
      combined += wave;
      
      // Normalize to 0-1 range
      float t = (combined + 1.0) * 0.5;
      
      // Create flowing color gradient
      vec3 color = mix(u_color1, u_color2, smoothstep(0.0, 0.5, t));
      color = mix(color, u_color3, smoothstep(0.5, 1.0, t));
      
      // Add glass-like highlights
      float highlight = pow(abs(sin(vUv.x * 10.0 + time * 2.0) * sin(vUv.y * 10.0 - time * 1.5)), 3.0);
      color += vec3(highlight * 0.15);
      
      // Create bubbles/orbs effect
      float bubbles = 0.0;
      for(int i = 0; i < 5; i++) {
        float fi = float(i);
        vec2 bubblePos = vec2(
          sin(time * 0.5 + fi * 2.0) * 0.3 + 0.5,
          mod(vUv.y + time * (0.1 + fi * 0.05), 1.0)
        );
        float dist = distance(vUv, bubblePos);
        bubbles += smoothstep(0.1, 0.0, dist) * 0.3;
      }
      color += vec3(bubbles);
      
      gl_FragColor = vec4(color, u_opacity);
    }
  `,
};

export default LiquidGlassShader;
