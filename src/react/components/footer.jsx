import React from 'react';

const Copyright = () => (
  <span>Copyright &copy; 2004–{new Date().getFullYear()} </span>
);

const Separator = () => <span>&ensp;&bull;&ensp;</span>;

const Footer = () => {
  return (
    <footer className="Footer">
      <h3 className="Hidden">Copyright and Privacy</h3>
      <p>
        <small>
          <Copyright />
          <a href="/">David Bushell</a>
          <Separator />
          <a href="/privacy/">Privacy Policy</a>
        </small>
      </p>
    </footer>
  );
};

export default Footer;
