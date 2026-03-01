const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI('AIzaSyDugtkFoFl4n_Iww6RIC2GL1r9T5WgsQqg');
async function run() {
  const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models?key=AIzaSyDugtkFoFl4n_Iww6RIC2GL1r9T5WgsQqg');
  const data = await response.json();
  console.log(data.models.map(m => m.name).join('\n'));
}
run();
