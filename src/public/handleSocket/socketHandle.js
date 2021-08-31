const openSocket = require('socket.io-client')
const socket = openSocket('http://localhost:3000')
document.querySelector('#click').onclick(function () {
  alert('Hi')
})
alert(socket)
socket.on('booked ticket', (seat) => console.log(seat))
