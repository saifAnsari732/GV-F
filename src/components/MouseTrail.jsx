"use client";
import React, { useEffect, useRef } from 'react';

const MouseTrail = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    
    // Colors matching the screenshot (pastels: blue, green, pink, orange, purple)
    const colors = ['#60A5FA', '#34D399', '#F472B6', '#FBBF24', '#A78BFA', '#818CF8'];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resize);
    resize();

    const mouse = { x: -100, y: -100 };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      // Spawn 1-2 particles per mouse move event
      const count = Math.random() > 0.5 ? 2 : 1;
      for (let i = 0; i < count; i++) {
        particles.push(new Particle(e.clientX, e.clientY));
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    class Particle {
      constructor(x, y) {
        // Slight random offset from the mouse pointer
        this.x = x + (Math.random() - 0.5) * 30;
        this.y = y + (Math.random() - 0.5) * 30;
        
        // Velocity (how fast they drift)
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2 + 0.5; // Slight downward gravity
        
        this.life = 1;
        this.decay = Math.random() * 0.02 + 0.015; // Fade out speed
        
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.length = Math.random() * 8 + 6; // Length of the sprinkle
        this.width = Math.random() * 2 + 2; // Thickness
        
        this.angle = Math.random() * Math.PI * 2; // Random rotation
        this.rotSpeed = (Math.random() - 0.5) * 0.1;
      }
      
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= this.decay;
        this.angle += this.rotSpeed;
      }
      
      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.globalAlpha = Math.max(0, this.life);
        ctx.fillStyle = this.color;
        
        // Draw rounded rectangle using arcs if roundRect is not widely supported, 
        // but roundRect is standard in modern browsers.
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(-this.width/2, -this.length/2, this.width, this.length, this.width/2);
        } else {
          ctx.rect(-this.width/2, -this.length/2, this.width, this.length);
        }
        ctx.fill();
        ctx.restore();
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        
        if (particles[i].life <= 0) {
          particles.splice(i, 1);
          i--;
        }
      }
      
      // Draw the pointer circle
      if (mouse.x !== -100 && mouse.y !== -100) {
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 16, 0, Math.PI * 2);
        ctx.strokeStyle = '#3b82f6'; // blue-500 matching the screenshot
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999]"
      style={{ display: 'block' }}
    />
  );
};

export default MouseTrail;
