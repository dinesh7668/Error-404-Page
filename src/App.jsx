import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Orbit, Zap } from 'lucide-react';

// Animation variants
const glitchVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.8, ease: "easeOut" }
  },
  glitch: {
    x: [0, -5, 5, -2, 2, 0],
    y: [0, 2, -2, 1, -1, 0],
    opacity: [1, 0.8, 1, 0.9, 1, 1],
    transition: {
      duration: 0.4,
      repeat: Infinity,
      repeatDelay: 3,
      ease: "easeInOut"
    }
  }
};

const floatVariants = {
  float: {
    y: [0, -15, 0],
    rotate: [0, 5, -5, 0],
    transition: {
      duration: 5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const App = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Normalize mouse pos from -1 to 1 based on center of screen
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Parallax calculations
  const parallaxX = mousePosition.x * 20;
  const parallaxY = mousePosition.y * 20;

  // Particle positions mapping (fixed initialization to avoid react hydration mismatches though we are client-only here)
  const [particles, setParticles] = useState([]);
  
  useEffect(() => {
    const newParticles = Array.from({ length: 40 }).map(() => ({
      size: Math.random() * 4 + 1,
      isCyan: Math.random() > 0.5,
      startX: (Math.random() - 0.5) * window.innerWidth,
      startY: (Math.random() - 0.5) * window.innerHeight * 2,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 5,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <>
      <div className="noise-overlay" />
      <div className="scanline" />

      {/* Cyber Grid Base */}
      <div className="cyber-grid-wrapper">
        <div className="cyber-grid" />
        <div className="grid-fade" />
      </div>

      <motion.div 
        className="glass-panel"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          padding: "4rem 5rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          zIndex: 10,
          perspective: 1000,
          // Center the panel
          marginLeft: "-250px", // Approximate half width
          marginTop: "-250px"   // Approximate half height
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: 1,
          scale: 1,
          x: parallaxX,
          y: parallaxY,
          rotateX: -mousePosition.y * 8,
          rotateY: mousePosition.x * 8
        }}
        transition={{ 
          opacity: { duration: 0.8 },
          scale: { duration: 0.8 },
          x: { type: "spring", stiffness: 50, damping: 20 },
          y: { type: "spring", stiffness: 50, damping: 20 },
          rotateX: { type: "spring", stiffness: 50, damping: 20 },
          rotateY: { type: "spring", stiffness: 50, damping: 20 }
        }}
      >
        <motion.div variants={floatVariants} animate="float" style={{ marginBottom: "2rem" }}>
          <div style={{ position: "relative" }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            >
              <Orbit size={100} color="var(--neon-cyan)" />
            </motion.div>
          </div>
        </motion.div>
        
        <motion.h1 
          className="neon-text-cyan"
          style={{ fontSize: "6rem", margin: 0, lineHeight: 1 }}
          variants={glitchVariants}
          initial="hidden"
          animate={["visible", "glitch"]}
        >
          404
        </motion.h1>

        <motion.h2 
          className="neon-text-pink"
          style={{ fontSize: "2.2rem", margin: "1rem 0", textTransform: "uppercase", letterSpacing: "4px" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          SYSTEM OFFLINE
        </motion.h2>
        
        <motion.p
          style={{ 
            color: "var(--text-secondary)", 
            fontSize: "1.2rem", 
            marginBottom: "3rem",
            maxWidth: "350px",
            textAlign: "center",
            fontWeight: 500
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          Warning: The navigational coordinates you mapped do not correspond to any sector in this galaxy. 
        </motion.p>
        
        <motion.button 
          className="cyber-button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.location.href = '/'}
        >
          <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Zap size={20} /> REBOOT SYSTEM
          </span>
        </motion.button>
      </motion.div>

      {/* Floating particles background */}
      {particles.map((p, i) => (
        <motion.div
          key={i}
          style={{
            position: "absolute",
            width: p.size + "px",
            height: p.size + "px",
            backgroundColor: p.isCyan ? "var(--neon-cyan)" : "var(--neon-pink)",
            borderRadius: "50%",
            zIndex: 0,
            opacity: Math.random() * 0.5 + 0.2,
            left: "50%",
            top: "50%"
          }}
          initial={{
            x: p.startX,
            y: p.startY,
          }}
          animate={{
            y: [p.startY, p.startY - window.innerHeight * 1.5],
            opacity: [null, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "linear",
            delay: p.delay,
          }}
        />
      ))}
    </>
  );
};

export default App;
