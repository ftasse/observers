export const filter = filterStr => {
  location.assign(`/?${filterStr}#topics`);
};
