import React, { useEffect, createRef } from "react";

const styles = {
  position: "absolute",
  top: 0,
  left: 0
};

const VideoDetector = ({ objectDetector }) => {
  const videoRef = createRef();
  const canvasRef = createRef();

  const detectFromVideoFrame = async video => {
    try {
      const predictions = await objectDetector.detect(video);
      showDetections(video, predictions);
      requestAnimationFrame(() => {
        detectFromVideoFrame(video);
      });
    } catch (error) {
      console.log("Couldn't start the webcam");
      console.error(error);
    }
  };

  const showDetections = (video, predictions) => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.drawImage(video, 0, 0);
    const font = "24px helvetica";
    ctx.font = font;
    ctx.textBaseline = "top";

    predictions.forEach(prediction => {
      const x = prediction.bbox[0];
      const y = prediction.bbox[1];
      const width = prediction.bbox[2];
      const height = prediction.bbox[3];
      // Draw the bounding box.
      ctx.strokeStyle = "red";
      ctx.lineWidth = 4;
      ctx.strokeRect(x, y, width, height);
      // Draw the label background.
      ctx.fillStyle = "red";
      const textWidth = ctx.measureText(prediction.class).width;
      const textHeight = parseInt(font, 10);
      // draw top left rectangle
      ctx.fillRect(x, y, textWidth + 10, textHeight + 10);
      // draw bottom left rectangle
      ctx.fillRect(x, y + height - textHeight, textWidth + 15, textHeight + 10);

      // Draw the text last to ensure it's on top.
      ctx.fillStyle = "#000000";
      ctx.fillText(
        prediction.class === "person" ? "douchebag" : prediction.class,
        x,
        y
      );
      ctx.fillText(prediction.score.toFixed(2), x, y + height - textHeight);
    });
  };

  useEffect(() => {
    const loadCamera = async () => {
      if (
        navigator.mediaDevices.getUserMedia ||
        navigator.mediaDevices.webkitGetUserMedia
      ) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false
          });
          window.stream = stream;
          videoRef.current.srcObject = stream;
        } catch (e) {
          console.log(e.message);
        }
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
        style={styles}
        width="1"
        height="1"
        autoPlay
        muted
        ref={videoRef}
      />
      <canvas style={styles} ref={canvasRef} width="720" height="650" />
    </>
  );
};

export default VideoDetector;
