import React, {useCallback, useEffect, useRef, useState} from 'react';

const awsHandler =
  'https://6rovexooub.execute-api.eu-west-1.amazonaws.com/production/contact';

const Success = () => (
  <p>
    <strong>Thank you for your enquiry, I’ll reply as soon as possible.</strong>
  </p>
);

const Error = () => (
  <p className="Error">
    <strong>
      There was an error submitting your enquiry. Please email me at the address
      above.
    </strong>
  </p>
);

const ContactForm = () => {
  const [isLive, setLive] = useState(false);
  const [isSuccess, setSuccess] = useState(false);
  const [isError, setError] = useState(false);

  const consentRef = useRef();
  const robotRef = useRef();

  const onLoad = useCallback(() => {
    setLive(true);
  }, []);

  const onSubmit = useCallback((ev) => {
    ev.preventDefault();
    if (consentRef.current.checked !== true) {
      return;
    }
    if (robotRef.current.value !== '') {
      return setError(true);
    }
    setLive(false);
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
        setSuccess(true);
      } else {
        setError(true);
      }
    });
    xhr.send(data);
  }, []);

  useEffect(() => {
    onLoad();
  }, [onLoad]);

  if (isSuccess) {
    return <Success />;
  }

  if (isError) {
    return <Error />;
  }

  const Policy = () => (
    <a href="/privacy/" target="_blank">
      Privacy Policy
    </a>
  );

  return (
    <form method="post" action="/contact/" onSubmit={onSubmit}>
      <p>Email me above or use the form below:</p>
      <ul className="Form">
        <li>
          <label className="Cursive" htmlFor="contact-name">
            Name
          </label>
          <input
            required
            type="text"
            className="Field"
            id="contact-name"
            name="name"
            maxLength="100"
            disabled={!isLive}
          />
        </li>
        <li>
          <label className="Cursive" htmlFor="contact-email">
            Email Address
          </label>
          <input
            required
            type="email"
            className="Field"
            id="contact-email"
            name="replyTo"
            placeholder="me@example.com…"
            maxLength="200"
            disabled={!isLive}
          />
        </li>
        <li>
          <label className="Cursive" htmlFor="contact-enquiry">
            Enquiry
          </label>
          <textarea
            required
            className="Field"
            id="contact-enquiry"
            name="enquiry"
            rows="5"
            maxLength="10000"
            placeholder="Tell me about your project&hellip;"
            disabled={!isLive}
          ></textarea>
        </li>
        <li>
          <h4 className="Privacy">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path d="M14 9v2h-4V9c0-1.104.897-2 2-2s2 .896 2 2zm10 3c0 6.627-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0s12 5.373 12 12zm-8-1h-1V9a3 3 0 0 0-6 0v2H8v6h8v-6z"></path>
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
              See my <Policy /> for more information.
            </small>
          </p>
          <label htmlFor="contact-privacy">
            <input
              ref={consentRef}
              required
              type="checkbox"
              className="Hidden | Checkbox"
              id="contact-privacy"
              name="privacy"
              autoComplete="off"
              disabled={!isLive}
            />
            <span>I consent to my data being used as outlined above</span>
          </label>
        </li>
        <li>
          <button className="Button" type="submit" disabled={!isLive}>
            Send Message
          </button>
        </li>
        <li className="Hidden">
          <label htmlFor="contact-human">
            If you’re human leave the next field blank!
          </label>
          <input
            ref={robotRef}
            type="text"
            id="contact-human"
            name="whodis"
            tabIndex="-1"
            autoComplete="off"
          />
        </li>
      </ul>
    </form>
  );
};

export default ContactForm;
