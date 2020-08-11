const selectCategoryCreateTopicForm = new Choices(
  '#select-category-create-topic-form'
);
const selectTagsCreateTopicForm = new Choices(
  '#select-tags-create-topic-form',
  {
    delimiter: ',',
    editItems: true,
    duplicateItemsAllowed: false,
    maxItemCount: 5,
    placeholderValue: 'add tag',
    removeItemButton: true,
    maxItemText: function(maxItemCount) {
      return String(maxItemCount) + ' tags can be defined at most';
    },
    uniqueItemText: 'This is tag has already been added'
  }
);

const selectMediaUrlsCreateTopicForm = new Choices(
  '#select-mediaUrls-create-topic-form',
  {
    delimiter: ',',
    editItems: true,
    addItemFilter: function(value) {
      if (!value) {
        return false;
      }

      const regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;
      const expression = new RegExp(regex.source, 'i');
      return expression.test(value);
    },
    customAddItemText: 'Only valid links are allowed.',
    duplicateItemsAllowed: false,
    maxItemCount: 5,
    placeholderValue: 'add source',
    removeItemButton: true,
    maxItemText: function(maxItemCount) {
      return String(maxItemCount) + ' sources can be defined at most';
    },
    uniqueItemText: 'This source has already been provided'
  }
);
