const list = document.querySelector('.list');
const input = document.querySelector('.input');

/* Получаем данные из локального хранилища */

const getListStorage = () => {

	const listStorage = JSON.parse(localStorage.getItem('tasks'));

	for (let task of listStorage) {
		const item = document.createElement('li');
		const classes = task.done ? 'task done' : 'task';
		const checked = task.done ? 'checked' : '';

		item.innerHTML = `
			<div class="text-item">
				<input type="checkbox" onclick="checkDone(this)" ${checked}>
				<p class="${classes}" onclick="editTask(this)">${task.value}</p>
			</div>
			<div class="btn">
				<button onclick="deleteItem(this)">Delete</button>
			</div>
		`;
		list.appendChild(item);
	}
	
}

getListStorage();

/* Отправляем данные в локальное хранилище */

const setListStorage = () => {

	const tasksProp = [];
	const tasks = document.querySelectorAll('.task');

	for (let task of tasks) {

		if (/done/.test(task.classList)) {
			tasksProp.push({
				value: task.innerHTML,
				done: true,
			});
		} else {
			tasksProp.push({
				value: task.innerHTML,
				done: false,
			});
		}
		
	}

	localStorage.setItem('tasks', JSON.stringify(tasksProp));
}

/* Добавляем пункт в список */

const addTask = ({ key, target }) => {

	if (key === 'Enter' && target.value !== '') {

		const item = document.createElement('li');

		item.innerHTML = `
			<div class="text-item">
				<input type="checkbox" onclick="checkDone(this)">
				<p class="task" onclick="editTask(this)">${target.value}</p>
			</div>
			<div class="btn">
				<button onclick="deleteItem(this)">Delete</button>
			</div>
		`;

		list.prepend(item);
		target.value = '';

		setListStorage();
	}
	
}

input.addEventListener('keypress', addTask);

/* Отмечаем Done */

const checkDone = (checkbox) => {

	const par = checkbox.nextElementSibling;

	if (checkbox.checked) {
		par.classList.add('done');
	} else {
		par.classList.remove('done');
	}

	setListStorage();
}

/* Удаляем пункт из списка */

const deleteItem = (deleteButton) => {

	deleteButton.closest('li').remove();
	setListStorage();
}

/* Начало редактирования пункта, вставляем инпут для редактирования */

const editTask = (text) => {

	text.style.display = 'none';

	const inputItem = document.createElement('input');
	inputItem.type = 'text';
	inputItem.autofocus = true;
	inputItem.classList.add('input-item');
	inputItem.value = text.innerHTML;
	inputItem.addEventListener('keydown', submitChanges);

	const parent = text.closest('.text-item');
	parent.appendChild(inputItem);
}

/* Подтверждаем или отменяем изменения */

const submitChanges = ({ key, target }) => {

	const par = target.previousElementSibling;
	const parent = target.closest('.text-item');

	if (key === 'Enter') {

		par.innerHTML = target.value;
		par.style.display = 'inline';
		target.remove();
		setListStorage();

	} else if (key === 'Escape') {

		par.style.display = 'inline';
		target.remove();
	}
}
