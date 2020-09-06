<script>
  import Article from '../components/article.svelte';
  import Aside from '../components/aside.svelte';
  import Button from '../components/button.svelte';
  import Heading from '../components/heading.svelte';
  import Nav from '../components/nav.svelte';
  import Main from '../components/main.svelte';
  import Masthead from '../components/masthead.svelte';
  import Wrapper from '../components/wrapper.svelte';

  export let articles;
  export let latest;
  export let next;
  export let prev;
  export let title;
</script>

<Wrapper>
  <Masthead />
  <Main>
    <Nav />
    <Heading {title} />
    {#each articles as item (item.unix)}
      <Article key={item.unix} {...item} />
    {/each}
    {#if next || prev}
      <div class="Pagination">
        {#if prev}
          <Button href={prev}>Previous</Button>
        {/if}
        {#if next}
          <Button href={next}>Next</Button>
        {/if}
      </div>
    {/if}
  </Main>
  <Aside articles={latest} />
</Wrapper>
