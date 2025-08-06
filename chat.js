// chat.js

const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const chatMessages = document.getElementById('chat-messages');

sendBtn.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

async function sendMessage() {
    const userMessage = chatInput.value.trim();
    if (userMessage === '') return;

    // Tampilkan pesan pengguna
    addMessage(userMessage, 'user-message');
    chatInput.value = '';

    // Tampilkan loader saat menunggu respons
    const loaderMessage = addMessage('', 'bot-message');
    loaderMessage.innerHTML = '<div class="loader"></div>';
    
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt: userMessage })
        });

        const data = await response.json();
        
        loaderMessage.remove();
        addMessage(data.reply, 'bot-message');

    } catch (error) {
        console.error('Error:', error);
        loaderMessage.remove();
        addMessage('Maaf, terjadi kesalahan.', 'bot-message');
    }

    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addMessage(text, className) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', className);
    messageElement.textContent = text;
    chatMessages.appendChild(messageElement);
    return messageElement;
}