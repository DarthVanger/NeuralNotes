// https://stackoverflow.com/questions/31305071/measuring-text-width-height-without-rendering
export function getTextWidth(txt, fontSize) {
  const element = document.createElement('canvas');
  const context = element.getContext('2d');
  const font = window
    .getComputedStyle(document.body)
    .getPropertyValue('font-family');

  context.font = `${fontSize}px ` + font;
  return context.measureText(txt).width;
}
