import React from 'react';
import Bio from './bio';
import Card from './card';
import Rule from './rule';
import Social from './social';

const BioCard = () => {
  return (
    <Card title='David Bushell' href='/'>
      <Bio />
      <Social />
    </Card>
  );
};

const AgencyCard = () => {
  return (
    <Card
      title='Web Agencies'
      subtitle='Need a hand?'
      href='/working-with-agencies/'
    >
      <p>
        I’m reliable, flexible, and pride myself in communication and initiative
        to ensure smooth delivery on time and within budget.
      </p>
    </Card>
  );
};

const BusinessCard = () => {
  return (
    <Card
      title='Businesses'
      subtitle='Have an idea?'
      href='/working-with-clients/'
    >
      <p>
        Let’s discuss your requirements, share ideas, and figure out what’s best
        for your new website together.
      </p>
    </Card>
  );
};

const BlogCard = (props) => {
  return (
    <Card title='The Blog' href='/blog/'>
      <p>I write about website design and development.</p>
      <ul className='List'>
        {props.articles.map((item) => {
          return (
            <li key={item.unix}>
              <a
                href={item.href}
                dangerouslySetInnerHTML={{__html: item.title}}
              />
            </li>
          );
        })}
      </ul>
    </Card>
  );
};

const Aside = (props) => {
  return (
    <aside className='Featured'>
      <BioCard />
      <AgencyCard />
      <BusinessCard />
      <Rule />
      {props.articles && <BlogCard articles={props.articles} />}
    </aside>
  );
};

export default Aside;
