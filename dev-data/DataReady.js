const fs = require("fs");
const path = require("path");

function sortByKey(array, key) {
  return array.sort(function (a, b) {
    var x = a[key];
    var y = b[key];
    return x < y ? -1 : x > y ? 1 : 0;
  });
}

const products = JSON.parse(
  fs.readFileSync(`${__dirname}/products.json`)
);

sortedProducts = sortByKey(products, 'id');

const files = fs.readdirSync('Images/');

for (let i = 0; i < files.length; i++) {
  let nameOfFile = files[i];

  const pathToFile = path.join(__dirname, `Images/${nameOfFile}`);

  const newPath = path.format({ ...path.parse(pathToFile), base: '', ext: '.jpg' });

  fs.rename(pathToFile, newPath, (err) => {
    if(err) {
      console.log(err);
      return;
    }

    console.log('The file has been re-named to: ' + newPath);
  })

}

// For knowing the types of products in the items
// const newset = new Set();

// for (let i = 0; i < sortedProducts.length; i++) {
//   // console.log(i);
//   newset.add(sortedProducts[i].type);
// }

// console.log(newset);

function renameKey ( obj, oldKey, newKey ) {
  obj[newKey] = obj[oldKey];
  delete obj[oldKey];
}

products.forEach( obj => renameKey( obj, 'id', 'photoID' ) );

// const updatedJsonProducts = JSON.stringify( products );

fs.writeFile(
    `${__dirname}/products.json`,
    JSON.stringify(products),
    err => {
        console.log('done');
    }
);