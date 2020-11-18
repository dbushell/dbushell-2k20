import React from 'react';

const Card = (props) => {
  const Title = () =>
    props.href ? <a href={props.href}>{props.title}</a> : props.title;
  const Subtitle = () =>
    props.subtitle ? <span className="Cursive">{props.subtitle}</span> : null;
  return (
    <article className="Card">
      <h3>
        <span className="Star">
          <Title />
        </span>
        <Subtitle />
      </h3>
      <div>{props.children}</div>
    </article>
  );
};

export default Card;
