const submitTopic = () => {
  const topicDescription = document.querySelector('#topicDescription');
  const formMessage = document
    .querySelector('#topicDescriptionLabel')
    .querySelector('.form__message');
  topicDescription.value = editor.getText().trim();

  formMessage.style.fontStyle = 'italic';
  formMessage.style.fontSize = '1.2rem';

  if (topicDescription.value === '') {
    formMessage.innerText = 'please describe your topic';
  } else if (topicDescription.value.length < 120) {
    formMessage.innerText = 'description must have at least 120 characters';
  }
};
