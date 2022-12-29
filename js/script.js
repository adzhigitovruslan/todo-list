const iconSun = document.querySelector('.todo__icon-day');
const iconNight = document.querySelector('.todo__icon-night');
const dayPic = document.querySelector('.page__background-day');
const nightPic = document.querySelector('.page__background-night');


document.querySelector('.todo__icon').addEventListener('click', changeIcon);

function changeIcon() {

	setTimeout(e=>{iconSun.classList.toggle("active")},1) ,
    setTimeout(e=>{iconNight.classList.toggle("active")},1);

	document.body.classList.toggle('active');
	dayPic.classList.toggle('active');
	nightPic.classList.toggle('active');

	if(document.body.classList.contains('active')){
		localStorage.setItem('theme', 'active')
		localStorage.setItem('iconNight', 'active')
	} else {
		localStorage.removeItem('theme');
		localStorage.removeItem('iconNight');
	}
}

const buttonsTabs = document.querySelectorAll('.todo__options-text');
let storedTab = localStorage.getItem('selectedTab') || '[]'
   let tabIndex = JSON.parse(storedTab)
   for(const index of tabIndex) {
	buttonsTabs[index].classList.add('active');
   }
buttonsTabs.forEach(function(item) {
	item.addEventListener('click', function() {
		buttonsTabs.forEach(function(item) {
			item.classList.remove('active');
		})
		item.classList.add('active');
	})
});

function saveSelectedTab() {
	const tabIndex = []
	for (let i = 0; i < buttonsTabs.length; i++) {
		if(buttonsTabs[i].classList.contains('active')){
			tabIndex.push(i);
		}
	}
	localStorage.setItem('selectedTab', JSON.stringify(tabIndex));
}


const todoButton = document.querySelector('#add-button');
const todoList = document.querySelector('.todo__list');
const todoInput = document.querySelector('.todo__input');
const filterOption = document.querySelectorAll('.todo__view-options');
const todoClear = document.querySelector('.todo__clear');
const todoListItem = document.querySelector('.todo__list-item');
const draggables = document.querySelector('.todo__list').childNodes;
const checkButtons = document.querySelector('.todo__list').children;
const modeButtons = document.querySelector('[class=todo__view-options]');


//event listeners
document.addEventListener('DOMContentLoaded', getItemsFromLocalStorage);
todoButton.addEventListener('click', createListElementByButton);
todoList.addEventListener('click', deleteElementsFromList);
todoList.addEventListener('click', changeCheckboxState);
todoClear.addEventListener('click', removeAllLocal);
window.onresize = clickOnActive;

filterOption.forEach(item => {
	item.addEventListener('click', filterTodo);
	item.addEventListener('click', saveSelectedTab)
})
//functions 

function createListElementByButton(event) {
	event.preventDefault();

	//todo DIV
	const listElements = document.createElement('li');
	listElements.classList.add('todo__item');
	listElements.setAttribute('draggable', 'true');

	//create input inside the label
	const inputCheck = document.createElement('input');
	inputCheck.classList.add('todo__checkbox');
	inputCheck.setAttribute('type', 'checkbox')
	inputCheck.setAttribute('id', todoInput.value);

	//Check mark label button
	const labelCheck = document.createElement('label');
	labelCheck.classList.add('todo__input-label');
	labelCheck.setAttribute('for', todoInput.value);

	//CREATE LABEL TEXT 
	const newTodo = document.createElement('label');
	newTodo.classList.add('todo__list-item');
	newTodo.setAttribute('for', todoInput.value);

	//Check trash button
	const trashButton = document.createElement('button');
	trashButton.innerHTML = '<i class="_icon-close"></i>';
	trashButton.classList.add('todo__close');

	const todoInputValue = todoInput.value;

	if(todoInputValue) {
		saveItemsToLocalStorageList(todoInputValue, inputCheck);
		newTodo.append(todoInputValue)
		listElements.append(inputCheck, labelCheck, newTodo, trashButton)
		todoList.appendChild(listElements);
		//Clear todo input value
		todoInput.value = '';
		dragAndDrop()
		checkAmounOfDiv()
	}
}

function getItemsFromLocalStorage() {
	getDarkMode()
	if(localStorage.getItem('item-left')) {
		document.querySelector('#items').textContent = JSON.parse(localStorage.getItem('item-left')) + ' ' + 'items left';
	} else {
		document.querySelector('#items').textContent = 0 + ' ' + 'items left';
	}
	

	const localStorageElements = JSON.parse(localStorage.getItem('listElements'));

	if(localStorageElements !== null) {
		localStorageElements.forEach(element => {
			const inputCheck = document.createElement('input');
			inputCheck.classList.add('todo__checkbox');
			inputCheck.setAttribute('type', 'checkbox')
			inputCheck.setAttribute('id', element.itemValue);

			if(element.inputCheckState) {
				inputCheck.setAttribute('checked', element.inputCheckState);
			}
			//todo DIV
			const listElements = document.createElement('li');
			listElements.classList.add('todo__item');
			listElements.setAttribute('draggable', 'true');

			//Check mark label button
			const labelCheck = document.createElement('label');
			labelCheck.classList.add('todo__input-label');
			labelCheck.setAttribute('for', element.itemValue);

			//CREATE LABEL TEXT 
			const newTodo = document.createElement('label');
			newTodo.classList.add('todo__list-item');
			newTodo.setAttribute('for', element.itemValue);
			
			//Check trash button
			const trashButton = document.createElement('button');
			trashButton.innerHTML = '<i class="_icon-close"></i>';
			trashButton.classList.add('todo__close');

			// saveItemsToLocalStorageList(todoInputValue, inputCheck);
			newTodo.append(element.itemValue)
			listElements.append(inputCheck, labelCheck, newTodo, trashButton)
			todoList.appendChild(listElements);
			//Clear todo input value
			todoInput.value = '';
			dragAndDrop()
		})
	}
	const allInputs = document.querySelectorAll('.todo__checkbox');
	allInputs.forEach(elem => {
		if(elem.checked) {
			elem.parentElement.classList.add('completed');
			} else {
			elem.parentElement.classList.remove('completed');
			}
	})
	if (localStorage.getItem('selectedTab') === null) {
        buttonControl[0].click();
    }
	clickOnActive()
};

function saveItemsToLocalStorageList(todoInputValue, inputCheck) {
	let listElements;

	if(localStorage.getItem('listElements') === null) {
		listElements = [];
	} else {
		listElements = JSON.parse(localStorage.getItem('listElements'))
	}

	listElements.push({itemValue: todoInputValue, inputCheckState: inputCheck.checked});

	localStorage.setItem('listElements', JSON.stringify(listElements));
}

function removeAllLocal() {
	let completItems = document.querySelectorAll('.todo__item.completed');
	completItems.forEach(item => {
		item.remove();
	})
	const listElements = JSON.parse(localStorage.getItem('listElements'));
	const result = listElements.filter(word => word.inputCheckState === false);
	localStorage.setItem('listElements', JSON.stringify(result));

}

function deleteElementsFromList(event) {
	const targetedElement = event.target;
	const itemLabel = targetedElement.parentElement.textContent;
	if(targetedElement.className === 'todo__close'){
		const listElements = JSON.parse(localStorage.getItem('listElements'));
		listElements.forEach(element => {
			if(element.itemValue === itemLabel){
				const itemIndex = listElements.indexOf(element);
				listElements.splice(itemIndex, 1);
				localStorage.setItem('listElements', JSON.stringify(listElements));
			}
		});
		targetedElement.parentElement.remove();
		const todo = targetedElement.parentElement;
		todo.classList.add('fall');
		todo.addEventListener('transitionend', function() {
			todo.remove();
		})
		checkAmounOfDiv();
	} else if(targetedElement.className === 'todo__input-label') {
		const todoItem = targetedElement.parentElement;
		todoItem.classList.toggle('completed');
		checkAmounOfDiv()
	}
	dragAndDrop()
}

function checkAmounOfDiv() {
	const itemCompleted = document.querySelectorAll('.todo__item.completed')
	const mathOperation = todoList.children.length - itemCompleted.length
	document.querySelector('#items').textContent = mathOperation + ' ' + 'items left';
	localStorage.setItem('item-left', JSON.stringify(mathOperation))
}

function changeCheckboxState(event) {
	if(event.target.type === 'checkbox'){
		const listElements = JSON.parse(localStorage.getItem('listElements'));

		listElements.forEach(element => {
			if(element.itemValue === event.target.id) {
				element.inputCheckState = element.inputCheckState === false ? true : false;
			}
		});
		localStorage.setItem('listElements', JSON.stringify(listElements));
	} 
}

function filterTodo(e) {
	const todos = Array.from(todoList.children);
	todos.forEach(function(todo) {
		switch (e.target.dataset.show){
			case 'all':
				todo.style.display = 'flex';
				break;
			case 'completed':
				if(todo.classList.contains('completed')){
					todo.style.display = 'flex';
				} else {
					todo.style.display = 'none';
				}
				break;
			case 'active':
				if(!todo.classList.contains('completed')){
					todo.style.display = 'flex';
				} else {
					todo.style.display = 'none';
				}
				break;
		}
		
	});
}

//drag n drop 
function dragAndDrop() {
	Array.from(draggables).forEach(draggable => {
		draggable.addEventListener('dragstart', () => {
			draggable.classList.add('dragging');
		})
		draggable.addEventListener('dragend', () => {
			draggable.classList.remove('dragging')
		})
	});
	todoList.addEventListener('dragover', e => {
		e.preventDefault()
		const afterElement = getDragAfterElement(todoList, e.clientY);
		const draggable = document.querySelector('.dragging')
		if(afterElement == null) {
			todoList.appendChild(draggable);
		} else {
			todoList.insertBefore(draggable, afterElement)
		}
	})
}

function getDragAfterElement(todoList, y) {
	const draggableElements = [...todoList.querySelectorAll('.todo__item:not(.dragging)')]

	return draggableElements.reduce((closest, child) => {
		const box = child.getBoundingClientRect()
		const offset = y - box.top - box.height / 2
		if(offset < 0 && offset > closest.offset) {
			return {offset: offset, element: child}
		} else {
			return closest
		}
	}, {offset: Number.NEGATIVE_INFINITY}).element
}

function getDarkMode() {
    if (localStorage.theme === 'active') {
        document.body.classList.add('active');
		iconSun.classList.remove('active')
		dayPic.classList.add('active')
        iconNight.classList.add('active')
		nightPic.classList.add('active');
    } else {
        document.body.classList.remove('active');
		dayPic.classList.remove('active')
		nightPic.classList.remove('active')
        iconNight.classList.remove('active')
		iconSun.classList.add('active');
    }
}

function clickOnActive() {
    for(i=0; i<buttonsTabs.length;i++){
        if(buttonsTabs[i].classList.contains('active')){
            buttonsTabs[i].click();
        }
    }
}