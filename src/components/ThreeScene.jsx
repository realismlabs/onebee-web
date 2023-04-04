import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import SplineLoader from '@splinetool/loader';

function ThreeScene() {
  const containerRef = useRef();

  useEffect(() => {
    // camera
    const camera = new THREE.OrthographicCamera(
      window.innerWidth / -2,
      window.innerWidth / 2,
      window.innerHeight / 2,
      window.innerHeight / -2,
      -100000,
      100000
    );
    camera.position.set(887.67, 595.68, 889.34);
    camera.quaternion.setFromEuler(new THREE.Euler(-0.44, 0.75, 0.31));

    // scene
    const scene = new THREE.Scene();

    // spline scene
    const loader = new SplineLoader();
    loader.load(
      'https://prod.spline.design/IrsrdahadGVfpHPS/scene.splinecode',
      (splineScene) => {
        scene.add(splineScene);
      }
    );

    // renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setAnimationLoop(animate);
    containerRef.current.appendChild(renderer.domElement);

    // scene settings
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;

    scene.background = new THREE.Color('#040a18');
    renderer.setClearAlpha(0);

    // orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.125;

    function onWindowResize() {
      camera.left = window.innerWidth / -2;
      camera.right = window.innerWidth / 2;
      camera.top = window.innerHeight / 2;
      camera.bottom = window.innerHeight / -2;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener('resize', onWindowResize);

    function animate(time) {
      controls.update();
      renderer.render(scene, camera);
    }

    return () => {
      // Clean up the event listener and renderer when the component unmounts
      window.removeEventListener('resize', onWindowResize);
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} />;
}

export default ThreeScene;
