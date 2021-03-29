export const hideLoader = () => {
  const el = document.querySelector('.loader');
  if (el) el.parentElement.removeChild(el);
};

export const showLoader = () => {
  hideLoader();
  const markup = `
    <div class="loader">
        <div class="lds-roller">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
     </div>`;
  document.querySelector('.container').insertAdjacentHTML('afterbegin', markup);
};
