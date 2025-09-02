'use client';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminRedirect() {
  useEffect(() => {
    redirect('/admin/login');
  }, []);

  return null;
}