document.addEventListener('DOMContentLoaded', function () {
    // Select the input field, add task button, task list, and filter buttons
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');
    const filterBtns = document.querySelectorAll('.filter-btn');
  
    // Load tasks from localStorage or initialize an empty array if none exist
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  
    // Event listener for the Add Task button
    addTaskBtn.addEventListener('click', addTask);
  
    // Event listeners for the filter buttons (All, Completed, Pending)
    filterBtns.forEach(btn => btn.addEventListener('click', filterTasks));
  
    // Function to add a task
    function addTask() {
      // Get the trimmed text from the input field
      const taskText = taskInput.value.trim();
      
      // If the input is empty, exit the function
      if (!taskText) return;
  
      // Create a new task object with an id (timestamp), the task text, and completed status
      const task = {
        id: Date.now(), // Unique id based on current time
        text: taskText, // Task text from the input field
        completed: false // Initial status of the task is 'not completed'
      };
      
      // Add the new task to the tasks array
      tasks.push(task);
      
      // Save the updated tasks array to localStorage
      saveTasks();
      
      // Render the updated tasks list in the UI
      renderTasks();
  
      // Clear the input field after adding the task
      taskInput.value = '';
    }
  
    // Event listener for task completion toggling and deletion
    taskList.addEventListener('click', function (e) {
      // Check if the clicked element is a Delete button
      if (e.target.classList.contains('delete-task')) {
        const taskId = e.target.closest('li').getAttribute('data-id'); // Get the task ID from the closest 'li' element
        tasks = tasks.filter(task => task.id != taskId); // Remove the task with the matching id
        saveTasks(); // Save the updated tasks array to localStorage
        renderTasks(); // Re-render the tasks to remove the deleted one
      }
  
      // Check if the clicked element is the Complete/Undo button
      if (e.target.classList.contains('toggle-complete')) {
        const taskId = e.target.closest('li').getAttribute('data-id'); // Get the task ID from the closest 'li' element
        tasks = tasks.map(task => {
          if (task.id == taskId) {
            task.completed = !task.completed; // Toggle the completed status
          }
          return task;
        });
        saveTasks(); // Save the updated tasks to localStorage
        renderTasks(); // Re-render the tasks to reflect the updated status
      }
    });
  
    // Function to render the tasks in the UI
    function renderTasks(filter = 'all') {
      taskList.innerHTML = ''; // Clear the existing list to avoid duplicates
  
      let filteredTasks = tasks; // Start with all tasks
  
      // Filter tasks based on the selected filter
      if (filter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed); // Only completed tasks
      } else if (filter === 'pending') {
        filteredTasks = tasks.filter(task => !task.completed); // Only pending (not completed) tasks
      }
  
      // Loop through the filtered tasks and render them as list items
      filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.classList.add('task-item'); // Add the class 'task-item' to each task element
        
        // If the task is completed, add the 'completed' class (strikes through the text)
        if (task.completed) li.classList.add('completed');
        
        // Set the data-id attribute to the task's unique id
        li.setAttribute('data-id', task.id);
  
        // Task HTML structure with buttons for 'Complete/Undo' and 'Delete'
        li.innerHTML = `
          <span>${task.text}</span>
          <div>
            <button class="toggle-complete">${task.completed ? 'Undo' : 'Complete'}</button>
            <button class="delete-task">Delete</button>
          </div>
        `;
  
        // Append the task item to the task list
        taskList.appendChild(li);
      });
    }
  
    // Function to save tasks to localStorage
    function saveTasks() {
      localStorage.setItem('tasks', JSON.stringify(tasks)); // Convert tasks array to JSON and store it
    }
  
    // Function to filter tasks based on status (all, completed, pending)
    function filterTasks(e) {
      const filter = e.target.getAttribute('data-filter'); // Get the filter type from the clicked button
      renderTasks(filter); // Re-render tasks based on the selected filter
    }
  
    // Initial render of tasks when the page loads
    renderTasks();
  });
  