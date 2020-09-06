<script>
  import Aside from '../components/aside.svelte';
  import Heading from '../components/heading.svelte';
  import Nav from '../components/nav.svelte';
  import Main from '../components/main.svelte';
  import Masthead from '../components/masthead.svelte';
  import Prose from '../components/prose.svelte';
  import Wrapper from '../components/wrapper.svelte';

  export let body;
  export let latest;
  export let title;
</script>

<Wrapper>
  <Masthead />
  <Main>
    <Nav />
    <Heading {title} />
    <Prose innerHTML={body} />
  </Main>
  <Aside articles={latest} />
</Wrapper>
