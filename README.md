Gulf PropTech AI Assistant

This project integrates a RAG-based AI concierge into a FlutterFlow mobile application using Firebase as the backend.

Setup Instructions

Firebase: Deploy the propertyConcierge Cloud Function with your OpenAI and Pinecone API keys.

Pinecone: Create an index with 1536 dimensions (for OpenAI embeddings).

FlutterFlow:

Create a Custom Action using the provided Dart code.

Build a Chat UI that stores messages in a Firestore sub-collection.

Trigger the Custom Action on "Send" and update the state with the AI's reply.

Key Features

Semantic Matching: Finds properties based on intent (e.g., "Good for a family of four") rather than just keywords.

Context Awareness: Remembers the specific city or price range discussed earlier.

Lead Gen: Automatically identifies high-intent users and flags them in the CRM.