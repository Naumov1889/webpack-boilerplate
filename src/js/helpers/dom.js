const removeInnerHtml = (elem) => {
  while (elem.firstChild) elem.removeChild(elem.firstChild);
};

export default removeInnerHtml;
