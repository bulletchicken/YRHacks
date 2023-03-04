const socket = io();

const chatForm = document.getElementById('chat-form')
const chatMessages = document.querySelector('.chat-messages');
socket.emit('chatMessage', "You are now messaging your family doctor")
socket.emit('chatMessage', "Please state your injury so I can assist you");
// Message from server
socket.on('message', message => {
    //console.log(message);
    outputMessage(message);

    //scrolls as messages come
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const msg = e.target.elements.msg.value;

    //emitting message to the server
    socket.emit('chatMessage', msg);

    //clear input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus(); //re focus the input so no need to click
});

//output message to DOM
//messages are output here now
//every message that is sent from server.js goes here
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}