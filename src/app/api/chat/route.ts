import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { message } = await request.json();
    console.log('Received message:', message);
    console.log('API Key:', process.env.HUGGINGFACE_API_KEY ? 'Present' : 'Missing');

    // Format the chat message with proper system prompt and user message
    const formattedMessage = `<|system|>You are Emma, a helpful and friendly AI assistant. Provide clear, accurate, and natural responses.</s>

    // Make a request to the Hugging Face Inference API
    const response = await fetch('https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-alpha', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
      },
      body: JSON.stringify({
        inputs: formattedMessage + message,
        parameters: {
          max_new_tokens: 1000,
          temperature: 0.7,
          top_p: 0.95,
          do_sample: true,
          return_full_text: false
        }
      }),
    });

    const responseText = await response.text();
    console.log('API Response status:', response.status);
    console.log('API Response:', responseText);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}, response: ${responseText}`);
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('Error parsing JSON:', e);
      return NextResponse.json({ reply: responseText });
    }

    // Extract the generated text from the response
    const reply = Array.isArray(data) ? data[0]?.generated_text : data.generated_text;
    console.log('Generated reply:', reply);

    return NextResponse.json({ reply: reply || 'I apologize, but I am unable to provide a response at the moment.' });
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'Failed to process your request', details: error.message },
      { status: 500 }
    );
  }
}
