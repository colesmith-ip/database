import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/app/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { email, password, role } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    console.log('Creating user:', email, 'with role:', role);

    // Create user with password instead of invitation
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
      user_metadata: { role: role || 'user' }
    });

    if (error) {
      console.error('User creation error:', error);
      return NextResponse.json({ 
        error: error.message,
        details: error.status || 'unknown',
        code: error.code || 'unknown'
      }, { status: 500 });
    }

    console.log('User creation successful:', data.user);
    return NextResponse.json({ success: true, user: data.user });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}
