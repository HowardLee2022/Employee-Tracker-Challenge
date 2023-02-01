// const express = require('express');
const mysql = require('mysql2');
const inquirer = require("inquirer");

// const PORT = process.env.PORT || 3003;
// const app = express();

// app.use(express.urlencoded({ extended: false }));
// app.use(express.json());

const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'howard',
    database: 'challenge12_db'
  },
);

const start = () =>{
    inquirer.prompt({
     
        type:"list",
        name:"choose",
        message:"What do you want to do?",
        choices:["View all Departments","View all Roles","View all Employee","Add a Department","Add an Employee","Update an Employee Role"]
    }).then(ans=>{
        if(ans.choose ==="View all Departments"){
            viewDepartment();   
        }else if(ans.choose ==="View all Roles"){
            viewRole();
        }else if(ans.choose === "View all Employee"){
            viewEmployee();
        }else if(ans.choose === "Add a Department"){
            addDepartment();
        }else{
            return;
        }
    })
}





const viewDepartment =() => {
    db.query('SELECT * FROM department', function (err, results) {
        console.table(results);
        start();
})
}

const viewRole = () => {
    db.query('SELECT title, id, department.id, salary FROM department join department', function (err, results) {
        console.table(results);
        start();
})
}


const viewEmployee = () => {
    db.query('SELECT id, first_name, last_name, role.title, department.name, role.id, department.name, role.salary FROM employee JOIN role on role_id = role.title JOIN department on role.department_id = department_name', function (err, results) {
        console.table(results);
        start();
})
}

const addDepartment = () => {
    inquirer.prompt([
        {   
            type:"input",
            name:"name",
            message:"What is new department name?"
        }
        ]).then(ans => {
            db.query('INSERT INTO department(name) VALUES(?)',[ans.name], function (err, results) {
                    console.table(results);
                    start();
        })
         })
}

const addRole = () => {
    inquirer.prompt([
        {   
            type:"input",
            name:"name",
            message:"What role name?"
        },
        {
            type:"input",
            name:"salary",
            message:"what is the salary for this role?"
        },
        {
            type:"input",
            name:"department",
            message:"what is the department id for role?"
        },
        
        ]).then(ans => {
            db.query('INSERT INTO role(title,salary,department_id) VALUES(?,?,?)',[ans.name,ans.salary,ans.department], function (err, results) {
                console.table(results);
    })
        })

}


const addEmployee = () => {
    inquirer.prompt([
        {   
            type:"input",
            name:"firstname",
            message:"What is employee First name?"
        },
        {
            type:"input",
            name:"lastname",
            message:"what is employee Last name?"
        },
        {
            type:"input",
            name:"role",
            message:"what is employee role id?"
        },
        {
            type:"input",
            name:"manager",
            message:"what is employee's manager id?"
        },
        
        
        ]).then(ans => {
            db.query('INSERT INTO employee(first_name,last_name,role_id,manager_id) VALUES(?,?,?,?)',[ans.firstname,ans.lastname,ans.role,ans.manager], function (err, results) {
                console.table(results);
    })
        })

}

start();