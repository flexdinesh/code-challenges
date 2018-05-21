const specificity = (selector) => {
  let specificity = [0, 0, 0, 0, 0],
    idx,
    matches,
    tmp = 0,
    selectors = selector.split(/\s*,\s*/);

  if (selector === '*') return specificity;

  for (idx in selectors) {
    matches = selectors[idx].match(/#/g);
    if (matches) specificity[1] += matches.length;
    matches = selectors[idx].match(/\./g);
    if (matches) specificity[2] += matches.length;
    matches = selectors[idx].match(/\[.+\]/g);
    if (matches) specificity[2] += matches.length;
    matches = selectors[idx].match(
      /:(?:first-letter|first-line|before|after|:selection)/g
    );
    if (matches) {
      tmp = matches.length;
      specificity[3] += tmp;
    }
    tmp = 0;
    matches = selectors[idx].match(/[+>~]/g);
    if (matches) specificity[4] += matches.length;
    selectors[idx] = selectors[idx]
      .replace(/\(.*?\)/g, '')
      .replace(/\[.*?\]/g, '')
      .replace(/[.#:][^ +>~]*/gi, '');
    matches = selectors[idx].match(/[^ +>~]+/g);
    if (matches) specificity[3] += matches.length;
  }

  return specificity;
};

const arraySum = (arr) => {
  let total = 0;
  for (let i in arr) {
    total += arr[i];
  }
  return total;
};

const compare = (a, b) => {
  const specA = specificity(a);
  const specB = specificity(b);
  const totalA = arraySum(specA);
  const totalB = arraySum(specB);
  for (let i = 0; i < 5; i++) {
    if (specA[i] > specB[i]) return a;
    else if (specA[i] < specB[i]) return b;
  }
  return b;
};
