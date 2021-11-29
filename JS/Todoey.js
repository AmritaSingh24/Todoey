
const clearAll = document.querySelector("#clearAll");
const taskForm = document.querySelector("#taskform");
const input = document.querySelector("#task");
const priority = document.querySelector("#priority");
const listFilter = document.querySelector("#blockFilter");
const details = document.querySelector("#todo-details");
const validationTask = document.querySelector(".requiredInput1");
const validationPriority = document.querySelector(".requiredInput2");

let todoItems = []; // Create blank array


// filter item
const getItemsFilter = function(type){
    let filterItems = [];
    switch(type){
        case "incompleted":
            filterItems = todoItems.filter((item) => !item.isDone);
            break;
        case "completed":
            filterItems = todoItems.filter((item) => item.isDone);
            break;
        default:
            filterItems = todoItems;
    }
    getlist(filterItems);
}

// delete item
const removeItem = function(item){
    const removeIndex = todoItems.indexOf(item);
    todoItems.splice(removeIndex, 1);
}

// handle events on action buttons
const handleItem = function (itemData){
    
    const items = document.querySelectorAll('#todo'); // select all todo list
    items.forEach((item) =>{

        if(item.querySelector(".todo-task").getAttribute("data-time") == itemData.addedAt){
            // done
            item.querySelector("[data-done]").addEventListener('click', function(e){
                
                const itemIndex = todoItems.indexOf(itemData);// get index of itemdata
                const currentItem = todoItems[itemIndex]; // get current object 
                currentItem.isDone = currentItem.isDone ? false : true;
                todoItems.splice(itemIndex, 1, currentItem); // one item of itemIndex is replace to currentItem
                setLocalStorage(todoItems); // called setlocalstorage for todoitems
            });

            // delete
            item.querySelector("[data-delete]").addEventListener('click', function(e){
               
                details.removeChild(item); //remove item
                removeItem(item); 
                setLocalStorage(todoItems);
                return todoItems.filter((item)=> item != itemData);
            });
        }
    });
};

// get list of items
const getlist = function(todoItems)
{
   
    details.innerHTML = ""; 
    
    if(todoItems.length>0) 
    {
        todoItems.forEach((item) => {
            const iconClass = item.isDone ? "btn-disabled" : "btn-not-disabled"; // set complete buttonclass.
            const lineThrough = item.isDone ? "lineThrough" : "not-lineThrough";
            details.insertAdjacentHTML("beforeend", `<ul class="Todo" id="todo">
                                                        <li class="todo-list">
                                                            <dl class="todo-details">
                                                                <dt class="todo-task ${lineThrough}" data-time="${item.addedAt}">${item.name}</dt>
                                                                <dd class="todo-priority ${lineThrough}">${item.priorityInput}</dd>
                                                            </dl>
                                                            <div class="todo-actions">
                                                                <button class="btn__primary btn btn-round ${iconClass}" data-done >
                                                                    <svg class="icon">
                                                                        <use xlink:href="Images/icon.svg#iconmonstr-check-mark-1"></use>
                                                                    </svg>
                                                                </button>
                                                                <button class="btn btn-round btn__primary" data-delete>
                                                                    <svg class="icon">
                                                                        <use xlink:href="Images/icon.svg#iconmonstr-trash-can-24"></use>
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </li>
                                                    </ul>`
                                                );
                                            handleItem(item);          
        }); 
        listFilter.style.display ="block"; 
    }
};

// get localstorage from the page
const getLocalStorage = function(){
    const todoStorage = localStorage.getItem("todoItems"); //getting local storage.
    if((todoStorage === undefined) || (todoStorage === null)) // if localstorage is null or undefined
    {
        todoItems = []; // creating blank array
    }else{
        todoItems = JSON.parse(todoStorage); // transforming json string into a js object.   
    }
    getlist(todoItems); // called getlist function
}

// set in local storage 
const setLocalStorage = function (todoItems)// pass todoItems in parameter.
{
    localStorage.setItem("todoItems", JSON.stringify(todoItems)); //transforming js object into a json string. 
};


document.addEventListener('DOMContentLoaded', ()=>{

    taskForm.addEventListener("submit", (e) => {
        e.preventDefault()
        const inputValue = input.value.trim();
        const priorityValue = priority.value;

        // task input validation
        if((inputValue.length === 0) && (priorityValue.length === 0)){
            validationTask.style.display = "block";
            validationPriority.style.display = "block";
        }else{
            // create object 
            const todoObj = {
                name: inputValue, 
                priorityInput: priorityValue, 
                isDone: false, 
                addedAt: new Date().getTime() 
            };
            todoItems.push(todoObj); // push object in todoItems array.
            setLocalStorage(todoItems); //called setLocalStorage function.
        }
    });


    // filter tabs
    const filterBtns = document.querySelectorAll("#filterBtn");
    filterBtns.forEach((tab)=>{
        tab.addEventListener("click", function(){
            
            const tabType = this.getAttribute("data-type");
            filterBtns.forEach((nav)=>{
                nav.removeAttribute("active")
            });
            this.setAttribute("active","");
            getItemsFilter(tabType);
        });
    });

    // load items
    getLocalStorage(); //
    
});

clearAll.onclick = ()=>{
    todoItems = [];
    localStorage.setItem("todoItems", JSON.stringify(todoItems));
    getlist(todoItems);
}