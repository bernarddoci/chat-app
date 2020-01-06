const socket = io()
const $rooms = document.querySelector('#rooms');

const dropdownTemplate = document.querySelector('#dropdown-template').innerHTML;

socket.on('activeRooms', (rooms) => {
    const html = Mustache.render(dropdownTemplate, {
        rooms
    })
    $rooms.innerHTML = html
})