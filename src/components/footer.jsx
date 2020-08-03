import React from 'react';

const Copyright = () => (
  <span>Copyright &copy; {new Date().getFullYear()} </span>
);

const Separator = () => <span>&ensp;&bull;&ensp;</span>;

const Footer = () => {
  return (
    <footer className='Footer'>
      <p>
        <small>
          <Copyright />
          <a href='/'>David Bushell</a>
          <Separator />
          <a href='/privacy/'>Privacy Policy</a>
        </small>
      </p>
    </footer>
  );
};

export default Footer;
