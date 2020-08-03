import React from 'react';

const Card = (props) => {
  const Title = () =>
    props.href ? <a href={props.href}>{props.title}</a> : props.title;
  const Subtitle = () =>
    props.subtitle ? <span className='Cursive'>{props.subtitle}</span> : null;
  return (
    <article className='Card'>
      <h3 className='Card__header'>
        <span className='Star'>
          <Title />
        </span>
        <Subtitle />
      </h3>
      <div className='Card__main'>{props.children}</div>
    </article>
  );
};

export default Card;
