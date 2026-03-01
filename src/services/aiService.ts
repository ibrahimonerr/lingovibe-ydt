export const aiService = {
    async generateContent(prompt: string): Promise<string> {
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt }),
        });

        if (!response.ok) {
            let errorMsg = 'Failed to generate content';
            try {
                const errData = await response.json();
                if (errData.error) errorMsg = errData.error;
            } catch (e) { }
            throw new Error(errorMsg);
        }

        const data = await response.json();
        return data.rawText;
    },

    async analyzeText(text: string): Promise<any> {
        const response = await fetch('/api/analyze-text', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text }),
        });

        if (!response.ok) {
            throw new Error('Failed to analyze text');
        }

        return response.json();
    },
};
