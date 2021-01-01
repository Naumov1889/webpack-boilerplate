function autosizeTextarea(el) {
  const elCur = el;
  setTimeout(() => {
    elCur.style.cssText = 'height:auto; padding:0';
    // for box-sizing other than "content-box" use:
    elCur.style.cssText = '-moz-box-sizing:content-box';
    elCur.style.cssText = `height:${elCur.scrollHeight}px`;
  }, 0);
}

export default autosizeTextarea;
