import React from 'react';

const Button = (props) => {
  return (
    <a className='Button' href={props.href}>
      {props.children}
    </a>
  );
};

export default Button;
