import { useEffect, useRef, useCallback } from 'react';
import Matter from 'matter-js';

const PhysicsScene = ({ onOrbsCollide }) => {
  const sceneRef = useRef(null);
  const engineRef = useRef(null);
  const renderRef = useRef(null);
  const runnerRef = useRef(null);
  const orbARef = useRef(null);
  const orbBRef = useRef(null);
  const hasCollidedRef = useRef(false);

  const initPhysics = useCallback(() => {
    if (!sceneRef.current || engineRef.current) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    // Create engine with ZERO gravity
    const engine = Matter.Engine.create({
      gravity: { x: 0, y: 0 },
    });
    engineRef.current = engine;

    // Create renderer
    const render = Matter.Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width,
        height,
        wireframes: false,
        background: 'transparent',
        pixelRatio: Math.min(window.devicePixelRatio || 1, 2),
      },
    });
    renderRef.current = render;

    // Wall thickness
    const wallThickness = 100;

    // Create invisible walls
    const walls = [
      Matter.Bodies.rectangle(width / 2, height + wallThickness / 2, width * 2, wallThickness, {
        isStatic: true, label: 'wall', render: { visible: false },
      }),
      Matter.Bodies.rectangle(width / 2, -wallThickness / 2, width * 2, wallThickness, {
        isStatic: true, label: 'wall', render: { visible: false },
      }),
      Matter.Bodies.rectangle(-wallThickness / 2, height / 2, wallThickness, height * 2, {
        isStatic: true, label: 'wall', render: { visible: false },
      }),
      Matter.Bodies.rectangle(width + wallThickness / 2, height / 2, wallThickness, height * 2, {
        isStatic: true, label: 'wall', render: { visible: false },
      }),
    ];

    // Photo dimensions
    const photoSize = Math.min(60, width * 0.12);
    const photoUrls = [
      'https://picsum.photos/seed/mem1/100/130',
      'https://picsum.photos/seed/mem2/100/130',
      'https://picsum.photos/seed/mem3/100/130',
      'https://picsum.photos/seed/mem4/100/130',
      'https://picsum.photos/seed/mem5/100/130',
      'https://picsum.photos/seed/mem6/100/130',
    ];
    const photoColors = ['#8b5cf6', '#ec4899', '#06b6d4', '#f59e0b', '#10b981', '#6366f1'];

    // Create photo bodies (memories)
    const photos = photoUrls.map((url, i) => {
      const angle = (i / photoUrls.length) * Math.PI * 2;
      const radius = Math.min(width, height) * 0.3;
      const x = width / 2 + Math.cos(angle) * radius;
      const y = height / 2 + Math.sin(angle) * radius;
      
      return Matter.Bodies.rectangle(x, y, photoSize, photoSize * 1.3, {
        friction: 0.1,
        restitution: 0.8,
        frictionAir: 0.02,
        render: {
          fillStyle: photoColors[i],
          strokeStyle: 'rgba(255,255,255,0.4)',
          lineWidth: 2,
          sprite: { texture: url, xScale: photoSize / 100, yScale: (photoSize * 1.3) / 130 },
        },
        label: 'photo',
      });
    });

    // Create lanterns (glowing orbs floating upward)
    const lanterns = [];
    for (let i = 0; i < 6; i++) {
      const x = Math.random() * width * 0.8 + width * 0.1;
      const y = Math.random() * height * 0.8 + height * 0.1;
      const size = 15 + Math.random() * 15;
      
      const lantern = Matter.Bodies.circle(x, y, size, {
        friction: 0.05,
        restitution: 0.9,
        frictionAir: 0.01,
        render: {
          fillStyle: `hsl(${40 + Math.random() * 20}, 100%, ${60 + Math.random() * 20}%)`,
          strokeStyle: 'rgba(255, 200, 100, 0.6)',
          lineWidth: 3,
        },
        label: 'lantern',
      });
      
      // Give lanterns slight upward velocity
      Matter.Body.setVelocity(lantern, { x: (Math.random() - 0.5) * 2, y: -1 - Math.random() });
      lanterns.push(lantern);
    }

    // Create the TWO SOULMATE ORBS
    const orbSize = Math.min(40, width * 0.08);
    
    // Orb A (You) - Cyan/Blue
    const orbA = Matter.Bodies.circle(width * 0.3, height / 2, orbSize, {
      friction: 0.05,
      restitution: 0.6,
      frictionAir: 0.005,
      render: {
        fillStyle: '#22d3ee',
        strokeStyle: '#06b6d4',
        lineWidth: 4,
      },
      label: 'orbA',
    });
    orbARef.current = orbA;

    // Orb B (Her) - Pink/Gold
    const orbB = Matter.Bodies.circle(width * 0.7, height / 2, orbSize, {
      friction: 0.05,
      restitution: 0.6,
      frictionAir: 0.005,
      render: {
        fillStyle: '#f472b6',
        strokeStyle: '#ec4899',
        lineWidth: 4,
      },
      label: 'orbB',
    });
    orbBRef.current = orbB;

    // Add mouse constraint for dragging
    const mouse = Matter.Mouse.create(render.canvas);
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false },
      },
    });
    render.mouse = mouse;

    // Add all bodies to world
    Matter.Composite.add(engine.world, [
      ...walls,
      ...photos,
      ...lanterns,
      orbA,
      orbB,
      mouseConstraint,
    ]);

    // Collision detection for orbs
    Matter.Events.on(engine, 'collisionStart', (event) => {
      if (hasCollidedRef.current) return;
      
      for (const pair of event.pairs) {
        const labels = [pair.bodyA.label, pair.bodyB.label];
        if (labels.includes('orbA') && labels.includes('orbB')) {
          hasCollidedRef.current = true;
          
          // SHOCKWAVE: Push all other bodies away
          const collisionPoint = {
            x: (orbA.position.x + orbB.position.x) / 2,
            y: (orbA.position.y + orbA.position.y) / 2,
          };
          
          const allBodies = Matter.Composite.allBodies(engine.world);
          allBodies.forEach((body) => {
            if (!body.isStatic && body.label !== 'orbA' && body.label !== 'orbB') {
              const dx = body.position.x - collisionPoint.x;
              const dy = body.position.y - collisionPoint.y;
              const dist = Math.sqrt(dx * dx + dy * dy) || 1;
              const force = 0.05;
              Matter.Body.applyForce(body, body.position, {
                x: (dx / dist) * force,
                y: (dy / dist) * force,
              });
            }
          });

          // Freeze the orbs
          Matter.Body.setStatic(orbA, true);
          Matter.Body.setStatic(orbB, true);
          
          // Trigger callback
          setTimeout(() => onOrbsCollide(), 500);
        }
      }
    });

    // Create runner
    const runner = Matter.Runner.create();
    runnerRef.current = runner;

    // Start engine
    Matter.Runner.run(runner, engine);
    Matter.Render.run(render);

    // Custom render for glow effects
    Matter.Events.on(render, 'afterRender', () => {
      const ctx = render.context;
      
      // Draw glow for Orb A
      if (orbARef.current && !hasCollidedRef.current) {
        const posA = orbARef.current.position;
        ctx.save();
        ctx.beginPath();
        ctx.arc(posA.x, posA.y, orbSize + 15, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(34, 211, 238, 0.3)';
        ctx.shadowColor = '#22d3ee';
        ctx.shadowBlur = 40;
        ctx.fill();
        ctx.restore();
      }
      
      // Draw glow for Orb B
      if (orbBRef.current && !hasCollidedRef.current) {
        const posB = orbBRef.current.position;
        ctx.save();
        ctx.beginPath();
        ctx.arc(posB.x, posB.y, orbSize + 15, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(244, 114, 182, 0.3)';
        ctx.shadowColor = '#f472b6';
        ctx.shadowBlur = 40;
        ctx.fill();
        ctx.restore();
      }

      // Draw glow for lanterns
      const allBodies = Matter.Composite.allBodies(engine.world);
      allBodies.forEach((body) => {
        if (body.label === 'lantern') {
          ctx.save();
          ctx.beginPath();
          ctx.arc(body.position.x, body.position.y, body.circleRadius + 10, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 200, 100, 0.2)';
          ctx.shadowColor = '#fbbf24';
          ctx.shadowBlur = 20;
          ctx.fill();
          ctx.restore();
        }
      });
    });

    // Apply weak attraction between orbs
    Matter.Events.on(engine, 'beforeUpdate', () => {
      if (hasCollidedRef.current || !orbARef.current || !orbBRef.current) return;
      
      const orbA = orbARef.current;
      const orbB = orbBRef.current;
      
      const dx = orbB.position.x - orbA.position.x;
      const dy = orbB.position.y - orbA.position.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      
      // Very weak attraction force
      const attractionStrength = 0.00002;
      const fx = (dx / dist) * attractionStrength;
      const fy = (dy / dist) * attractionStrength;
      
      Matter.Body.applyForce(orbA, orbA.position, { x: fx, y: fy });
      Matter.Body.applyForce(orbB, orbB.position, { x: -fx, y: -fy });
      
      // Keep lanterns floating upward gently
      const allBodies = Matter.Composite.allBodies(engine.world);
      allBodies.forEach((body) => {
        if (body.label === 'lantern') {
          Matter.Body.applyForce(body, body.position, { x: 0, y: -0.0001 });
        }
      });
    });

    console.log('Physics initialized:', width, 'x', height);
  }, [onOrbsCollide]);

  // Device orientation for tilt control (applies force, not gravity)
  useEffect(() => {
    const handleOrientation = (event) => {
      if (!engineRef.current || hasCollidedRef.current) return;
      
      const { beta, gamma } = event;
      if (beta === null || gamma === null) return;
      
      const allBodies = Matter.Composite.allBodies(engineRef.current.world);
      const forceScale = 0.00005;
      
      allBodies.forEach((body) => {
        if (!body.isStatic) {
          Matter.Body.applyForce(body, body.position, {
            x: (gamma / 90) * forceScale,
            y: (beta / 90) * forceScale,
          });
        }
      });
    };

    const handleMouseMove = (event) => {
      if (!engineRef.current || hasCollidedRef.current) return;
      
      const width = window.innerWidth;
      const height = window.innerHeight;
      const forceScale = 0.00003;
      
      const fx = ((event.clientX - width / 2) / width) * forceScale;
      const fy = ((event.clientY - height / 2) / height) * forceScale;
      
      const allBodies = Matter.Composite.allBodies(engineRef.current.world);
      allBodies.forEach((body) => {
        if (!body.isStatic) {
          Matter.Body.applyForce(body, body.position, { x: fx, y: fy });
        }
      });
    };

    window.addEventListener('deviceorientation', handleOrientation);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Initialize on mount
  useEffect(() => {
    initPhysics();

    return () => {
      if (runnerRef.current) Matter.Runner.stop(runnerRef.current);
      if (renderRef.current) {
        Matter.Render.stop(renderRef.current);
        renderRef.current.canvas?.remove();
      }
      if (engineRef.current) {
        Matter.World.clear(engineRef.current.world);
        Matter.Engine.clear(engineRef.current);
        engineRef.current = null;
      }
    };
  }, [initPhysics]);

  return <div ref={sceneRef} className="physics-canvas" />;
};

export default PhysicsScene;
