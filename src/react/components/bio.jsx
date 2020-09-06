import React from 'react';

const Bio = () => {
  return (
    <div className='Bio'>
      <figure>
        <img
          alt='David Bushell'
          loading='lazy'
          src='/assets/img/me@1x.jpg'
          srcSet='/assets/img/me@1x.jpg 1x, /assets/img/me@2x.jpg 2x'
        />
        <figcaption className='Hidden'>Headshot of David Bushell</figcaption>
      </figure>
      <div>
        <p>
          Based in the UK, near Manchester, I freelance for small businesses,
          start-ups, individuals, and fellow web agencies — all over the world.
        </p>
      </div>
    </div>
  );
};

export default Bio;
