(function () {
  let itemObjArray = [];
  let listName = "";
  let todoItemForm = createTodoItemForm();
  let todoList = createTodoList();
  let isEdit = false;
  let editItemObj = {};

  // Создаем и возващаем модальное окно
  function createModalWindow(title = "Modal title", text = "Modal message") {
    const modal = document.createElement("div");
    const modalDialog = document.createElement("div");
    const modalContent = document.createElement("div");
    const modalHeader = document.createElement("div");
    const modalTitle = document.createElement("h5");
    const buttonClose = document.createElement("button");
    const buttonCloseSpan = document.createElement("span");
    const modalBody = document.createElement("div");
    const modalTextMesage = document.createElement("p");
    const modalFooter = document.createElement("div");
    const buttonYes = document.createElement("button");
    const buttonNo = document.createElement("button");
    modal.classList.add("modal", "fade");
    modal.setAttribute("tabIndex", "-1");
    modalDialog.classList.add("modal-dialog");
    modalContent.classList.add("modal-content");
    modalHeader.classList.add("modal-header");
    modalTitle.classList.add("modal-title");
    buttonClose.classList.add("close");
    buttonClose.setAttribute("data-dismiss", "modal");
    buttonClose.type = "button";
    buttonClose.setAttribute("aria-label", "Close");
    buttonCloseSpan.setAttribute("aria-hidden", "true");
    buttonCloseSpan.innerHTML = "&times;";
    modalBody.classList.add("modal-body");
    modalTextMesage.classList.add("modal-text");
    modalFooter.classList.add("modal-footer");
    buttonYes.classList.add("btn", "btn-success");
    buttonYes.type = "button";
    buttonNo.classList.add("btn", "btn-danger");
    buttonNo.type = "button";
    modalTitle.textContent = title;
    modalTextMesage.textContent = text;
    buttonYes.textContent = "Да";
    buttonNo.textContent = "Нет";

    modal.append(modalDialog);
    modalDialog.append(modalContent);
    modalContent.append(modalHeader);
    modalHeader.append(modalTitle);
    modalHeader.append(buttonClose);
    buttonClose.append(buttonCloseSpan);
    modalContent.append(modalBody);
    modalBody.append(modalTextMesage);
    modalContent.append(modalFooter);
    modalFooter.append(buttonYes);
    modalFooter.append(buttonNo);

    return { modal, buttonClose, buttonYes, buttonNo };
  }

  // Создаем и возвращаем заголовок приложения
  function createAppTitle(title) {
    let appTitle = document.createElement("h2");
    appTitle.innerHTML = title;
    return appTitle;
  }

  // создаем и возвращаем форму для создания дела

  function createTodoItemForm() {
    let form = document.createElement("form");
    let input = document.createElement("input");
    let buttonWrapper = document.createElement("div");
    let button = document.createElement("button");

    form.classList.add("input-group", "mb-3", "form");
    input.classList.add("form-control");
    input.placeholder = "Введите название нового дела";
    buttonWrapper.classList.add("input-group-append");
    button.classList.add("btn", "btn-primary");
    button.textContent = "Добавить дело";
    // Состояние кнопки по умолчанию пи пустом поле ввода - disabled
    button.disabled = true;

    input.addEventListener("input", function () {
      if (input.value.trim() === "") {
        button.disabled = true;
      } else button.disabled = false;
    });

    buttonWrapper.append(button);
    form.append(input, buttonWrapper);

    return { form, input, button };
  }

  // создаем и возвращаем список элементов

  function createTodoList() {
    let list = document.createElement("ul");
    list.classList.add("list-group", "items-list");
    return list;
  }

  function createTodoItem(itemObj) {
    let { id, name, done } = itemObj;

    let item = document.createElement("li");
    let itemInnerText = document.createElement("span");
    // кнопки помещаем в элемент, который касиво их отобазит в одной группе
    let buttonGroup = document.createElement("div");
    let doneButton = document.createElement("button");
    let deleteButton = document.createElement("button");
    let editButton = document.createElement("button");

    // устанавливаем стили для элемента списка, а также для размещения кнопок
    // в его правой части с помощью flex
    item.classList.add(
      "list-group-item",
      "d-flex",
      "justify-content-between",
      "align-items-center"
    );
    itemInnerText.classList.add("item-todo-text");

    if (done) {
      item.classList.add("list-group-item-success", "done");
    }
    itemInnerText.textContent = name;

    buttonGroup.classList.add("btn-group", "btn-group-sm");
    doneButton.classList.add("btn", "btn-success");
    doneButton.textContent = "Готово";
    editButton.classList.add("btn", "btn-warning");
    editButton.textContent = "Редактировать";
    deleteButton.classList.add("btn", "btn-danger");
    deleteButton.textContent = "Удалить";

    //вкладваем кнопки в отдельнй элемент, чтобы они объединились в один блок
    buttonGroup.append(doneButton);
    buttonGroup.append(editButton);
    buttonGroup.append(deleteButton);

    item.append(itemInnerText);
    item.append(buttonGroup);

    item.addEventListener("click", function (e) {
      switch (e.target) {
        case doneButton: {
          doneItem(item, itemObj);
          break;
        }
        case deleteButton: {
          deleteItem(item, itemObj);
          break;
        }
        case editButton: {
          editItemObj = itemObj;
          editItem(item, itemObj);
          break;
        }
      }
    });

    // приложению нужен доспут к самому элементу и кнопкам, чтобы обрабатывать события

    return { item, doneButton, deleteButton, editButton };
  }

  // Написать функцию, которая будет искать максимальный id в массиве дел и прибавлять к максимальному id число 1.
  function itemId(itemObjArray) {
    let maxId = 0;
    for (item of itemObjArray) {
      maxId = Math.max(maxId, item.id);
    }
    return ++maxId;
  }

  function showModalWindow() {
    let { modal, buttonClose, buttonYes, buttonNo } = createModalWindow(
      "Внимание!",
      "Вы действительно хотите удалить дело?"
    );
    modal.classList.add("show");
    document.body.append(modal);

    buttonYes.addEventListener("click", function () {
      deleteItem(item, itemObj);
      modal.remove();
    });

    buttonNo.addEventListener("click", function () {
      modal.remove();
    });

    buttonClose.addEventListener("click", function () {
      modal.remove();
    });
  }

  function doneItem(item, itemObj) {
    setTimeout(() => item.classList.toggle("list-group-item-success"), 300);
    // item.classList.toggle("done");
    itemObj.done = !itemObj.done;
    let i = itemObjArray.findIndex((item) => item.id === itemObj.id);
    itemObjArray[i] = itemObj;
    saveData(listName, itemObjArray);
  }

  function deleteItem(item, itemObj) {
    let { modal, buttonClose, buttonYes, buttonNo } = createModalWindow(
      "Внимание!",
      "Вы действительно хотите удалить дело?"
    );
    modal.style.display = "block";
    setTimeout(() => modal.classList.add("show"), 300);
    modal.style.backgroundColor = "rgba(0,0,0,0.5)";
    modal.setAttribute("aria-modal", "true");
    document.body.classList.add("modal-open");
    document.body.append(modal);

    buttonYes.addEventListener("click", function () {
      item.remove();
      let i = itemObjArray.findIndex((item) => item.id === itemObj.id);
      itemObjArray.splice(i, 1);
      saveData(listName, itemObjArray);
      document.body.classList.remove("modal-open");
      modal.remove();
    });

    buttonNo.addEventListener("click", function () {
      document.body.classList.remove("modal-open");
      modal.remove();
    });

    buttonClose.addEventListener("click", function () {
      document.body.classList.remove("modal-open");
      modal.remove();
    });

    // if (!confirm("Вы уверены?")) {
    //   return;
    // }
  }

  function editItem(item, itemObj) {
    editItemObj = itemObj;
    isEdit = true;
    todoItemForm.input.value = item.firstChild.textContent;
    todoItemForm.button.textContent = "Сохранить";
  }

  function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  function loadData(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
  }

  function clearTodoList(list) {
    list.remove();
    list.innerHTML = "";
  }

  function setDefaultFormParameters() {
    todoItemForm.input.value = "";
    todoItemForm.button.textContent = "Добавить дело";
    todoItemForm.button.disabled = true;
  }

  function displayTodoList(container) {
    for (item of itemObjArray) {
      let todoItem = createTodoItem(item);
      todoList.append(todoItem.item);
      container.append(todoList);
    }
  }

  function createTodoApp(container, title = "Список дел", keyName = "todo") {
    listName = keyName;
    let todoAppTitle = createAppTitle(title);
    // todoItemForm = createTodoItemForm();
    // let todoList = createTodoList();
    let done = false;
    itemObjArray = loadData(listName);

    container.append(todoAppTitle);
    container.append(todoItemForm.form);
    container.append(todoList);

    if (itemObjArray.length > 0) {
      displayTodoList(container);
    }

    // браузер создает собыытие "submit" на форме по нажатию на Enter или на кнопку создания дела
    todoItemForm.form.addEventListener("submit", function (e) {
      // эта строка необходима, чтобы предотвратить стандартные действия браузера
      // в данном случае, мы не хотим, чтобы страница перегружалась при отправке фомы
      e.preventDefault();
      // Игноируем создание элемента, если Пользователь ничего не ввел в поле для ввода

      if (!todoItemForm.input.value.trim()) {
        setDefaultFormParameters();
        return;
      }

      if (isEdit) {
        // получаем новое значение из поля ввода и записыываем его в объект
        editItemObj.name = todoItemForm.input.value.trim();
        // находим этот элемент в массиве и заменяем его на измененный
        let i = itemObjArray.findIndex((index) => index.id === editItemObj.id);
        itemObjArray[i] = editItemObj;
        saveData(listName, itemObjArray);
        // очищаем старый список дел
        clearTodoList(todoList);
        // отображаем новый список дел
        displayTodoList(container);

        isEdit = false;
        setDefaultFormParameters();
        return;
      }

      // создаем элемент списка из объекта, который сотоит из value поля ввода и done = true или false (default)
      let itemObj = {
        id: itemId(itemObjArray),
        name: todoItemForm.input.value.trim(),
        done: done,
      };
      itemObjArray.push(itemObj);

      let todoItem = createTodoItem(itemObj);
      // добавляем в список новое дело из поля для ввода
      todoList.append(todoItem.item);
      // сохраняем список в localStorage
      saveData(listName, itemObjArray);

      // обнуляем поле ввода и кнопку делаем disable
      setDefaultFormParameters();
    });
  }

  window.createTodoApp = createTodoApp;
})();
