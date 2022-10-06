import inquirer from "inquirer";
const main = {};
const questions = [
  {
    type: "list",
    name: "executableType",
    message: "Choose executable type:",
    choices: [
      { name: "Cars", value: "cars" },
      { name: "Animals", value: "animals" },
    ],
  },
  {
    name: "executableName",
    message: "Enter the executable name:",
  },
  {
    name: "namespace",
    message: "Enter the zoo:",
  },
  {
    name: "authorName",
    message: "Enter your name:",
  },
];
const answers = inquirer.prompt(questions, (answers) => {
  console.log(answers);
});
console.log(answers);
