const apikey = "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"; // use your new key

const input = document.getElementById('userInput');
const button = document.getElementById('sendBtn');
const chatWindow = document.getElementById('chatWindow');

let history = []; // store messages temporarily

// Send message on click or Enter
button.addEventListener('click', sendMessage);
input.addEventListener('keypress', e => {
  if(e.key === "Enter") sendMessage();
});

// Add message to chat window
function addMessage(text, type) {
  const div = document.createElement('div');
  div.className = type==="user"
    ? "bg-blue-600 ml-auto max-w-md p-3 rounded-lg"
    : "bg-gray-700 mr-auto max-w-md p-3 rounded-lg";
  div.textContent = text;
  chatWindow.appendChild(div);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Send message to API
async function sendMessage(){
  const msg = input.value.trim();
  if(!msg) return;

  addMessage(msg,"user");
  history.push({role:"user", content:msg});
  input.value="";

  addMessage("AI is typing...","bot");

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions',{
      method:'POST',
      headers:{
        Authorization:`Bearer ${apikey}`,
        'Content-Type':'application/json'
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.2-3b-instruct',
        messages: history,
        max_tokens: 300
      })
    });

    const data = await response.json();
    chatWindow.lastChild.remove(); // remove "AI is typing..."

    const reply = data.choices[0].message.content;
    history.push({role:"assistant", content: reply});
    addMessage(reply,"bot");

  } catch(err){
    chatWindow.lastChild.textContent = "Error: AI did not respond.";
    console.error(err);
  }
}
