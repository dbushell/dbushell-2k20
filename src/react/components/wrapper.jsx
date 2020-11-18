import React from 'react';
import Lightbulb from '../components/lightbulb';
import Footer from './footer';

const Wrapper = (props) => {
  return (
    <div className="Wrapper">
      <div className="Layout">{props.children}</div>
      <Lightbulb />
      <Footer />
    </div>
  );
};

export default Wrapper;
