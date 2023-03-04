const socket = io();

const openaiEndpoint = 'https://api.openai.com/v1/chat/completions';
const openaiApiKey = '';

const chatForm = document.getElementById('chat-form')
const chatMessages = document.querySelector('.chat-messages');
socket.emit('chatMessage', "I am your personal doctor AI! You can call me Doc. Dodod! Please describe your injury so I can assist you")
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

    const prompt = msg;
    fetch(openaiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiApiKey}`
        },
        body: JSON.stringify({
        messages: [
            {"role": "system", "content": "Pretend you're a medical clinic. I'm about to give you an injury. Once I specify the injury, list a few rehab exercises, list the sets and reps, and a small description. Here is the injury: " + prompt},
            {"role": "user", "content": ``},
        ],
          model: 'gpt-3.5-turbo'
        })
      })
      .then(response => response.json())
      .then(data => {
        console.log(prompt);
        console.log(data);
        const text = data.choices[0].message.content;
        socket.emit('chatMessage', text)
      })
      .catch(error => {
        console.error(error);
      });
    

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
    div.innerHTML = `<p class="meta">Doc. Dodo <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}