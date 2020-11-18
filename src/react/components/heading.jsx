import React from 'react';

const Heading = ({title}) => {
  const __html = title.replace(/(-)/g, `<span class="Hyphen">$1</span>`);
  return <h1 className="Comic" dangerouslySetInnerHTML={{__html}} />;
};

export default Heading;
