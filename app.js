const apikey = "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";

fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
        Authorization: `Bearer ${apikey}`,
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        model: 'meta-llama/llama-3.2-3b-instruct',
        messages: [
            {
                role: 'user',
                content: `tell me about hackathon`
            },
        ],
    }),
})
    .then(res => res.json())
    .then(res => console.log(res.choices[0].message))
    .catch(err => console.log(err));


   