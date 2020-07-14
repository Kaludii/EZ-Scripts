import {
    onChat
} from "ez:chat";

const system = server.registerSystem(0, 0);

const foo = {
    "marco" : "polo",
    "lol" : "Whats so funny",
    "hi" : "Hello :)",
    "hey" : "Hai :)",
    "bye" : "Wait don't go :c",
    "kaludi" : "Who dare spekt thy name",
    "wolf" : "ew",
    "shoe" : "a shoe",
    "bot" : "That's me. :)"
};

onChat( ({ content }) => {
    if (content in foo) {
        const rawText = {
            rawtext : [{
                text : "<§dProtectorsCraft§r>§b " + foo[content]
            }]
        };
        system.executeCommand(`tellraw @a ${JSON.stringify(rawText)}`, () => {});
    }
});
console.log("fun.js loaded");