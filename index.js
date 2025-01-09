const http = require('http');
const fs = require('fs');
let port = 8080;

const server = http.createServer((request, response) => {
    console.log(request.url);
    let filename = "";

    switch (request.url) {
        case "/":
            filename = "home.html";
            break;
        case "/about":
            filename = "about.html";
            break;
        case "/contact":
            filename = "contact.html";
            break;
        case "/skills":
            filename = "skills.html";
            break;
        default:
            break;
    }

    if (filename) {
        fs.readFile(filename, (error, data) => {
            if (!error) {
                response.end(data);
            } 
        });
    }
});

server.listen(port, (error) => {
    if (error) {
        console.log(error);
        return;
    }
    console.log(`Server is running on port ${port}`);
});