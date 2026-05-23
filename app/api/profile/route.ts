import { NextResponse } from 'next/server';
import { profileData } from '@/lib/profileData';

export async function GET() {
    return NextResponse.json(profileData);
}
