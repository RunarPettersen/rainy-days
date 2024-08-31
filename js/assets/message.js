export function displayMessage(message, type) {
    const messageContainer = document.createElement('div');
    messageContainer.className = `message ${type}`;

    messageContainer.innerText = message;

    document.body.appendChild(messageContainer);

    setTimeout(() => {
        messageContainer.remove();
    }, 5000);
}