import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Use service role for server-side operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      installer_id,
      homeowner_name,
      homeowner_email,
      homeowner_phone,
      postcode,
      property_type,
      property_age,
      has_epc,
      epc_rating,
      current_heating,
      timeline,
      message,
    } = body;

    // Validation
    if (!homeowner_name || !homeowner_email || !postcode) {
      return NextResponse.json(
        { error: 'Name, email, and postcode are required' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(homeowner_email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Get the heat-pump vertical ID
    const { data: vertical } = await supabase
      .from('verticals')
      .select('id')
      .eq('slug', 'heat-pump')
      .single();

    if (!vertical) {
      return NextResponse.json(
        { error: 'Service configuration error' },
        { status: 500 }
      );
    }

    // Insert lead
    const { data: lead, error } = await supabase
      .from('leads')
      .insert({
        vertical_id: vertical.id,
        installer_id: installer_id || null,
        homeowner_name,
        homeowner_email,
        homeowner_phone: homeowner_phone || null,
        postcode: postcode.toUpperCase(),
        property_type: property_type || null,
        property_age: property_age || null,
        has_epc: has_epc ?? null,
        epc_rating: epc_rating || null,
        current_heating: current_heating || null,
        timeline: timeline || null,
        message: message || null,
        status: 'new',
      })
      .select()
      .single();

    if (error) {
      console.error('Lead insert error:', error);
      return NextResponse.json(
        { error: 'Failed to submit enquiry' },
        { status: 500 }
      );
    }

    // TODO (Milestone B): Send email notification to matched installer(s)

    return NextResponse.json(
      { success: true, id: lead.id },
      { status: 201 }
    );
  } catch (err) {
    console.error('Lead API error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
