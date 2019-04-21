const createServer = require('http').createServer;
const axios = require('axios');
const formidable = require('formidable');
const fs = require('fs');

const _PORT = 5000;

const handler = (req, res) => {
    switch(req.url){
        case "/boards":
            returnBoards(req, res);
            break;
        case "/catalog":
            returnCatalog(req, res);
            break;
        case "/thread":
            returnThread(req, res);
            break;
        case "/image":
            returnImage(req, res);
            break;
        case "/getBackground":
            returnBackground(req, res);
            break;
        default:
            res.end();
    }
};

const returnBoards = (req, res) => {
    const dataMap = require("./boards.json");
    res.writeHead(200, {"Content-Type":"application/json"});
    res.end(JSON.stringify(dataMap));
}

const returnCatalog = (req, res) => {
    
    const form = new formidable.IncomingForm();
    form.parse(req, (err, fields) => {
        const board = fields.board;
        const url_string = "https://a.4cdn.org/" + board + "/catalog.json";
        axios.get(url_string)
            .then(response => {
                let threads = [];
                for(let page in response.data){
                    threads = [...threads, ...response.data[page].threads];
                }
                threads = threads.map(thread => {
                    const t = {
                        no: thread.no,
                        now: thread.now,
                        name: thread.name,
                        sub: thread.sub,
                        com: thread.com,
                        tim: thread.tim,
                        ext: thread.ext,
                        replies: thread.replies,
                        images: thread.images
                    };
                    return t;
                })
                res.writeHead(200, {"Content-Type":"application/json"});
                res.end(JSON.stringify(threads));
            })
            .catch(error => {
                console.log(error);
                res.writeHead(404);
                res.end();
            });
    });
    
}

const returnThread = (req, res) => {

    const form = new formidable.IncomingForm();
    form.parse(req, (err, fields) => {
        const board = fields.board;
        const thread = fields.thread;
        const url_string = "https://a.4cdn.org/" + board + "/thread/" + thread + ".json";
        axios.get(url_string)
            .then(response => {
                let posts = [...response.data.posts];
                posts = posts.map(post => {
                    const p = {
                        no: post.no,
                        now: post.now,
                        name: post.name,
                        com:""
                    };
                    if(post.com) p.com = post.com;
                    if(post.ext && (post.ext !== ".webm")) {
                        p.ext = post.ext;
                        p.tim = post.tim;
                        p.filename = post.filename;
                    }
                    if(post.replies) p.replies = post.replies;
                    if(post.images) p.images = post.images;
                    if(post.sub) p.sub = post.sub;
                    return p;
                })
                for(let x = 0;x<posts.length;x++){
                    let replies = [];
                    const post_no = posts[x].no;
                    for(let i = x + 1;i<posts.length;i++){
                        if(posts[i].com.includes("&gt;&gt;" + post_no)){
                            replies = [...replies, posts[i].no];
                        }
                    }
                    posts[x].replies = replies;
                }
                res.writeHead(200, {"Content-Type":"application/json"});
                res.end(JSON.stringify(posts));
            })
            .catch(error => {
                console.log(error);
                res.writeHead(404);
                res.end();
            });
    });
    
}

const returnImage = (req, res) => {
    const form = new formidable.IncomingForm();
    form.parse(req, (err, fields) => {
        const board = fields.board;
        const tim = fields.tim;
        const ext = fields.ext;
        const url_string = "https://i.4cdn.org/" + board + "/" + tim + ext;
        
        axios.get(url_string, {
            responseType: 'arraybuffer'})
            .then(response => {
                const data = new Buffer(response.data, 'binary').toString('base64');
                res.writeHead(200, {"Content-Type":"application/json"});
                res.end(JSON.stringify({"image":data}));
            })
            .catch(error => {
                console.log(error);
                res.writeHead(404);
                res.end();
            });
    });
}

const returnBackground = (req, res) => {
    fs.readdir("./client/public/bg", (err, files) => {
        if(err) res.end();
        const file = files[Math.floor(Math.random() * files.length)];
        res.writeHead(200, {"Content-Type":"application/json"});
        res.end(JSON.stringify({background: file}));
    })
}

createServer(handler).listen(_PORT);

console.log(`Listening at ${_PORT}...`);