(function() {

    // Сохраняем список в localStorage 
    let ListArray = [],
    ListName = 'list';



    // Создаём и возвращаем заголовок приложения
    function createAppTitle(title) {
        let appTitle = document.createElement('h2');
        appTitle.innerHTML = title;
        return appTitle;
    }

    // Создаём и возвращаем форму для создания дела
    function createTodoItemForm() {
        let form = document.createElement('form');
        let input = document.createElement('input');
        let buttonWrapper = document.createElement('div');
        let button = document.createElement('button');

        form.classList.add('input-group', 'mb-3');
        input.classList.add('form-control');
        input.placeholder = 'Введите название нового дела';
        buttonWrapper.classList.add('input-group-append');
        button.classList.add('btn', 'btn-primary');
        button.textContent = 'Добавить дело';
        button.disabled = true;


        buttonWrapper.append(button);
        form.append(input);
        form.append(buttonWrapper);

        // Блокируем кнопку при нулевом значении в инпуте
        input.addEventListener('input', function() {
            if (input.value.trim() !== '') {   // Удалили пробелы через trim
                button.disabled = false;
            } 
        });

        return {
            form,
            input,
            button,
        };
    }

    // Создаём и возвращаем список элементов
    function createTodoList() {
        let list = document.createElement('ul');
        list.classList.add('list-group');
        return list;
    }

    function createTodoItem(Obj) {
        let item = document.createElement('li');
        // Кнопки помещаем в элемент, который красиво покажет их в одной группе
        let buttonGroup = document.createElement('div');
        let doneButton = document.createElement('button');
        let deleteButton = document.createElement('button');

        // Устанавливаем стили для элемента сиписка, а так же для размещения кнопок
        // в его правой части с помощью flex
        item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        item.textContent = Obj.name;

        if (Obj.done == true) {
            item.classList.add('list-group-item-success');
        }

        buttonGroup.classList.add('btn-group', 'btn-group-sm');
        doneButton.classList.add('btn', 'btn-success');
        doneButton.textContent = 'Готово';
        deleteButton.classList.add('btn', 'btn-danger');
        deleteButton.textContent = 'Удалить';

        // Добавляем обработчики на кнопки
        doneButton.addEventListener ('click', function() {
            Obj.done = !Obj.done;
            item.classList.toggle('list-group-item-success');
            console.log(ListArray);
        });
        deleteButton.addEventListener('click', function() {
            if (confirm('Вы уверены?')) {
                for (let i = 0; i < ListArray.length; ++i) {
                    if (ListArray[i].id = Obj.id) {
                       ListArray.splice(i, 1);
                       break;
                    }
                }
                item.remove();
                SefList(ListArray, ListName);
                console.log(ListArray);
            }
        });


        // Вкладываем кнопки в отдельный элемент, чтобы они объединились в один блок
        buttonGroup.append(doneButton);
        buttonGroup.append(deleteButton);
        item.append(buttonGroup);

        // Приложению нужен доступ к самому элементу и кнопкам, чтобы обрабатывать события нажатия
        return {
            item,
            doneButton,
            deleteButton,
        };
    }

    // Вводим переменную для присвоения каждому делу своего уникального ID
    function newID (arr) {
        let max = 0;
        for (const item of arr) {
            if(item.id > max) {max = item.id}
        }
        return max + 1;
    }

    function createTodoApp(container, title = 'Список дел', myListName) {

        let todoAppTitle = createAppTitle(title);
        let todoItemForm = createTodoItemForm();
        let todoList = createTodoList();

        ListName = myListName;

        // Получаем данные из хранилища localStorage
        let listDATA = localStorage.getItem(ListName);
        if (listDATA !== '' && listDATA !== null) {
            ListArray = JSON.parse(listDATA)
        }
        for (const element of ListArray) {
            let todoItem = createTodoItem(element);
            todoList.append(todoItem.item);
        }  
        
        // Добавление списка 
        // let todoItems = [creatTodoItem('выпить кофе'), creatTodoItem('постирать')], 

        container.append(todoAppTitle);
        container.append(todoItemForm.form);
        container.append(todoList);


        // Браузер создаёт событие submit на форме по нажатию на Enter или на кнопку создания дела
        todoItemForm.form.addEventListener('submit', function(e) {
            // Эта строчка необходима, чтобы предотвратить стандартное действие браузера
            // В данном случае мы не хотим, чтобы страница перезагружалась при отправке формы
            e.preventDefault();

            // Игнорируем создание элемента, если пользователь ничего не ввел в поле
            if (!todoItemForm.input.value) {
                return;
            }

            // При добавлении дела выводим значение в массив
            let newObj = {
                id: newID(ListArray),
                name: todoItemForm.input.value,
                done: false,
            };
            ListArray.push(newObj)

            let todoItem = createTodoItem(newObj);

            // Создаём и добавляем в список новое дело с названием из поля для ввода
            todoList.append(todoItem.item);

            // Обнуляем значение в поле, чтобы не пришлось стирать его вручную
            todoItemForm.input.value = '';
            todoItemForm.button.disabled = true; // Возвращаем блокировку кнопки при пустом поле инпута
            
            SefList(ListArray, ListName);
            // Сохраняем дело при добавлении в хранилище (localStorage)
            console.log(ListArray);
        });
    }

    function SefList (arr, key) {
        localStorage.setItem(key, JSON.stringify(arr))
    }

    window.createTodoApp = createTodoApp;

})();


