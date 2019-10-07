import React, { useState, useEffect } from "react";
import {
  Card,
  VisualPicker,
  VisualPickerOption
} from "react-rainbow-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGhost,
  faImage,
  faRecordVinyl
} from "@fortawesome/free-solid-svg-icons";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import Loader from "./Loader";
import ImageDetector from "./ImageDetector";

const iconContainerStyles = {
  width: "4.5rem",
  height: "4.5rem"
};

const textStyles = {
  fontSize: 16,
  color: "#a4a7b5",
  marginTop: 16,
  fontWeight: 300
};

const textChooserStyles = {
  fontSize: 16,
  marginTop: "1rem",
  marginBottom: "1rem"
};

const App = () => {
  const [source, setSource] = useState(null);
  const [model, setModel] = useState(null);

  useEffect(() => {
    const loadModel = async () => {
      const loadedModel = await cocoSsd.load({ base: "mobilenet_v2" });
      setModel(loadedModel);
    };
    loadModel();
  }, []);

  const handleChangeSource = newSource => {
    setSource(newSource);
  };

  return (
    <div className="rainbow-m-around_x-large">
      <Card
        title="Burglar Alarm"
        icon={
          <span
            className="rainbow-background-color_gray-4 rainbow-border-radius_circle rainbow-align-content_center"
            style={iconContainerStyles}
          >
            <FontAwesomeIcon
              icon={faGhost}
              size="3x"
              className="rainbow-color_yellow "
            />
          </span>
        }
      >
        {model === null && <Loader text="Loading the model" />}
        {model !== null && (
          <div className="rainbow-p-around_x-large rainbow-align-content_center rainbow-flex_column">
            <VisualPicker
              label={<h1 style={textChooserStyles}>Choose Source</h1>}
              value={source}
              onChange={handleChangeSource}
            >
              <VisualPickerOption name="image">
                <FontAwesomeIcon
                  icon={faImage}
                  size="3x"
                  className="rainbow-color_brand-active"
                />
                <h2 style={textStyles}>Photo</h2>
              </VisualPickerOption>
              <VisualPickerOption name="webcam">
                <FontAwesomeIcon
                  icon={faRecordVinyl}
                  size="3x"
                  className="rainbow-color_brand-active"
                />
                <h2 style={textStyles}>Webcam</h2>
              </VisualPickerOption>
            </VisualPicker>

            {source === "image" && <ImageDetector objectDetector={model} />}
          </div>
        )}
      </Card>
    </div>
  );
};

export default App;
