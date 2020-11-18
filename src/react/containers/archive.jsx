import React from 'react';
import Aside from '../components/aside';
import Nav from '../components/nav';
import Main from '../components/main';
import Masthead from '../components/masthead';
import Article from '../components/article';
import Button from '../components/button';
import Wrapper from '../components/wrapper';
import Heading from '../components/heading';

const Pagination = (props) => {
  if (!props.next && !props.prev) {
    return null;
  }
  return (
    <div className="Pagination">
      {props.prev && <Button href={props.prev}>Previous</Button>}
      {props.next && <Button href={props.next}>Next</Button>}
    </div>
  );
};

const Container = (props) => {
  return (
    <Wrapper>
      <Masthead />
      <Main>
        <Nav />
        <Heading title={props.title} />
        {props.articles.map(function (item) {
          return <Article key={item.unix} {...item} />;
        })}
        <Pagination {...props} />
      </Main>
      <Aside articles={props.latest} />
    </Wrapper>
  );
};

export default Container;
