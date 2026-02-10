const apikey = "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";

const input = document.getElementById('userInput');
const button = document.getElementById('sendBtn');
const chatWindow = document.getElementById('searchbar');

let history = [];
let loading = false;



// EVENTS
button.addEventListener('click', sendMessage);

input.addEventListener('keypress', (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        sendMessage();
    }
});


// UI MESSAGE RENDER

function addMessage(text, type) {

    const div = document.createElement('div');

    if (type === "bot") {
        div.className =
            "bg-[#303030] mr-auto max-w-2xl p-3 rounded-lg text-white";
    } else {
        div.className =
            "bg-blue-600 ml-auto max-w-md p-3 rounded-lg text-white";
    }

    div.textContent = text;
    chatWindow.appendChild(div);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}



// MAIN FUNCTION

async function sendMessage() {

    if (loading) return;

    const msg = input.value.trim();
    if (!msg) return;

    loading = true;
    button.disabled = true;

    // store history but DON'T render user message
    history.push({
        role: "user",
        content: msg
    });

    input.value = "";

    // typing indicator
    addMessage("Typing...", "bot");

    try {

        await new Promise(r => setTimeout(r, 700));

        const response = await fetch(
            'https://openrouter.ai/api/v1/chat/completions',
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${apikey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'liquid/lfm-2.5-1.2b-instruct:free',
                    messages: history,
                    max_tokens: 300
                })
            }
        );

        const data = await response.json();
        console.log(data);

        // remove typing message
        chatWindow.lastChild.remove();

        // error handling
        if (!response.ok) {
            addMessage(
                "API Error: " +
                (data.error?.message || "Request Failed"),
                "bot"
            );
            loading = false;
            button.disabled = false;
            return;
        }

        if (!data.choices || !data.choices.length) {
            addMessage("No response from model", "bot");
            loading = false;
            button.disabled = false;
            return;
        }

        const reply = data.choices[0].message.content;

        history.push({
            role: "assistant",
            content: reply
        });

        addMessage(reply, "bot");

    } catch (err) {
        console.error(err);
        chatWindow.lastChild.remove();
        addMessage("Network error occurred", "bot");
    }

    loading = false;
    button.disabled = false;
}





