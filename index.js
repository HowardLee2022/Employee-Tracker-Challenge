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
        choices:["View all Departments","View all Roles","View all Employee","Add a Department","Add a Role","Add an Employee"]
    }).then(ans=>{
        if(ans.choose ==="View all Departments"){
            viewDepartment();   
        }else if(ans.choose ==="View all Roles"){
            viewRole();
        }else if(ans.choose === "View all Employee"){
            viewEmployee();
        }else if(ans.choose === "Add a Department"){
            addDepartment();
        }else if(ans.choose ==="Add a Role"){
            addRole();
        }else{
            return;
        }
    })
}




const viewDepartment =() => {
    db.query('SELECT * FROM departments', function (err, results) {
        console.table(results);
        start();
})
}



const viewRole = () => {
    db.query('SELECT * FROM roles', function (err, results) {
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
            db.query('INSERT INTO departments(name) VALUES(?)',[ans.name], function (err, results) {
                    start();
        })
         })
}

const addRole = () => {
    const departments=[];
    db.query('SELECT name FROM departments', function (err, results) {
        for(i=0; i<results.length; i++){
            departments.push(results[i].name)
        }
    }) 

    inquirer.prompt([
        {   
            type:"input",
            name:"title",
            message:"What role name?"
        },
        {
            type:"input",
            name:"salary",
            message:"what is the salary for this role?"
        },
        {
            type:"list",
            name:"department",
            message:"what is the department id for role?",
            choices:departments,
        }
        
        ]).then(ans => {
            db.query('SELECT id FROM departments WHERE name = ?',[ans.department], function (err, results) {
                console.log(results[0].id);
                console.log(ans.title);
                console.log(ans.salary);
                db.query('INSERT INTO roles(title,salary,department_id) VALUES(?,?,?)', [ans.title,ans.salary,results[0].id], function (err, results) {
                    console.log(ans.title);
                    console.lo
                    

                })
                start();})
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
            db.query('INSERT INTO employees(first_name,last_name,role_id,manager_id) VALUES(?,?,?,?)',[ans.firstname,ans.lastname,ans.role,ans.manager], function (err, results) {
                console.table(results);
    })
        })

}


start();





