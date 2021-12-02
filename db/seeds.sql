USE business;

INSERT INTO departments (name) VALUES ('Clothing');
INSERT INTO role (title, salary, department_id) VALUES ('Sales', 20.00, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Jeff', 'Dalnas', 1, NULL);