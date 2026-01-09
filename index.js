const itemsData = [
	"Сделать проектную работу",
	"Полить цветы",
	"Пройти туториал по Реакту",
	"Сделать фронт для своего проекта",
	"Прогуляться по улице в солнечный день",
	"Помыть посуду",
];

const container = document.querySelector(".to-do__list");
const formContainer = document.querySelector(".to-do__form");
const textField = document.querySelector(".to-do__input");

const retrieveStoredItems = () => {
  const stored = localStorage.getItem('tasks');
  return stored ? JSON.parse(stored) : itemsData;
}

const generateTaskElement = (taskContent) => {
	const source = document.getElementById("to-do__item-template");
	const newElement = source.content.querySelector(".to-do__item").cloneNode(true);
  const contentArea = newElement.querySelector(".to-do__item-text");
  const removeBtn = newElement.querySelector(".to-do__item-button_type_delete");
  const copyBtn = newElement.querySelector(".to-do__item-button_type_duplicate");
  const modifyBtn = newElement.querySelector(".to-do__item-button_type_edit");
  
  contentArea.textContent = taskContent;
  
  removeBtn.addEventListener('click', () => {
    newElement.remove();
    const currentTasks = extractTasksFromPage();
    storeTasks(currentTasks);
  });
  
  copyBtn.addEventListener('click', () => {
    const taskText = contentArea.textContent;
    const copiedElement = generateTaskElement(taskText);
    container.prepend(copiedElement);
    const currentTasks = extractTasksFromPage();
    storeTasks(currentTasks);
  });
  
  modifyBtn.addEventListener('click', () => {
    contentArea.setAttribute('contenteditable', 'true');
    contentArea.focus();
  });
  
  contentArea.addEventListener('blur', () => {
    if (contentArea.getAttribute('contenteditable') === 'true') {
      contentArea.setAttribute('contenteditable', 'false');
      const currentTasks = extractTasksFromPage();
      storeTasks(currentTasks);
    }
  });

  return newElement;
}

const extractTasksFromPage = () => {
  const taskElements = document.querySelectorAll('.to-do__item-text');
  const result = [];
  taskElements.forEach(element => {
    result.push(element.textContent);
  });
  return result;
}

const storeTasks = (taskArray) => {
  localStorage.setItem('tasks', JSON.stringify(taskArray));
}

let currentItems = retrieveStoredItems();

currentItems.forEach(task => {
  const taskElement = generateTaskElement(task);
  container.append(taskElement);
});

formContainer.addEventListener('submit', event => {
  event.preventDefault();
  const userInput = textField.value;
  const newTaskElement = generateTaskElement(userInput);
  container.prepend(newTaskElement);
  currentItems = extractTasksFromPage();
  storeTasks(currentItems);
  textField.value = '';
});

