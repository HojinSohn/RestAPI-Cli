const currentDate = new Date();

const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];
console.log(currentDate)
const currentMonth = months[currentDate.getMonth()];
const currentYear = currentDate.getFullYear();
const currentDateDate = currentDate.getDate();

const monthYearElement = document.getElementById('currentDate');
monthYearElement.textContent = `${currentMonth}  ${currentDateDate}  ${currentYear}`;

const taskStates = {};

const getTaskList = async () => {
    const response = await fetch('http://127.0.0.1:5000/task');
    const taskJsons = await response.json();
    const taskList = taskJsons.map(taskJson => {
        const taskDate = new Date(taskJson.timestamp)
        const timeDifference = taskDate - currentDate;

        const daysDiff = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        // const hoursDiff = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

        return`<div class="taskDisplay" id="${taskJson.title}u" style="display: none">
                <button class="taskButton" data-task='${JSON.stringify(taskJson)}'>
                    <p>${taskJson.description}</p>
                </button> ${
            daysDiff > 0 ?
                `<p>${daysDiff} day left</p>`
                // : hoursDiff < 0 
                //     ? `<p>${hoursDiff} hours left</p>`
                : `<p>overdue</p>`
        }
            </div> 
            <div class="taskDisplay" id="${taskJson.title}o">
                    <button class="taskButton" data-task='${JSON.stringify(taskJson)}'>
                        <p class="timestamp">${taskJson.timestamp}</p>
                        <span>${taskJson.title}</span>
                    </button> ${
            daysDiff > 0 ?
                `<p>${daysDiff} day left</p>`
                // : hoursDiff < 0 
                //     ? `<p>${hoursDiff} hours left</p>`
                : `<p>overdue</p>`
        }
                </div>`;
    });


    const listContainer = document.getElementById("list");
    listContainer.innerHTML = taskList.join('<br>');

    // Attach event listener to the parent list container
    listContainer.addEventListener("click", function(event) {
        const clickedButton = event.target.closest(".taskButton");
        if (clickedButton) {
            const taskJson = JSON.parse(clickedButton.dataset.task);
            toggleContent(taskJson.title);
        }
    });
}

function toggleContent(title) {
    const originalContent = document.getElementById(`${title}o`);
    const updatedContent = document.getElementById(`${title}u`);

    // Toggle the visibility of original and updated content
    if (taskStates[title] === "updated") {
        originalContent.style.display = "flex";
        updatedContent.style.display = "none";
        taskStates[title] = "original";
    } else {
        originalContent.style.display = "none";
        updatedContent.style.display = "flex";
        taskStates[title] = "updated";
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    await getTaskList();
});