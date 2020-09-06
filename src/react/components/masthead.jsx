import React from 'react';
import Logo from './logo';

const Masthead = () => {
  return (
    <div className='Masthead'>
      <div id='logo'>
        <Logo />
      </div>
      <a className='Sign' href='/contact/'>
        <span className='Hidden'>Contact</span>
        <img
          alt='Get in Touch I’m Available for Hire'
          width='540'
          height='325'
          loading='lazy'
          src='/assets/img/dbushell-for-hire.svg'
        />
      </a>
    </div>
  );
};

export default Masthead;
