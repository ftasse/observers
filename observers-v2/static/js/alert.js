export const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
};

export const showAlert = (type, msg) => {
  hideAlert();
  const iconRefs = {
    success: 'checkmark',
    failed: 'cancel',
    warning: 'notice'
  };
  const markup = `
    <div class="alert alert--${type}">
        <svg class="alert__icon">
            <use xlink:href="img/sprite.svg#icon-${iconRefs[type]}"></use>
        </svg>
        <p class="alert__message">${msg}</p>
    </div>`;
  document.querySelector('.container').insertAdjacentHTML('afterbegin', markup);

  window.setTimeout(hideAlert, 10000);
};
