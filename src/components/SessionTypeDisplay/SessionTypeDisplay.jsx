import React, { useState, useEffect } from "react";
import { sessionIntervals, sessionTypes } from "../../constants";

const SessionTypeDisplay = ({ sessionLengthMins }) => {
  const [displaySessionType, setDisplaySessionType] = useState(
    sessionTypes.WORK
  );

  useEffect(() => {
    switch (sessionLengthMins) {
      case sessionIntervals.WORK:
        setDisplaySessionType(sessionTypes.WORK);
        break;
      case sessionIntervals.LONG:
        setDisplaySessionType(sessionTypes.LONG);
        break;
      case sessionIntervals.SHORT:
        setDisplaySessionType(sessionTypes.SHORT);
        break;
      default:
        return;
    }
  }, [sessionLengthMins]);

  return <h2>{displaySessionType}</h2>;
};

export default SessionTypeDisplay;
