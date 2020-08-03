import React from 'react';
import Time from './time';

const Article = (props) => {
  return (
    <article className='Article'>
      <h2 className='Star'>
        <a href={props.href} dangerouslySetInnerHTML={{__html: props.title}} />
      </h2>
      {props.date && <Time {...props.date} />}
      {props.excerpt && <p>{props.excerpt}</p>}
    </article>
  );
};

export default Article;
