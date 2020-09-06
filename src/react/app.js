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

const $prism = document.createElement('link');
$prism.rel = 'stylesheet';
$prism.href = '/assets/css/prism.css';
document.head.appendChild($prism);

const $fira = document.createElement('link');
$fira.rel = 'stylesheet';
$fira.href =
  'https://fonts.googleapis.com/css2?family=Fira+Code:wght@300&display=swap';
document.head.appendChild($fira);

if ('serviceWorker' in window.navigator) {
  window.navigator.serviceWorker.register('/sw.js');
}
