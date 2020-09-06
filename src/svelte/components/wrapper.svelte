<script>
  import Lightbulb from './lightbulb.svelte';
  import Footer from './footer.svelte';
</script>

<div class="Wrapper">
  <div class="Layout">
    <slot />
  </div>
  <Lightbulb />
  <Footer />
</div>
