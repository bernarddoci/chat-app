const socket = io()

const $msgForm = document.querySelector('form');
const $msgFormInput = $msgForm.querySelector('input');
const $msgFromButton = $msgForm.querySelector('button');
const $sendLocation = document.querySelector('#send-location');
const $messages = document.querySelector('#messages');

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationTemplate = document.querySelector('#location-message').innerHTML;
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;
// Options
const { username, activeroom, room } = Qs.parse(location.search, { ignoreQueryPrefix: true})

const autoscroll = () => {
    // New message element
    const $newMessage = $messages.lastElementChild

    // Height of the last message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // Visible height
    const visibleHeight = $messages.offsetHeight

    // Height of messages container
    const containerHeight = $messages.scrollHeight

    // How far have I scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight

    if(containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }
}

socket.on('message', (message) => {
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm:ss A')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('locationMessage', (message) => {
    const html = Mustache.render(locationTemplate, {
        username: message.username,
        url: message.url,
        createdAt: moment(message.createdAt).format('h:mm:ss A')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('roomData', ({ room, users}) => {
    const html = Mustache.render(sidebarTemplate, {
        room, 
        users
    })
    document.querySelector('#sidebar').innerHTML = html;
})

$msgForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let message = e.target.elements.message.value;

    $msgFromButton.setAttribute('disabled', 'disabled');
    socket.emit('sendMessage', message, (error) => {
        $msgFromButton.removeAttribute('disabled');
        $msgFormInput.value = '';
        $msgFormInput.focus();

        if(error) {
            return console.log(error)
        }
        console.log(`%cMessage delivered.`, 'color: red; font-weight: bold');
    });

})

$sendLocation.addEventListener('click', () => {
    $sendLocation.setAttribute('disabled', 'disabled')

    if(!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser.')
    }
    
    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude, 
            longitude: position.coords.longitude
        }, (error) => {

            $sendLocation.removeAttribute('disabled')

            if(error) {
                return console.log(error)
            }

            console.log('%cLocation shared!', 'color: orange')
        })
    })
})

socket.emit('join', { username, activeroom, room }, (error) => {
    if(error) {
        alert(error)
        location.href = '/'
    }
})
