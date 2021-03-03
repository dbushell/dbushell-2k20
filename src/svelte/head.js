const $doc = document.documentElement;
$doc.classList.remove('Noscript');
const darkmode = localStorage.getItem('darkmode');
if (darkmode === 'on') {
  $doc.classList.remove('Lightmode');
  $doc.classList.add('Darkmode');
}
