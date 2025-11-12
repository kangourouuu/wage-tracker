import * as THREE from 'three';

const RadialGradientShader = {
  uniforms: {
    u_color1: { type: 'c', value: new THREE.Color(0xbbf9ff) }, // Inner color
    u_color2: { type: 'c', value: new THREE.Color(0xc9faff) }, // Middle color
    u_color3: { type: 'c', value: new THREE.Color(0xFFFFFF) }, // Outer color (white)
    u_radius: { type: 'f', value: 0.5 }, // Controls the spread of the gradient (0.5 for 300px effect)
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 u_color1;
    uniform vec3 u_color2;
    uniform vec3 u_color3;
    uniform float u_radius;
    varying vec2 vUv;

    void main() {
      vec2 center = vec2(0.5, 0.5);
      float dist = distance(vUv, center);

      // Scale the distance by u_radius to control the spread
      dist /= u_radius;

      vec3 color = mix(u_color1, u_color2, smoothstep(0.0, 0.5, dist));
      color = mix(color, u_color3, smoothstep(0.4, 1.0, dist));

      gl_FragColor = vec4(color, 1.0);
    }
  `,
};

export default RadialGradientShader;
