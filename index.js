const itemsData = [
  "Сделать проектную работу",
  "Полить цветы",
  "Пройти туториал по Реакту",
  "Сделать фронт для своего проекта",
  "Прогуляться по улице в солнечный день",
  "Помыть посуду",
];

//получение dom элементов
const container = document.querySelector(".to-do__list"); // Контейнер для задач
const formContainer = document.querySelector(".to-do__form"); //Форма дляновых задач
const textField = document.querySelector(".to-do__input"); // Поле ввода

//получение сохранение данных 
const retrieveStoredItems = () => {
  const stored = localStorage.getItem('tasks'); // получаем данные 
  return stored ? JSON.parse(stored) : itemsData; // Если данные есть парсим елси нет то берем начальный массив
}

//создание элемента задачи
const generateTaskElement = (taskContent) => {
  const source = document.getElementById("to-do__item-template"); 
  const newElement = source.content.querySelector(".to-do__item").cloneNode(true); 
  const contentArea = newElement.querySelector(".to-do__item-text");
  const removeBtn = newElement.querySelector(".to-do__item-button_type_delete"); 
  const copyBtn = newElement.querySelector(".to-do__item-button_type_duplicate");
  const modifyBtn = newElement.querySelector(".to-do__item-button_type_edit"); 
  
  contentArea.textContent = taskContent; // Устанавливаем переданный текст в элемент
  
  
  //удаляем элемент из DOM и обновляет данные в localStorage
  removeBtn.addEventListener('click', () => {
    newElement.remove(); 
    const currentTasks = extractTasksFromPage(); //достаем список с сацта 
    storeTasks(currentTasks); // сохраняем список
  });
  
  // Создает копию текущей задачи и добавляет ее в начало списка
  copyBtn.addEventListener('click', () => {
    const taskText = contentArea.textContent; // Получаем текст текущей задачи
    const copiedElement = generateTaskElement(taskText); // Создаем новый элемент с тем же текстом
    container.prepend(copiedElement); // Добавляем копию в начало списка
    const currentTasks = extractTasksFromPage(); // Получаем обновленный список задач
    storeTasks(currentTasks); // Сохраняем изменения в localStorage
  });
  
  // Включает режим редактирования текста задачи
  modifyBtn.addEventListener('click', () => {
    contentArea.setAttribute('contenteditable', 'true'); // Делаем элемент редактируемым
    contentArea.focus(); // Устанавливаем курсор в элемент для немедленного редактирования
  });
  

  // Сохраняет изменения после редактирования текста задачи
  contentArea.addEventListener('blur', () => {
    if (contentArea.getAttribute('contenteditable') === 'true') { // Проверяем, был ли элемент в режиме редактирования
      contentArea.setAttribute('contenteditable', 'false'); // Отключаем режим редактирования
      const currentTasks = extractTasksFromPage(); // Получаем обновленный список задач
      storeTasks(currentTasks); // Сохраняем изменения в localStorage
    }
  });

  return newElement; // Возвращаем готовый элемент задачи
}


// Собирает все тексты задач с текущей страницы в массив
// Используется для синхронизации данных между DOM и localStorage
const extractTasksFromPage = () => {
  const taskElements = document.querySelectorAll('.to-do__item-text'); // Находим все элементы с текстами задач
  const result = []; // Создаем пустой массив для результатов
  taskElements.forEach(element => { // Перебираем каждый найденный элемент
    result.push(element.textContent); // Добавляем текст задачи в массив
  });
  return result; // Возвращаем массив со всеми текстами задач
}

// Сохраняет массив задач в localStorage браузера
// Позволяет сохранять состояние приложения между сессиями
const storeTasks = (taskArray) => {
  localStorage.setItem('tasks', JSON.stringify(taskArray)); // Преобразуем массив в JSON-строку и сохраняем
}

// Запускает приложение при загрузке страницы
// Загружает сохраненные задачи или начальные данные и отображает их
let currentItems = retrieveStoredItems(); // Получаем начальный список задач

currentItems.forEach(task => { // Для каждой задачи в списке
  const taskElement = generateTaskElement(task); // Создаем HTML-элемент
  container.append(taskElement); // Добавляем элемент в конец контейнера списка
});


// Обрабатывает отправку формы для добавления новой задачи
// Включает валидацию и очистку поля ввода
formContainer.addEventListener('submit', function (evt) {
  evt.preventDefault(); // Предотвращаем стандартное поведение формы
  const outputText = textField.value.trim(); // Получаем текст из поля ввода и удаляем лишние пробелы
  
  if(outputText){ // Проверяем, что введен непустой текст 
    const itemElements = generateTaskElement(outputText); // Создаем новый элемент задачи
    container.prepend(itemElements); // Добавляем новую задачу в начало списка 
    currentItems = extractTasksFromPage(); // Получаем обновленный список всех задач
    storeTasks(currentItems); // Сохраняем изменения в localStorage
    textField.value = ''; // Очищаем поле ввода для следующей задачи
  } 
});