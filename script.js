const employeeData = JSON.parse(localStorage.getItem("employees")) || [];
const tableBody = document.getElementById("employeeTableBody");

// تحميل بيانات الموظفين عند بداية التشغيل
function loadEmployees() {
    tableBody.innerHTML = '';
    employeeData.forEach((employee, index) => {
        const row = `
            <tr>
                <td>${employee.name}</td>
                <td>${employee.performance}</td>
                <td>${employee.attendance}</td>
                <td>${employee.tasks}</td>
                <td>${employee.date}</td>
                <td><button class="editBtn" onclick="editEmployee(${index})">تعديل</button></td>
                <td><button class="deleteBtn" onclick="deleteEmployee(${index})">حذف</button></td>
            </tr>`;
        tableBody.innerHTML += row;
    });
}

// إضافة الحضور أو الغياب مع التاريخ الحالي
function addAttendance() {
    const name = prompt("أدخل اسم الموظف:");
    if (!name) return;
    const performance = prompt("أدخل رقم الأداء:");
    if (!performance) return;
    const tasks = prompt("أدخل الأعمال المطلوبة:");
    const attendance = confirm("هل الموظف حاضر؟ اضغط موافق إذا كان حاضر، وإلغاء إذا كان غائب.") ? "حاضر" : "غائب";
    const date = new Date().toLocaleDateString();

    employeeData.push({ 
        name, 
        performance, 
        tasks, 
        date, 
        attendance 
    });
    
    localStorage.setItem("employees", JSON.stringify(employeeData));
    loadEmployees();
}

// تعديل بيانات الموظف
function editEmployee(index) {
    const employee = employeeData[index];
    employee.name = prompt("أدخل الاسم الجديد:", employee.name) || employee.name;
    employee.performance = prompt("أدخل رقم الأداء الجديد:", employee.performance) || employee.performance;
    employee.tasks = prompt("أدخل الأعمال المطلوبة:", employee.tasks) || employee.tasks;
    
    localStorage.setItem("employees", JSON.stringify(employeeData));
    loadEmployees();
}

// حذف الموظف
function deleteEmployee(index) {
    if (confirm("هل أنت متأكد من حذف هذا الموظف؟")) {
        employeeData.splice(index, 1);
        localStorage.setItem("employees", JSON.stringify(employeeData));
        loadEmployees();
    }
}

// إنشاء التقارير
function generateReport(period) {
    const reportData = {
        daily: [],
        weekly: [],
        monthly: [],
        yearly: []
    };
    const now = new Date();

    employeeData.forEach(employee => {
        const employeeDate = new Date(employee.date);

        if (period === "daily" && now.toDateString() === employeeDate.toDateString()) {
            reportData.daily.push(employee);
        } else if (period === "weekly" && isSameWeek(now, employeeDate)) {
            reportData.weekly.push(employee);
        } else if (period === "monthly" && now.getMonth() === employeeDate.getMonth()) {
            reportData.monthly.push(employee);
        } else if (period === "yearly" && now.getFullYear() === employeeDate.getFullYear()) {
            reportData.yearly.push(employee);
        }
    });

    displayReport(reportData[period], period);
}

function isSameWeek(currentDate, employeeDate) {
    const oneWeek = 7 * 24 * 60 * 60 * 1000;
    const currentWeekStart = currentDate.getTime() - (currentDate.getDay() * 24 * 60 * 60 * 1000);
    return employeeDate.getTime() >= currentWeekStart && employeeDate.getTime() < currentWeekStart + oneWeek;
}

// عرض التقرير
function displayReport(data, period) {
    let reportWindow = window.open("", "_blank");
    reportWindow.document.write(`
        <style>
            body { background-color: #f0f2f5; font-family: Arial, sans-serif; color: #333; }
            h2 { text-align: center; color: #4a4a8a; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { padding: 12px; text-align: center; border: 1px solid #ccc; }
            th { background-color: #5b8def; color: #fff; }
            tr:nth-child(even) { background-color: #eef2fa; }
        </style>
    `);
    reportWindow.document.write(`<h2>تقرير ${period}</h2>`);
    reportWindow.document.write("<table><tr><th>اسم الموظف</th><th>رقم الأداء</th><th>الحضور</th><th>الأعمال المطلوبة</th><th>التاريخ</th></tr>");
    
    data.forEach(employee => {
        reportWindow.document.write(`<tr>
            <td>${employee.name}</td>
            <td>${employee.performance}</td>
            <td>${employee.attendance}</td>
            <td>${employee.tasks}</td>
            <td>${employee.date}</td>
        </tr>`);
    });
    
    reportWindow.document.write("</table>");
    reportWindow.document.close();
}

// تحميل البيانات
loadEmployees();
