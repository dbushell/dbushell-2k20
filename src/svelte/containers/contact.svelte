<script>
  import Aside from '../components/aside.svelte';
  import Heading from '../components/heading.svelte';
  import Nav from '../components/nav.svelte';
  import Main from '../components/main.svelte';
  import Masthead from '../components/masthead.svelte';
  import Contact from '../components/contact.svelte';
  import Wrapper from '../components/wrapper.svelte';

  export let latest;
</script>

<Wrapper>
  <Masthead />
  <Main>
    <Nav />
    <Heading title={`Contact`} />
    <h3 class="Cursive">Here to help</h3>
    <p class="Large">Need help with your website?</p>
    <p class="Large">
      <a href="mailto:hi@dbushell.com"><b>hi@dbushell.com</b></a>
    </p>
    <div id="contact-form">
      <Contact />
    </div>
  </Main>
  <Aside articles={latest} />
</Wrapper>
