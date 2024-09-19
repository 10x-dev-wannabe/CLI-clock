#!/usr/bin/env node

const readLine = require('readline-sync');

var argv = require('yargs/yargs')(process.argv.slice(2))
  .option('k', {
    "describe" : "sipmle chronometer"
  })
  .option('c', {
    "describe" : "simple clock showing current time"
  })
  .option('t', {
    "describe" : "simple countdown timer"
  })
  .argv;

console.log(argv);

let t = 0;
let h;
let m;
let s;
let time;

function formatAndPrintHMS(time) {
    h = Math.trunc(time/3600);
    m = Math.trunc(time%3600/60);
    s = time % 60;
 
    h = (h < 10) ? "0"+h : h;
    m = (m < 10) ? "0"+m : m;
    s = (s < 10) ? "0"+s : s;
    process.stdout.write('\r\x1b[K')  
    process.stdout.write(`${h}:${m}:${s}`)
}

console.log(Date());

//chronometer function
if (argv.k === true) {
  let clock = setInterval(() => {
    t += 1;
    formatAndPrintHMS(t);
  }, 1000);
};

//clock function
if (argv.c === true) {
  let clock = setInterval(() => {
    time = new Date();
    t = 0;
    t += time.getHours() * 3600;
    t += time.getMinutes() * 60;
    t += time.getSeconds();
    formatAndPrintHMS(t);
  }, 1000);
};

//timer function
if (argv.t === true) {
  t += readLine.questionInt('hours:   ')*3600;
  t += readLine.questionInt('minutes: ')*60; 
  t += readLine.questionInt('seconds: ');
  console.log(t) 
  let clock = setInterval(() => {
    t -= 1;
    formatAndPrintHMS(t); 
    if (t <= 0) {
      clearInterval(clock);
      console.log('\n') 
      console.log(Date()) 
  }}, 1000);
  
}
