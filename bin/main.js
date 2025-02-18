#!/usr/bin/env node

const fs = require('node:fs');
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
  .option('s', {
    "describe" : "save time to a file specified after flag"
  })
  .option('l', {
    "describe" : "list all save files, add file name to print file data"
  })
  .argv;

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
    return [h, m, s].join(':');
};

function HMStoSeconds(hhmmss) {
  hms = String(hhmmss).split(":").map(Number); 
  s = hms[0]*3600+hms[1]*60+hms[2];
  return s;
}

console.log(Date());

//chronometer function
if (argv.k === true) {
  let chronometer = setInterval(() => {
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
      console.log('\n');
      console.log(Date());
}}, 1000)};


//Save file on exit if the -s flag is specified
if (argv.s !== undefined && argv.s !== true){
  process.on('SIGINT', () => {
    try {
      file = fs.readFileSync(`${__dirname}/../data/${argv.s}.json`); 
      file = JSON.parse(file);
      console.log(`\n writing to file "${argv.s}"`);
    } catch {
      console.log(`\n no file named "${argv.s}" found.`);
      console.log(`creating new file.`) 
      file = [];
    };

    a = new Date();
    date = `${a.getDate()}/${a.getMonth()+1}/${a.getFullYear()}@${a.getHours()}:${(a.getMinutes() < 10) ? "0" + a.getMinutes() : a.getMinutes()}`;
    try {
      total = formatAndPrintHMS(HMStoSeconds(file.at(-1).Total) + time);
    } catch {
      total = formatAndPrintHMS(time);
    };
    file.push({Date: date, Total: total, Time: formatAndPrintHMS(time)});
    fs.writeFileSync(`${__dirname}/../data/${argv.s}.json`, JSON.stringify(file));
    process.exit();
  })
};

//List save files if -l flag is specified
if (argv.l != undefined) {
  if (argv.l === true) {
    console.log('List of save files:');
    fs.readdir(`${__dirname}/../data/`, (err, files) => {
      files.forEach(element => {console.log(element);
    });
  })} else {
    file = JSON.parse(fs.readFileSync(`${__dirname}/../data/${argv.l}.json`));
    console.log(file);
  }
};


