import * as THREE from 'three';

const RadialGradientShader = {
  uniforms: {
    u_resolution: { type: 'v2', value: new THREE.Vector2() },
    u_color1: { type: 'c', value: new THREE.Color(0xE0F2F7) }, // Lightest blue
    u_color2: { type: 'c', value: new THREE.Color(0x81D4FA) }, // Medium blue
    u_color3: { type: 'c', value: new THREE.Color(0x4FC3F7) }, // Primary blue
    u_color4: { type: 'c', value: new THREE.Color(0x03A9F4) }, // Darker blue
  },
  vertexShader: `
    void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform vec2 u_resolution;
    uniform vec3 u_color1;
    uniform vec3 u_color2;
    uniform vec3 u_color3;
    uniform vec3 u_color4;

    void main() {
      vec2 st = gl_FragCoord.xy / u_resolution;
      vec2 center = vec2(0.5, 0.5);
      float dist = distance(st, center);

      vec3 color = mix(u_color1, u_color2, smoothstep(0.0, 0.4, dist));
      color = mix(color, u_color3, smoothstep(0.3, 0.7, dist));
      color = mix(color, u_color4, smoothstep(0.6, 1.0, dist));

      gl_FragColor = vec4(color, 1.0);
    }
  `,
};

export default RadialGradientShader;
