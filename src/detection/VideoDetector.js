import React, { useEffect, createRef } from "react";
import { useToasts } from "react-toast-notifications";

const BOUNDING_BOX_LABEL = "Intruder";

const VideoDetector = ({ objectDetector }) => {
  const videoRef = createRef();
  const canvasRef = createRef();

  const { addToast, toastStack } = useToasts();

  const detectFromVideoFrame = async video => {
    try {
      const predictions = await objectDetector.detect(video);

      const personDetections = predictions.filter(p => p.class === "person");

      showDetections(video, personDetections);
      requestAnimationFrame(() => {
        detectFromVideoFrame(video);
      });
    } catch (error) {
      console.log("Couldn't start the webcam");
      console.error(error);
    }
  };

  const showDetections = (video, predictions) => {
    if (predictions.length > 0 && toastStack.length === 0) {
      addToast("Intruder detected", {
        appearance: "error"
      });
    }

    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.drawImage(video, 0, 0);
    const font = "24px helvetica";
    ctx.font = font;
    ctx.textBaseline = "top";

    predictions.forEach(prediction => {
      ctx.strokeStyle = "red";
      ctx.lineWidth = 6;
      ctx.strokeRect(...prediction.bbox);

      const x = prediction.bbox[0];
      const y = prediction.bbox[1];
      const height = prediction.bbox[3];

      ctx.fillStyle = "red";
      const textWidth = ctx.measureText(BOUNDING_BOX_LABEL).width;
      const textHeight = parseInt(font, 10);
      ctx.fillRect(x, y, textWidth + 10, textHeight + 5);
      ctx.fillRect(
        x,
        y + height - textHeight - 5,
        textWidth + 15,
        textHeight + 20
      );

      ctx.fillStyle = "#FFFFFF";
      ctx.fillText(BOUNDING_BOX_LABEL, x + 5, y);
      ctx.fillText(prediction.score.toFixed(2), x + 5, y + height - textHeight);
    });
  };

  useEffect(() => {
    const loadCamera = async () => {
      if (
        navigator.mediaDevices.getUserMedia ||
        navigator.mediaDevices.webkitGetUserMedia
      ) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });
        window.stream = stream;
        videoRef.current.srcObject = stream;
      }
    };
    loadCamera();
  });

  const handleLoadedData = () => {
    detectFromVideoFrame(videoRef.current);
  };

  return (
    <>
      <video
        onLoadedData={handleLoadedData}
        width="1"
        height="1"
        autoPlay
        muted
        ref={videoRef}
      />

      <canvas ref={canvasRef} width="640" height="480" />
    </>
  );
};

export default VideoDetector;
