const mysql = require('mysql2');
const inquirer = require("inquirer");
const cTable = require('console.table');

const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'howard',
    database: 'challenge12_db'
  },
);
// This start the application. Ask user to choose what they want to do. Depending on which option the user chooses it will run a specific function.
const start = () =>{
    inquirer.prompt({
     
        type:"list",
        name:"choose",
        message:"What do you want to do?",
        choices:["View all Departments","View all Roles","View all Employee","Add a Department","Add a Role","Add an Employee","Update An Employee","Quit"]
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
        }else if(ans.choose ==="Add an Employee"){
            addEmployee();
        }else if(ans.choose ==="Update An Employee"){
            updateEmployee();
        }else{
            console.log("goodbye!");
        }
    })
}
//Function to view all of departments Table.
const viewDepartment =() => {
    db.query('SELECT * FROM departments', function (err, results) {
        console.table(results);
        start();
})
}
//Function to view roles. Joins with the table department so the foreign id can reference the name on departments.
const viewRole = () => {
    db.query('select roles.id, roles.title, departments.name, roles.salary from roles join departments on department_id = departments.id ORDER BY roles.id;', function (err, results) {
        console.table(results);
        start();
})
}


const viewEmployee = () => {
    db.query("SELECT e.id, e.first_name, e.last_name, roles.title,departments.name AS Departments, roles.salary, m.first_name AS Manager FROM employees e LEFT JOIN employees m ON e.manager_id = m.id  JOIN roles ON e.role_id = roles.id JOIN departments ON department_id = departments.id ORDER BY e.id;", function (err, results) {
        console.table(results);
        start();
})
}
//Prompt user to input detail to add a new department. Then it will do a query to insert the data into the table.
const addDepartment = () => {
    inquirer.prompt([
        {   
            type:"input",
            name:"name",
            message:"What is the name of the department?"
        }
        ]).then(ans => {
            db.query('INSERT INTO departments(name) VALUES(?)',[ans.name], function (err, results) {
                start();
        })
         })
}
//Prompt user to input detail to add a new Role.
const addRole = () => {
    //It start by going through a forloop to add every name of the department into an array for departments. 
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
            message:"What is the name of the role?"
        },
        {
            type:"input",
            name:"salary",
            message:"what is the salary for the role?"
        },
        //Then in the prompt it will give the user all the option in the department array to choose from
        //This will allow the application to know what department_id to add to the role
        {
            type:"list",
            name:"department",
            message:"Which department does the role belong to?",
            choices:departments,
        }
        //After the prompt there will be a query that insert a new role into the roles table.
        ]).then(ans => {
            db.query('SELECT id FROM departments WHERE name = ?',[ans.department], function (err, results) {
                db.query('INSERT INTO roles(title,salary,department_id) VALUES(?,?,?)', [ans.title,ans.salary,results[0].id], function (err, results) {
                })
                start();})
        })

    }
//Prompt user to input detail to add a new Employee
const addEmployee = () => {
//Start by creating a few arrays. First array is to get a list of all the role which will be used in the prompt
    const roles=[];
    db.query('SELECT title FROM roles', function (err, results) {
        for(i=0; i<results.length; i++){
            roles.push(results[i].title);
        }
    })

//Second array is to get a list of all employee first name
//third array is to get a list of all employee last name
//fourth array is to combine firstname and lastname array so the new array will be full names.
    const employeefirst=[];
    const employeelast=[];
    const employeefull=["null"];
    db.query('SELECT first_name FROM employees', function (err, results) {
        for(i=0; i<results.length; i++){
            employeefirst.push(results[i].first_name)
        }
    }) 

    db.query('SELECT last_name FROM employees', function (err, results) {
        for(i=0; i<results.length; i++){
            employeelast.push(results[i].last_name)
        }
        for(i=0; i<results.length; i++){
            employeefull.push(employeefirst[i].concat(" ", employeelast[i]))
        }
    }) 
    
    inquirer.prompt([
        {   
            type:"input",
            name:"firstname",
            message:"What is the employee's First name?"
        },
        {
            type:"input",
            name:"lastname",
            message:"what is employee's Last name?"
        },
        //During the prompt the first array roles will be the choices for what role is the employee so option will be all the roles.
        {
            type:"list",
            name:"role",
            message:"what is employee's role?",
            choices:roles
        },
        //the employeefull array will be the choices of the manager so the option will be a list of all the employees
        {
            type:"list",
            name:"manager",
            message:"who is employee's manager?",
            choices:employeefull
        },
        //query to insert new employee into table
        ]).then(ans => {
            const name = ans.manager;
            const name1 = name.split(" ");
            if(ans.manager==="null"){
                db.query("SELECT id FROM roles WHERE title=?",[ans.role], function (err, results){
                db.query("SELECT id FROM employees WHERE first_name=? and last_name=?", [name1[0],name1[1]], function (err, data) {
                    db.query("INSERT INTO employees(first_name,last_name,role_id) VALUES(?,?,?)",[ans.firstname,ans.lastname,results[0].id], function (err, result3){
                    })
                })
            })    
            }else{
            db.query("SELECT id FROM roles WHERE title=?",[ans.role], function (err, results){
                db.query("SELECT id FROM employees WHERE first_name=? and last_name=?",[name1[0],name1[1]], function (err, data) {
                    db.query("INSERT INTO employees(first_name,last_name,role_id,manager_id) VALUES(?,?,?,?)",[ans.firstname,ans.lastname,results[0].id,data[0].id], function (err, result3){
                    })
                })
            
            })
        } 
            start();
            
        })

}
//Prompt user to update employee role.
const updateEmployee = () => {
    //start by adding all the roles into an array
    const roles=[];
    db.query('SELECT title FROM roles', function (err, results) {
        for(i=0; i<results.length; i++){
            roles.push(results[i].title);
        }
    })

    //gets all of the employee full names
    const employeefirst=[];
    const employeelast=[];
    const employeefull=[];
    db.query('SELECT first_name FROM employees', function (err, results) {
        for(i=0; i<results.length; i++){
            employeefirst.push(results[i].first_name)
            ;
        }
    }) 

    db.query('SELECT last_name FROM employees', function (err, results) {
        for(i=0; i<results.length; i++){
            employeelast.push(results[i].last_name)
        }
        for(i=0; i<results.length; i++){
            employeefull.push(employeefirst[i].concat(" ", employeelast[i]))
        }
        //reference the employee full name array here to choose which employee to update.
        inquirer.prompt([
            {   
                type:"list",
                name:"employee",
                message:"Which Employee's role do you want to update?",
                choices:employeefull
            },
            //reference the role array here to choose which role to change to
            {
                type:"list",
                name:"role",
                message:"Which role do you want to assign the selected employee",
                choices:roles
            }
            //query that updates the employee base on employee id 
                ]).then(ans => {
                    const name = ans.employee;
                    const name1 = name.split(" ");
                    db.query("SELECT id FROM employees WHERE first_name=? and last_name=?",[name1[0],name1[1]], function (err, data) 
                    { 
                        db.query("SELECT id FROM roles WHERE title=?",[ans.role], function (err,result)
                        { 
                            db.query("UPDATE employees SET role_id=? WHERE id=?",[result[0].id, data[0].id], function (err, result3)
                            {       
                                start();
                        })
                    })
                        
                })
                    })
         
    }) 

    }


start();





