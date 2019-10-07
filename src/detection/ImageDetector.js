import React, { useState, useEffect } from "react";
import minion from "./data/minion.png";

const ImageDetector = ({ objectDetector }) => {
  const [showDetections, setShowDetections] = useState(false);
  const [detectionCount, setDetectionCount] = useState(0);

  useEffect(() => {
    const detectFromImage = async () => {
      const image = document.getElementById("image");
      image.crossOrigin = "anonymous";
      image.src = minion;

      const predictions = await objectDetector.detect(image);

      const personDetections = predictions.filter(p => p.class === "person");

      const c = document.getElementById("canvas");
      c.width = image.width;
      c.height = image.height;
      const context = c.getContext("2d");
      context.drawImage(image, 0, 0);
      context.font = "16px Arial";

      for (let i = 0; i < predictions.length; i++) {
        context.beginPath();
        context.rect(...predictions[i].bbox);
        context.lineWidth = 6;
        context.strokeStyle = "white";
        context.fillStyle = "white";
        context.stroke();
        context.fillText(
          predictions[i].score.toFixed(3) + " " + predictions[i].class,
          predictions[i].bbox[0],
          predictions[i].bbox[1] > 10 ? predictions[i].bbox[1] - 5 : 10
        );
      }

      setShowDetections(true);
      setDetectionCount(personDetections.length);
    };
    detectFromImage();
  });

  return (
    <>
      {!showDetections && <img id="image" />}
      <canvas id="canvas" />
      <h1 style={{ fontSize: "1.5rem", marginTop: "1rem" }}>
        {detectionCount} intruders detected
      </h1>
    </>
  );
};

export default ImageDetector;
