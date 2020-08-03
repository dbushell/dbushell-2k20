import React, {useCallback, useEffect, useRef, useState} from 'react';

const Logo = () => {
  const ref = useRef();

  const onLoad = useCallback(() => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', ref.current.src, true);
    xhr.send();
    xhr.addEventListener('loadend', (response) => {
      if (ref.current && response.target.status === 200) {
        ref.current.parentNode.innerHTML = response.target.responseText;
      }
    });
  }, []);

  useEffect(() => {
    onLoad();
  }, [onLoad]);

  return (
    <a href='/' className='Logo'>
      <img ref={ref} src='/assets/img/dbushell-logo.svg' alt='David Bushell' />
    </a>
  );
};

export default Logo;
