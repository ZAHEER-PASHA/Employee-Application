const apiUrl = "http://localhost:8081/api/employees";

async function loadEmployees() {
    const response = await fetch(apiUrl);
    const employees = await response.json();

    const table = document.getElementById("employeeTable");

    table.innerHTML = "";

    employees.forEach(employee => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${employee.id}</td>
            <td>${employee.name}</td>
            <td>${employee.email}</td>
            <td>${employee.department}</td>
            <td>${employee.salary}</td>
            <td>
                <button class="delete-btn" onclick="deleteEmployee(${employee.id})">
                    Delete
                </button>
            </td>
        `;

        table.appendChild(row);
    });
}

async function addEmployee() {
    const employee = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        department: document.getElementById("department").value,
        salary: Number(document.getElementById("salary").value)
    };

    if (!employee.name || !employee.email || !employee.department || !employee.salary) {
        alert("Please fill all fields");
        return;
    }

    const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(employee)
    });

    if (response.ok) {
        document.getElementById("name").value = "";
        document.getElementById("email").value = "";
        document.getElementById("department").value = "";
        document.getElementById("salary").value = "";

        loadEmployees();
    } else {
        alert("Failed to add employee");
    }
}

async function deleteEmployee(id) {
    if (!confirm("Are you sure you want to delete this employee?")) {
        return;
    }

    const response = await fetch(`${apiUrl}/${id}`, {
        method: "DELETE"
    });

    if (response.ok) {
        loadEmployees();
    } else {
        alert("Failed to delete employee");
    }
}

loadEmployees();