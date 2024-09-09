// fix: sidebar not clickable
function removeAppRegion() {
  const allElements = document.querySelectorAll('*');

  for (let element of allElements) {
    const style = window.getComputedStyle(element);
    if (style.webkitAppRegion === 'drag' || style.webkitAppRegion === 'no-drag') {
      element.style.webkitAppRegion = 'initial';
      // console.log('Removed -webkit-app-region from:', element);
    }
  }
}

setTimeout(removeAppRegion, 1000);
window.NoiUtils?.changeURL?.('noi@reset:drag', () => setTimeout(removeAppRegion, 1000));
