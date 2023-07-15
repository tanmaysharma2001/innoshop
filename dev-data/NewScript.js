const fs = require("fs");
const path = require("path");

const products = JSON.parse(
    fs.readFileSync(`${__dirname}/innoshop-app.products.json`)
);

const chatbotProducts = [];

products.forEach(element => {
    const newElement = {};
    newElement.name = element.name;
    newElement.id = element._id.$oid;
    // console.log(element._id.$oid);
    // if(element.description) {
    //     newElement.description = element.description;
    // }
    // else {
    //     newElement.description = "";
    // }
    newElement.description = "";
    chatbotProducts.push(newElement);
});

console.log(chatbotProducts);

fs.writeFile(
    `${__dirname}/chatbotProducts.json`,
    JSON.stringify(chatbotProducts),
    err => {
        console.log('done');
    }
);