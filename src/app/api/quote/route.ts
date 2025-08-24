import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the request body
    const { input_currency, input_amount, output_currency } = body;
    
    if (!input_currency || !input_amount || !output_currency) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Make the API call to Request Finance from the server side
    const response = await fetch('https://core-api.pay.so/v1/conversions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer 708e2859c05c4ca6bf8a5b29d555320c',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        conversion: {
          input_currency,
          input_amount,
          output_currency,
          output_amount: null,
          mode: 'sending'
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return NextResponse.json(
        { 
          error: errorData?.message || `API Error: ${response.status} ${response.statusText}`,
          status: response.status 
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Quote API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
