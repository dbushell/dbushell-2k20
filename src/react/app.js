import React from 'react';
import ReactDOM from 'react-dom';
import Logo from './components/logo.jsx';
import ContactForm from './components/contact-form.jsx';

const $doc = document.querySelector('.Document');

const $mode = document.querySelector('.Lightbulb');
$mode.addEventListener('click', () => {
  const list = $doc.classList;
  if (list.contains('Lightmode')) {
    list.remove('Lightmode');
    list.add('Darkmode');
    localStorage.setItem('darkmode', 'on');
  } else {
    list.remove('Darkmode');
    list.add('Lightmode');
    localStorage.setItem('darkmode', 'off');
  }
});

const $logo = document.querySelector('#logo');
if ($logo) {
  ReactDOM.hydrate(<Logo />, $logo);
}

const $form = document.querySelector('#contact-form');
if ($form) {
  ReactDOM.hydrate(<ContactForm />, $form);
}

if ('fonts' in document && document.querySelector('pre')) {
  const $prism = document.createElement('link');
  $prism.rel = 'stylesheet';
  $prism.href = '/assets/css/prism.css';
  document.head.appendChild($prism);
  var fira = new FontFace(
    'Fira Code',
    "url('/assets/fonts/firacode-variable.woff2') format('woff2')",
    {weight: '1 900'}
  );
  Promise.all([fira.load()]).then((fonts) => {
    fonts.forEach((font) => {
      document.fonts.add(font);
    });
  });
}

if ('serviceWorker' in window.navigator) {
  window.navigator.serviceWorker.register('/sw.js');
}
