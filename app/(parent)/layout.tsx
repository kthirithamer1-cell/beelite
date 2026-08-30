import * as React from 'react';
import { AppLayout } from '@/components/layout/app-layout';

export default function ParentLayout({ children }: { children: React.ReactNode }) {
  return <AppLayout role="PARENT">{children}</AppLayout>;
}
