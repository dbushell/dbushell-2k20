import React from 'react';

const Prose = (props) => {
  return (
    <div
      className='Prose'
      dangerouslySetInnerHTML={{__html: props.innerHTML}}
    />
  );
};

export default Prose;
