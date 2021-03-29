import { showLoader } from './loader';

export const searchTopics = (form, pat) => {
  form.addEventListener('submit', e => {
    e.preventDefault();
    showLoader();
    location.assign(`/?search=${encodeURIComponent(pat.value.trim())}`);
  });
};
