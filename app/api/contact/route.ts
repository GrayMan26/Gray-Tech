import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, message } = body

    // Basic validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      )
    }

    // Log the contact form submission (in a real app, you'd save to database or send email)
    console.log('Contact form submission:', {
      name,
      email,
      phone,
      message,
      timestamp: new Date().toISOString()
    })

    // In a production app, you would:
    // 1. Save to database
    // 2. Send email notification
    // 3. Send confirmation email to user
    
    return NextResponse.json(
      { message: 'Message sent successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
