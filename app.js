const Joi = require("joi");
const express = require("express");//return function
const app = express(); //return express object and has function like app.get, app.put and like wise
app.use(express.json());
const courses = [
    { id: 1, name: "course1" },
    { id: 2, name: "course2" },
    { id: 3, name: "course3" }
];
app.get("/", (req, res) => {
    res.send("hello world");
});

app.get("/api/courses", (req, res) => {
    res.send(courses);
});

app.get("/api/courses/:id", (req, res) => {
    const result = courses.filter(c => c.id === parseInt(req.params.id)); //filter will return array
    //const result=courses.find(c=>c.id===parseInt(req.params.id)); // will return object
    if (result.length < 1) return res.status(404).send("the course with given id is not found");
    res.send(result);
});

app.post("/api/courses", (req, res) => {

    const { error } = validateCourse(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const course = {
        id: courses.length + 1,
        name: req.body.name
    }
    courses.push(course);
    res.send(course)
});

app.put("/api/courses/:id", (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id)); // will return object
    if (!course) return res.status(404).send("the course with given id is not found");

    const { error } = validateCourse(req.body);
    if (error) return res.status(400).send(error);

    course.name = req.body.name;
    res.send(course);
});

app.delete("/api/courses/:id", (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id)); // will return object
    if (!course) return res.status(404).send("the course with given id is not found");

    const index = courses.indexOf(course);
    courses.splice(index, 1);
    res.send(course);

});

function validateCourse(course) {
    const schema = {
        name: Joi.string().min(3).required()
    };
    return Joi.validate(course, schema);
}


const port = process.env.PORT || 3000; //assign port dynamically by hosting environment
app.listen(port, () => console.log(`Listining on port ${port}...`));

//nodemon will monitor the changes in node app so that we dont have to start and stop the server evrytime we change something