"use babel";

import io from "socket.io-client";
import ioreq from "socket.io-request";
// const socketUrl = "http://textmaster-server.herokuapp.com";
const socketUrl = "http://localhost:3000";
const socket = io(socketUrl);

class Provider {
  constructor() {
    this.selector = ".text.plain";
    this.topic = "society";
  }

  getSuggestions(options) {
    const { prefix } = options;
    return this.findMatchingSuggestions(prefix);
  }

  findMatchingSuggestions(prefix) {
    return new Promise((resolve, reject) => {
      if (prefix !== " ") {
        ioreq(socket)
          .request("suggestion", {
            prefix: prefix,
            topic: this.topic
          })
          .then(wordList => {
            // convert the array of words into an array of objects with a text property
            let matchingSuggestions = wordList.map(word => {
              return  {
                text: word.Word
              };
            });

            resolve(matchingSuggestions);
          })
          .catch(function(err) {
            console.error(err.stack || err);
          });
        }
    })
  }

}
export default new Provider();
