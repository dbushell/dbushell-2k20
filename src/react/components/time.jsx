import React from 'react';

const Time = (props) => {
  const Month = () => <abbr title={props.MMMM}>{props.MMM}</abbr>;
  return (
    <p>
      <time className="Time" dateTime={props.ISO} title={props.ISO}>
        {props.dddd} {props.D} <Month /> {props.YYYY}
      </time>
    </p>
  );
};

export default Time;
