import React from 'react';
import ReactDOM from 'react-dom';
import Logo from './components/logo';
import ContactForm from './components/contact-form';

const $doc = document.querySelector('.Document');

const $mode = document.querySelector('.Lightbulb');
$mode.addEventListener('click', () => {
  if ($doc.classList.contains('Lightmode')) {
    $doc.className = $doc.className.replace(/[\w]+mode/, 'Darkmode');
    localStorage.setItem('darkmode', 'on');
  } else {
    $doc.className = $doc.className.replace(/[\w]+mode/, 'Lightmode');
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

// if ('serviceWorker' in window.navigator) {
//   window.navigator.serviceWorker.register('/sw.js');
// }
