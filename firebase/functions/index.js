/**

Firebase Cloud Function for AI Property Concierge

Handles RAG retrieval and OpenAI Chat Completion */ const functions = require("firebase-functions"); const { OpenAI } = require("openai"); const { Pinecone } = require("@pinecone-database/pinecone");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY }); const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });

exports.propertyConcierge = functions.https.onCall(async (data, context) => { const { userQuery, conversationHistory } = data;

// 1. Generate Embedding for the query
const embedding = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: userQuery,
});

// 2. Query Pinecone for context
const index = pc.index("properties");
const queryResponse = await index.query({
    vector: embedding.data[0].embedding,
    topK: 3,
    includeMetadata: true
});

const contextStrings = queryResponse.matches.map(m => 
    `Title: ${m.metadata.title}, Price: ${m.metadata.price}, Area: ${m.metadata.area}, Features: ${m.metadata.features}`
).join("\n");

// 3. Generate AI Response
const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
        { role: "system", content: "You are a luxury real estate advisor in the Gulf region. Use the following property context to answer: " + contextStrings },
        ...conversationHistory,
        { role: "user", content: userQuery }
    ],
});

return {
    reply: response.choices[0].message.content,
    suggestedProperties: queryResponse.matches.map(m => m.id)
};


});