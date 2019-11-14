const midi = require('midi');
const output = new midi.Output();
const SerialPort = require('serialport');
const Readline = SerialPort.parsers.Readline;

var portCount = output.getPortCount();
// const midiEvent = 144; // Trigger note channel 1
const midiEvent = 176; // CC channel 1

console.log("Available MIDI devices:");
for (var i = 0; i < portCount; i++) {
  console.log(i + ': ' + output.getPortName(i));
}

// Set the appropriate device number here
var deviceNumber = 1;
output.openPort(deviceNumber);
console.log('Opened ' + output.getPortName(deviceNumber) +  '.');

const port = new SerialPort('/dev/cu.usbserial-A9003VTF', { baudRate: 9600 });
const parser = new Readline();
port.pipe(parser);
parser.on('data', function(data) {
  // Send some CC data
  console.log(data);
  output.sendMessage([midiEvent, 1, data]);
  // output.sendMessage([midiEvent, data, data]);
  // setTimeout(noteOff, 10, data);
});

function noteOff(note) {
  output.sendMessage([128, note, 0]);
}

const scale = (num, in_min, in_max, out_min, out_max) => {
  return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}