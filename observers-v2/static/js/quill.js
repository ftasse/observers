import Quill from 'quill';

export const createEditors = () => {
  const toolbarOptions = [
    [{ header: [4, false] }],

    ['bold', 'italic', 'underline', 'strike'], // toggled buttons
    ['link', 'blockquote'],

    [{ list: 'ordered' }, { list: 'bullet' }],

    ['clean'] // remove formatting button
  ];

  return new Quill('.editor', {
    modules: {
      toolbar: toolbarOptions
    },
    theme: 'snow',
    placeholder: 'Describe your topic in details...'
  });
};
