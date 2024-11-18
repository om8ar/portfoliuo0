const employeeList = JSON.parse(localStorage.getItem("employees")) || [];
const employeeListBody = document.getElementById("employeeListBody");

function loadEmployeeList() {
    employeeListBody.innerHTML = '';
    employeeList.forEach((employee, index) => {
        const row = `
            <tr>
                <td>${employee.name}</td>
                <td>${employee.performance}</td>
                <td><button class="editBtn" onclick="editEmployee(${index})">تعديل</button></td>
                <td><button class="deleteBtn" onclick="deleteEmployee(${index})">حذف</button></td>
            </tr>`;
        employeeListBody.innerHTML += row;
    });
}

function addEmployee() {
    const name = document.getElementById("employeeName").value;
    const performance = document.getElementById("employeePerformance").value;
    employeeList.push({ name, performance });
    localStorage.setItem("employees", JSON.stringify(employeeList));
    loadEmployeeList();
}

loadEmployeeList();
