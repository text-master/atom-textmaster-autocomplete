"use babel";

import io from "socket.io-client";
import ioreq from "socket.io-request";
// const socketUrl = "http://textmaster-server.herokuapp.com";
const socketUrl = "http://localhost:3000";
const socket = io(socketUrl);

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

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
        const isUpperCase = prefix.charAt(0) == prefix.charAt(0).toUpperCase();
        ioreq(socket)
          .request("suggestion", {
            prefix: prefix.toLowerCase(),
            topic: this.topic
          })
          .then(suggestions => {
            // convert the array of words into an array of objects with a text property
            let matchingSuggestions = suggestions.map(suggestion => {
              const word = suggestion.Word;
              return  {
                // text: isUpperCase ? capitalizeFirstLetter(word.Word) : word.Word
                text: prefix + word.slice(prefix.length, word.length)
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
