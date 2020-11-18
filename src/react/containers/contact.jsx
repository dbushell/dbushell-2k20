import React from 'react';
import Aside from '../components/aside';
import Nav from '../components/nav';
import Main from '../components/main';
import Masthead from '../components/masthead';
import ContactForm from '../components/contact-form';
import Wrapper from '../components/wrapper';
import Heading from '../components/heading';

const Container = (props) => {
  return (
    <Wrapper>
      <Masthead />
      <Main>
        <Nav />
        <Heading title={`Contact`} />
        <h3 className="Cursive">Here to help</h3>
        <p className="Large">Need help with your website?</p>
        <p className="Large">
          <a href="mailto:hi@dbushell.com">
            <b>hi@dbushell.com</b>
          </a>
        </p>
        <div id="contact-form">
          <ContactForm />
        </div>
      </Main>
      <Aside articles={props.latest} />
    </Wrapper>
  );
};

export default Container;
