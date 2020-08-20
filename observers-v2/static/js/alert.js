export const hideAlert = (cls = '.alert') => {
  const el = document.querySelector(`${cls}`);
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
            <use xlink:href="/img/sprite.svg#icon-${iconRefs[type]}"></use>
        </svg>
        <p class="alert__message">${msg}</p>
    </div>`;
  document.querySelector('.container').insertAdjacentHTML('afterbegin', markup);

  window.setTimeout(hideAlert, 10000);
};

export const showConfirm = (msg, callback) => {
  const markup = `
    <div class="confirm__container">
        <div class="confirm__box">
            <span class="confirm__close">&times;</span>
            <p class="confirm__message">${msg}</p>
            <div class="confirm__actions">
                <button class="btn confirm__btn--left btn--small btn__font--default btn-black" id="no-confirm">No</button>
                <button class="btn confirm__btn--right btn--smll btn__font--default btn-primary" id="yes-confirm">Yes</button>
            </div>
        </div>
    </div>
  `;
  const confirmEl = document.createElement('div');
  confirmEl.innerHTML = markup;

  document
    .querySelector('.container')
    .insertAdjacentElement('afterbegin', confirmEl);

  document.querySelector('.confirm__container').addEventListener('click', e => {
    hideAlert('.confirm__container');
  });
  document.querySelector('.confirm__box').addEventListener('click', e => {
    e.stopPropagation();
    console.log('cool');
  });
  document.querySelector('.confirm__btn--left').addEventListener('click', e => {
    e.stopPropagation();
    hideAlert('.confirm__container');
  });
  document.querySelector('.confirm__close').addEventListener('click', e => {
    e.stopPropagation();
    hideAlert('.confirm__container');
  });
  document
    .querySelector('.confirm__btn--right')
    .addEventListener('click', e => {
      e.stopPropagation();
      callback();
    });
};
