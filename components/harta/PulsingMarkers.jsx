import React from "react";
import { OverlayView } from "@react-google-maps/api";

const PulsingMarker = ({ position, onClick }) => {
  const markerStyle = {
    position: "absolute",
    width: "20px",
    height: "20px",
    backgroundColor: "rgba(0,150,136,1)",
    borderRadius: "50%",
    transform: "translate(-50%, -50%)",
    cursor: "pointer",
  };

  return (
    <OverlayView position={position} mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
      <div onClick={onClick} style={markerStyle} className="pulse-marker" />
    </OverlayView>
  );
};

export default PulsingMarker;
