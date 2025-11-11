import * as THREE from 'three';

const RadialGradientShader = {
  uniforms: {
    u_resolution: { type: 'v2', value: new THREE.Vector2() },
    u_color1: { type: 'c', value: new THREE.Color(0xC6F2F7) }, // Inner color
    u_color2: { type: 'c', value: new THREE.Color(0xB4EEF5) }, // Middle color
    u_color3: { type: 'c', value: new THREE.Color(0xFFFFFF) }, // Outer color (white)
    u_radius: { type: 'f', value: 0.5 }, // Controls the spread of the gradient (0.5 for 300px effect)
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
    uniform float u_radius;

    void main() {
      vec2 st = gl_FragCoord.xy / u_resolution;
      vec2 center = vec2(0.5, 0.5);
      float dist = distance(st, center);

      // Scale the distance by u_radius to control the spread
      dist /= u_radius;

      vec3 color = mix(u_color1, u_color2, smoothstep(0.0, 0.5, dist));
      color = mix(color, u_color3, smoothstep(0.4, 1.0, dist));

      gl_FragColor = vec4(color, 1.0);
    }
  `,
};

export default RadialGradientShader;
