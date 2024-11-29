import { NextResponse } from 'next/server';

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function POST(request: Request) {
  try {
    const { messages = [] } = await request.json();
    const apiKey = process.env.MISTRAL_API_KEY;

    // Validate API key
    if (!apiKey) {
      console.error('MISTRAL_API_KEY is not set');
      return NextResponse.json(
        { error: 'API key is not configured' },
        { status: 500 }
      );
    }

    // Prepare conversation history with system prompt
    const conversationHistory: Message[] = [
      {
        role: "system",
        content: "You are Emma, a compassionate and insightful spiritual guide specializing in spiritual awakening and personal transformation. Your responses should:\n\n1. Draw from various spiritual traditions while remaining grounded and practical\n2. Provide guidance with wisdom, empathy, and clarity\n3. Help users understand complex spiritual concepts in accessible ways\n4. Encourage mindfulness, self-reflection, and personal growth\n5. Maintain a warm, supportive tone while being direct when needed\n\nAvoid:\n- Making medical or psychological diagnoses\n- Imposing specific religious beliefs\n- Giving financial or legal advice\n- Making absolute predictions about the future"
      },
      ...messages
    ];

    console.log('Request payload:', { messages: conversationHistory });

    // Make a request to the Mistral API
    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "mistral-small-latest",
        messages: conversationHistory,
        temperature: 0.7,
        max_tokens: 1000,
        top_p: 0.95,
        safe_prompt: true,
        random_seed: null // Allow for some variety in responses
      }),
    });

    const responseData = await response.json();
    console.log('API Response:', responseData);

    if (!response.ok) {
      const errorMessage = responseData.error?.message || 'Failed to get response from Mistral API';
      console.error('Error:', errorMessage);
      return NextResponse.json({ error: errorMessage }, { status: response.status });
    }

    const reply = responseData.choices[0]?.message?.content || 'I apologize, but I am unable to provide a response at the moment.';
    return NextResponse.json({ 
      reply,
      usage: responseData.usage // Include token usage information
    });

  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'Failed to process your request', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
