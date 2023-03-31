import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { CSS3DRenderer, CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer";

function ThreeDiv({ children }) {
  const mount = useRef(null);
  const renderer = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    renderer.current = new CSS3DRenderer();
    renderer.current.setSize(window.innerWidth, window.innerHeight);
    renderer.current.domElement.style.position = "absolute";
    renderer.current.domElement.style.top = 0;
    mount.current.appendChild(renderer.current.domElement);

    const wrapper = new THREE.Object3D();
    console.log('Hi', wrapper);
    wrapper.scale.set(0.1, 0.1, 0.1);
    scene.add(wrapper);

    let cssObject;
    if (wrapper) {
      cssObject = new CSS3DObject(wrapper);
      renderer.current.domElement.appendChild(cssObject.element);
    }

    function animate() {
      requestAnimationFrame(animate);
      wrapper.rotation.x -= 0.01;
      renderer.current.render(scene, camera);
    }

    animate();

    return () => {
      renderer.current.dispose();
    }
  }, []);

  return (
    <div ref={mount}>
      <div>
        {children}
      </div>
    </div>
  );
}

export default ThreeDiv;
