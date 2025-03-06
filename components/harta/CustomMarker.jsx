"use client";

import React from "react";
import { OverlayView } from "@react-google-maps/api";

const CustomMarker = ({ position, onClick, children }) => {
  return (
    <OverlayView
      position={position}
      mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
    >
      <div onClick={onClick} style={{ transform: "translate(-50%, -50%)", cursor: "pointer" }}>
        {children}
      </div>
    </OverlayView>
  );
};

export default CustomMarker;
