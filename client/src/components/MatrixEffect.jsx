import React, { useEffect, useRef } from "react";

const MatrixEffect = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let width = (canvas.width = window.screen.width);
    let height = (canvas.height = window.screen.height);
    let columns = Math.floor(width / 20);
    const characters = "01";
    const charArray = characters.split("");
    let drops = [];

    for (let i = 0; i < columns; i++) {
      drops[i] = 1;
    }

    let frameRate = 25;
    let lastFrameTime = Date.now();

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.04)";
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = "#0f0";

      ctx.font = "15px monospace";
      for (let i = 0; i < drops.length; i++) {
        const text = charArray[Math.floor(Math.random() * charArray.length)];
        ctx.fillText(text, i * 20, drops[i] * 20);

        if (drops[i] * 20 > height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      }
    };

    const animate = () => {
      const currentTime = Date.now();
      const elapsedTime = currentTime - lastFrameTime;

      if (elapsedTime > 1000 / frameRate) {
        draw();
        lastFrameTime = currentTime;
      }

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      width = canvas.width = window.screen.width;
      height = canvas.height = window.screen.height;
      columns = Math.floor(width / 20);
      drops = [];
      for (let i = 0; i < columns; i++) {
        drops[i] = 1;
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full" />;
};

export default MatrixEffect;
