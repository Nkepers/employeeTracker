INSERT INTO department (department_name)
VALUES 
('BackHouse'), 
('FrontHouse'), 
('NewHire');

INSERT INTO roles (title, department_id, salary)
VALUES 
('Chef', 1, 2.99), 
('Hostess', 2, 1.99), 
('BusBoy', 3, 3.99); 

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
('Nicholas', 'Kepers', 1, NULL), 
('Riley', 'Kepers', 2, 1),
('Michael', 'Vermillo',3, 1);