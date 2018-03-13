"use babel";

import io from "socket.io-client";
import ioreq from "socket.io-request";
const socketUrl = "http://textmaster-atom-server.herokuapp.com";
const CLASSIFIER_URL = "http://textmaster-classifier.herokuapp.com/classifier";
const socket = io(SOCKKET_URL);

class Provider {
  constructor() {
    this.selector = ".text.plain";
    this.topic = "society";
  }

  getSuggestions(options) {
    const { prefix, editor} = options;
    const text = editor.getText();
    const self = this;
    if (prefix === " ") {
      fetch(CLASSIFIER_URL, {
        method: "post",
        body: text
      })
        .then(response => {
          response.text().then(function(data) {
            self.topic = data;
          });
        })
        .catch(err => {
          console.log(err);
        });
      return [];
    }

    return this.findMatchingSuggestions(prefix);
  }

  findMatchingSuggestions(prefix) {
    const topic = this.topic;
    return new Promise((resolve, reject) => {
      if (prefix !== " ") {
        ioreq(socket)
          .request("suggestion", {
            prefix: prefix.toLowerCase(),
            topic: topic
          })
          .then(suggestions => {
            // convert the array of words into an array of objects with a text property
            let matchingSuggestions = suggestions.map(suggestion => {
              const word = suggestion.Word;
              return {
                text: prefix + word.slice(prefix.length, word.length),
                rightLabel: topic
              };
            });

            resolve(matchingSuggestions);
          })
          .catch(function(err) {
            console.error(err.stack || err);
          });
      }
    });
  }
}
export default new Provider();
