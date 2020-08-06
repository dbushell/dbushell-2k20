import React, {useCallback, useEffect, useRef, useState} from 'react';
import ReactDOM from 'react-dom';

const Label = () => <span className='Hidden'>Homepage</span>;

const Logo = () => {
  const ref = useRef();

  const onLoad = useCallback(() => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', ref.current.src, true);
    xhr.send();
    xhr.addEventListener('loadend', (response) => {
      if (ref.current && response.target.status === 200) {
        const el = document.createElement('div');
        ReactDOM.render(<Label />, el);
        ref.current.parentNode.innerHTML =
          el.innerHTML + response.target.responseText;
      }
    });
  }, []);

  useEffect(() => {
    onLoad();
  }, [onLoad]);

  return (
    <a href='/' className='Logo'>
      <Label />
      <img ref={ref} src='/assets/img/dbushell-logo.svg' alt='David Bushell' />
    </a>
  );
};

export default Logo;
