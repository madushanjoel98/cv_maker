var gemini_key = localStorage.getItem("gemini_key") || "";
function validate_Key() {
    if (gemini_key.trim() === "" || gemini_key === null) {
        alert("Please enter your Gemini API key.");
        throw new Error("Gemini API key is required.");
    }
}

async function getGeminiResponse(prompt) {
    if (!gemini_key) {
        gemini_key = localStorage.getItem("gemini_key");
    }

    if (!gemini_key) {
        throw new Error("Gemini API key is missing. Please set it in Settings.");
    }

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${gemini_key}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }]
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || "Failed to fetch response from Gemini");
        }

        const data = await response.json();

        if (data.candidates && data.candidates.length > 0 && data.candidates[0].content && data.candidates[0].content.parts.length > 0) {
            return data.candidates[0].content.parts[0].text;
        } else {
            throw new Error("No content returned from Gemini");
        }
    } catch (error) {
        console.error("Gemini API Error:", error);
        throw error;
    }
}

function setGeminiKey(key) {
    if (key) {
        localStorage.setItem("gemini_key", key);
        gemini_key = key;
        return true;
    }
    return false;
}