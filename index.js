const connect = require("./db/connect");
const { prompt } = require("inquirer");
const consoleTable = require("console.table");
const DB = require("./db/index");
const db = require("./db/index");

connect.connect((err) => {
    if (err) throw err;
    start();
});

const start = () => {
    prompt([
        {
            type: "list",
            name: "options",
            message: "Please select an option from below.",
            choices: [
                {
                    name: "Check all employees",
                    value: "Check_employees",
                },
                {
                    name: "Check all departments",
                    value: "Check_departments",
                },
                {
                    name: "Check all roles",
                    value: "Check_roles",
                },
                {
                    name: "Add a department",
                    value: "Add_department",
                },
                {
                    name: "Add a role",
                    value: "Add_role",
                },
                {
                    name: "Add an employee",
                    value: "Add_employee",
                },
                {
                    name: "Update an employee role",
                    value: "Update_role",
                },
                {
                    name: "Quit",
                    value: "quit",
                },
            ],
        },
    ]).then((res) => {

        let options = res.options;
        switch (options) {
            case "Check_employees":
                checkEmployees();
                break;

            case "Check_departments":
                checkDepartments();
                break;

            case "Check_roles":
                checkRoles();
                break;

            case "Add_department":
                addDepartment();
                break;

            case "Add_role":
                addRole();
                break;

            case "Add_employee":
                addEmployee();
                break;

            case "Update_role":
                updateEmployeeRole();
                break;

            default:
                quit();
        }
    });
};

const checkDepartments = () => {
    const sql = `SELECT * FROM department`;

    connect.query(sql, (err, res) => {
        if (res) {
            const table = consoleTable.getTable(res);
            console.log(table);
            start();
        } else {
            console.log("Error with Departments!", err);
        }
    });
};

const checkRoles = () => {
    const sql = `SELECT roles.id, roles.title, department_name AS department, roles.salary
    FROM roles 
    LEFT JOIN department ON roles.department_id = department.id;`;

    connect.query(sql, (err, res) => {
        if (res) {
            const table = consoleTable.getTable(res);
            console.log(table);
            start();
        } else {
            console.log("Error with Roles!", err);
        }
    });
};

const checkEmployees = () => {
    const sql = `SELECT 
    employee.id,
    employee.first_name,  
    employee.last_name,
    roles.title,
    department.department_name AS department,
    roles.salary, 
    CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM employee
    LEFT JOIN roles 
    ON employee.role_id = roles.id
    LEFT JOIN department
    ON roles.department_id = department.id
    LEFT JOIN employee manager 
    ON manager.id = employee.manager_id;`;

    connect.query(sql, (err, res) => {
        if (res) {
            const table = consoleTable.getTable(res);
            console.log(table);
            start();
        } else {
            console.log("Error with Employee!", err);
        }
    });
};

const addDepartment = () => {
    prompt({
        type: "input",
        name: "addDepartment",
        message: "Please insert new department name.",
    })
        .then((res) => {
            let department = res.addDepartment;
            DB.createDepartment(department).then(() =>
                console.log(`added ${department}`)
            );
        })
        .then(() => start());
};

const addRole = () => {
    DB.findAllDepartments().then(([department]) => {
        const departmentOptions = department.map(({ id, department_name }) => ({
            name: department_name,
            value: id,
        }));
        prompt([
            {
                type: "input",
                name: "addRole",
                message: "Please insert new Role here.",
            },
            {
                type: "input",
                name: "addSalary",
                message: "Please add salary amount.",
            },
            {
                type: "list",
                name: "department",
                message: "Which department does the role belong too?",
                choices: departmentOptions,
            },
        ]).then((answers) => {
            DB.createRole(answers.addRole, answers.department, answers.addSalary)
                .then(() =>
                    console.log(
                        `added ${answers.addRole}, added ${answers.department}, added ${answers.addSalary}`
                    )
                )
                .then(() => start());
        });
    });
};

const addEmployee = () => {
    DB.findAllRoles().then(([employee]) => {
        const employeeRoleOptions = employee.map(({ id, title }) => ({
            name: title,
            value: id,
        }));
        DB.findAllEmployees().then(([manager]) => {
            const managerOptions = manager.map(
                ({ id, first_name, last_name }) => ({
                    name: `${first_name} ${last_name}`,
                    value: id,
                })
            );
            prompt([
                {
                    type: "input",
                    name: "firstName",
                    message: "Please enter the Employee's first name.",
                },
                {
                    type: "input",
                    name: "lastName",
                    message: "Please enter the Employee's last name.",
                },
                {
                    type: "list",
                    name: "roles",
                    message: "Which role does your employee belong too?",
                    choices: employeeRoleOptions,
                },
                {
                    type: "list",
                    name: "manager",
                    message: "Select manager",
                    choices: managerOptions,
                },
            ]).then((answers) => {
                DB.addEmployee(
                    answers.firstName,
                    answers.lastName,
                    answers.roles,
                    answers.manager
                )
                    .then(() =>
                        console.log(
                            ` added ${answers.roles}, added ${answers.firstName}, added ${answers.lastName}, added ${answers.manager}`
                        )
                    )
                    .then(() => start());
            });
        });
    });
};

const updateEmployeeRole = () => {
    DB.findAllEmployees().then(([employee]) => {
        const employeeOptions = employee.map(({ id, first_name, last_name }) => ({
            name: `${first_name} ${last_name}`,
            value: id,
        }));
        prompt([
            {
                type: "list",
                name: "employees",
                message: "Select employee",
                choices: employeeOptions,
            },
        ]).then((answers) => {
            let employeeId = answers.employees;
            console.log(answers.employees);
            DB.findAllRoles().then(([role]) => {
                const roleOptions = role.map(({ id, title }) => ({
                    name: title,
                    value: id,
                }));
                prompt([
                    {
                        type: "list",
                        name: "role",
                        message: "Select role",
                        choices: roleOptions,
                    },
                ])
                    .then((answers) => {
                        let role = answers.role;
                        console.log(answers.role);
                        console.log("employeeId", employeeId)
                        db.updateRole(role, employeeId)
                            .then(() => console.log("Employee roll has been updated"))
                            .then(() => start());

                    })
            });
        });
    });
};

const quit = () => {
    console.log("Goodbye");
    process.exit();
};