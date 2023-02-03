INSERT INTO departments (name)
VALUES ("Finance"),
        ("Service");
       


INSERT INTO roles (title, salary, department_id)
VALUES ("Accountant", 100000, 1),
       ("Accountant Manager", 150000, 1),
       ("Customer Service", 60000, 2),
       ("Tax Specialist", 100000, 1),
       ("Waiter", 40000, 2);

INSERT INTO employees(first_name, last_name, role_id, manager_id)
VALUE ("Howard","Lee",2,null);

