import React, { useState, useEffect } from "react";
import { sessionIntervals } from "../../constants";

const TimerDigits = ({ secondsRemaining, sessionLengthMins }) => {
  const [displayMins, setDisplayMins] = useState(sessionIntervals.WORK);
  const [displaySecs, setDisplaySecs] = useState(0);

  useEffect(() => {
    if (secondsRemaining === 0) {
      setDisplayMins(0);
      setDisplaySecs(sessionLengthMins);
    } else if (secondsRemaining < 60) {
      setDisplayMins(0);
      setDisplaySecs(secondsRemaining);
    } else {
      const newSecs = secondsRemaining % 60;
      const newMins = (secondsRemaining - newSecs) / 60;

      setDisplayMins(newMins);
      setDisplaySecs(newSecs);
    }
  }, [secondsRemaining, sessionLengthMins]);

  const getDisplayValue = num => (`${num}`.length === 1 ? `0${num}` : `${num}`);

  return (
    <div className="timer">
      <div className="timer-digits">{getDisplayValue(displayMins)}</div>
      <div className="timer-digit-separator">:</div>
      <div className="timer-digits">{getDisplayValue(displaySecs)}</div>
    </div>
  );
};

export default TimerDigits;
