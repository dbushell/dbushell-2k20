import React from 'react';
import Aside from '../components/aside';
import Nav from '../components/nav';
import Main from '../components/main';
import Masthead from '../components/masthead';
import Button from '../components/button';
import Article from '../components/article';
import Wrapper from '../components/wrapper';
import Rule from '../components/rule';
import Heading from '../components/heading';

const Container = (props) => {
  const h1 = `<span class='Hidden'>David Bushell</span>
    <span>Web Design &amp; Development</span>`;
  return (
    <Wrapper>
      <Masthead />
      <Main>
        <Nav />
        <Heading title={h1} />
        <h3 className='Cursive'>I make websites</h3>
        <div className='Prose'>
          <p className='Large'>
            HTML, CSS, &amp; JavaScript. There’s web standards and then there’s
            browsers, and I know both. I design websites that work across all
            devices. They’re fluid and adaptive, just like my process. Be it
            React, PWAs, WordPress, or simply advice, I have a depth of
            experience to help you.
          </p>
          <div className='Crane'>
            <img
              alt='Origami Crane - Copyright © David Bushell'
              src='/assets/img/origami-crane.png'
              width='500'
              height='520'
              loading='lazy'
              role='presentation'
            />
            <div>
              <ul className='List List--large'>
                <li>
                  <a href='/front-end-development/'>Front-end Development</a>
                </li>
                <li>
                  <a href='/responsive-design/'>Responsive Design</a>
                </li>
                <li>
                  <a href='/services/'>And a whole lot more&hellip;</a>
                </li>
              </ul>
              <Button href='/contact/'>Hire Me!</Button>
            </div>
          </div>
          <h3 className="Cursive">What my clients say</h3>
          <blockquote>
            <p>
              Highly skilled, personable, helpful and dedicated: David exceeded
              my expectations to deliver for us on a key project.
            </p>
            <p>
              <cite>Frank Fenton – Head of Digital – Dinosaur UK Ltd.</cite>
            </p>
          </blockquote>
          <Rule />
          <h3 className='Cursive'>Featured article</h3>
        </div>
        <Article {...props.latest[0]} />
      </Main>
      <Aside articles={props.latest} />
    </Wrapper>
  );
};

export default Container;
