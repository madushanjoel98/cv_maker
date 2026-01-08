var gemini_key = localStorage.getItem("gemini_key") || "";
function validate_Key() {
    if (gemini_key.trim() === "" || gemini_key === null) {
        alert("Please enter your Gemini API key.");
        throw new Error("Gemini API key is required.");
    }
}

function getResualt(text) {
    fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-goog-api-key": gemini_key
        },
        body: JSON.stringify({
            contents: [
                {
                    parts: [
                        { text: text }
                    ]
                }
            ]
        })
    })
        .then(res => res.json())
        .then(data => console.log(data))
        .catch(err => console.error(err));

}