<script>
  import {onMount} from 'svelte';

  const awsHandler =
    'https://6rovexooub.execute-api.eu-west-1.amazonaws.com/production/contact';

  let isSuccess = false;
  let isError = false;
  let isLive = false;

  let consentRef;
  let robotRef;

  onMount(() => {
    isLive = true;
  });

  const onSubmit = (ev) => {
    ev.preventDefault();
    if (consentRef.checked !== true) {
      return;
    }
    if (robotRef.value !== '') {
      isError = true;
      return;
    }
    isLive = false;
    const data = JSON.stringify({
      name: document.querySelector('#contact-name').value,
      replyTo: document.querySelector('#contact-email').value,
      enquiry: document.querySelector('#contact-enquiry').value
    });
    const xhr = new XMLHttpRequest();
    xhr.open('POST', awsHandler, true);
    xhr.setRequestHeader('Accept', 'application/json; charset=UTF-8');
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    xhr.addEventListener('loadend', (response) => {
      if (response.target.status === 200) {
        isSuccess = true;
      } else {
        isError = true;
      }
    });
    xhr.send(data);
  };
</script>

{#if isSuccess}
  <p>
    <strong>Thank you for your enquiry, I’ll reply as soon as possible.</strong>
  </p>
{:else if isError}
  <p class="Error">
    <strong>
      There was an error submitting your enquiry. Please email me at the address
      above.
    </strong>
  </p>
{:else}
  <form method="post" action="/contact/" on:submit={onSubmit}>
    <p>Email me above or use the form below:</p>
    <ul class="Form">
      <li>
        <label class="Cursive" for="contact-name">Name</label>
        <input
          required
          type="text"
          class="Field"
          id="contact-name"
          name="name"
          maxlength="100"
          disabled={!isLive} />
      </li>
      <li>
        <label class="Cursive" for="contact-email">Email Address</label>
        <input
          required
          type="email"
          class="Field"
          id="contact-email"
          name="replyTo"
          placeholder="me@example.com…"
          maxlength="200"
          disabled={!isLive} />
      </li>
      <li>
        <label class="Cursive" for="contact-enquiry">Enquiry</label>
        <textarea
          required
          class="Field"
          id="contact-enquiry"
          name="enquiry"
          rows="5"
          maxlength="10000"
          placeholder="Tell me about your project&hellip;"
          disabled={!isLive} />
      </li>
      <li>
        <h4 class="Privacy">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewbox="0 0 24 24">
            <path
              d="M14 9v2h-4V9c0-1.104.897-2 2-2s2 .896 2 2zm10 3c0 6.627-5.373
              12-12 12S0 18.627 0 12 5.373 0 12 0s12 5.373 12 12zm-8-1h-1V9a3 3
              0 0 0-6 0v2H8v6h8v-6z" />
          </svg>
          <span>Your data and privacy</span>
        </h4>
        <p>
          <small>
            This form securely emails your data to my encrypted inbox for the
            purpose of responding to your enquiry and conducting business with
            you.
          </small>
        </p>
        <p>
          <small>
            See my
            <a href="/privacy/" target="_blank">Privacy Policy</a>
            for more information.
          </small>
        </p>
        <label for="contact-privacy">
          <input
            bind:this={consentRef}
            required
            type="checkbox"
            class="Hidden | Checkbox"
            id="contact-privacy"
            name="privacy"
            autocomplete="off"
            disabled={!isLive} />
          <span>I consent to my data being used as outlined above</span>
        </label>
      </li>
      <li>
        <button class="Button" type="submit" disabled={!isLive}>
          Send Message
        </button>
      </li>
      <li class="Hidden">
        <label for="contact-human">
          If you’re human leave the next field blank!
        </label>
        <input
          bind:this={robotRef}
          type="text"
          id="contact-human"
          name="whodis"
          tabindex="-1"
          autocomplete="off" />
      </li>
    </ul>
  </form>
{/if}
