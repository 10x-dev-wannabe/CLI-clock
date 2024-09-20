#!/usr/bin/env node

const readLine = require('readline-sync');
const fs = require('node:fs');

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
  .option('s', {
    "describe" : "save time to a file specified after flag"
  })
  .argv;

let t = 0;
let h;
let m;
let s;
let time;

console.log(argv)

function formatAndPrintHMS(time) {
    h = Math.trunc(time/3600);
    m = Math.trunc(time%3600/60);
    s = time % 60;
 
    h = (h < 10) ? "0"+h : h;
    m = (m < 10) ? "0"+m : m;
    s = (s < 10) ? "0"+s : s;
    process.stdout.write('\r\x1b[K')  
    process.stdout.write(`${h}:${m}:${s}`)
    return [h, m, s].join(':');
}

console.log(Date());

//chronometer function
if (argv.k === true) {
  let clock = setInterval(() => {
    t += 1;
    time = t;
    formatAndPrintHMS(t);
  }, 1000);
};

//clock function
if (argv.c === true) {
  let clock = setInterval(() => {
    let date = new Date();
    t = 0;
    t += date.getHours() * 3600;
    t += date.getMinutes() * 60;
    t += date.getSeconds();
    formatAndPrintHMS(t);
  }, 1000);
};

//timer function
if (argv.t === true) {
  t += readLine.questionInt('hours:   ')*3600;
  t += readLine.questionInt('minutes: ')*60; 
  t += readLine.questionInt('seconds: ');
  time = t;

  let clock = setInterval(() => {
    t -= 1;
    formatAndPrintHMS(t); 
    if (t <= 0) {
      clearInterval(clock);
      console.log('\n') 
      console.log(Date()) 
 
    }}, 1000);
  };

if (argv.s !== undefined && argv.s !== true){
  process.on('SIGINT', () => {
    //Get total time, add current time.
    let total = fs.readFileSync(`${__dirname}/../data/${argv.s}`, 'utf8');
    total = total.substring(total.lastIndexOf('/')+1, total.lastIndexOf('|'));
    total = Number(time) + Number(total);
    //Write to file.
    let d = new Date();
    let data = `\n${formatAndPrintHMS(time)} |${formatAndPrintHMS(total)}/${total}| @ ${d.toDateString()}`;
    fs.appendFileSync(`${__dirname}/../data/${argv.s}`, data)
    process.exit();
  })
}

