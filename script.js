async function gerar() {

    const msg = document.getElementById("msg").value;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": "Bearer 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",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "llama-3.1-8b-instant",
            messages: [
                { 
                    role: "system", 
                    content: "Você é um gerador de CSS. Responda apenas com CSS puro, sem HTML, sem <style>, sem explicações."
                },
                { 
                    role: "user",
                    content: msg
                }
            ]
        })
    });

    const data = await response.json();

    console.log(data);

    if (!data.choices) {
        document.getElementById("res").innerText =
            "Erro: " + (data.error?.message || "requisição falhou");
        return;
    }

    const css = data.choices[0].message.content;

    document.getElementById("res").innerText = css;

// tenta detectar classe ou id no CSS
    let previewHTML = `<div>Preview</div>`;

    const classMatch = css.match(/\.([a-zA-Z0-9_-]+)/);
    const idMatch = css.match(/#([a-zA-Z0-9_-]+)/);

    if (classMatch) {
        previewHTML = `<div class="${classMatch[1]}">Preview</div>`;
    } else if (idMatch) {
        previewHTML = `<div id="${idMatch[1]}">Preview</div>`;
    }

// iframe preview
    const iframe = document.getElementById("preview");
    const doc = iframe.contentDocument || iframe.contentWindow.document;


    const res = document.getElementById("res");
    const preview = document.getElementById("preview");

    res.style.display = "block";
    preview.style.display = "block";

    setTimeout(() => {
        res.style.opacity = "1";
        preview.style.opacity = "1";
    }, 50);


    doc.open();
    doc.write(`
    <html>
    <head>
        <style>
            body {
                display:flex;
                justify-content:center;
                align-items:center;
                height:100vh;
                background:#111;
                color:white;
            }
            ${css}
        </style>
    </head>
    <body>
        ${previewHTML}
    </body>
    </html>
    `);
    doc.close();
}