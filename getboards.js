const axios = require('axios');
const fs = require('fs');

axios.get('https://api.4chan.org/boards.json')
  .then(response => {
    const boards = [];
    for(let board in response.data.boards){
      const b = {};
      b.board = response.data.boards[board].board;
      b.title = response.data.boards[board].title;
      if(response.data.boards[board].ws_board){
        b.ws = 1
      } else {
        b.ws = 0
      }
      boards.push(b);
    }
    fs.writeFile('boards.json', JSON.stringify(boards, null, '  '), (s) => {return});
  })
  .catch(error => {
    console.log(error);
  });