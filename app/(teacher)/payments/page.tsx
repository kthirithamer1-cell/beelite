import { getStudents } from '@/actions/students';
import { getPayments } from '@/actions/payments';
import { PaymentManager } from '@/components/payments/payment-manager';

export const dynamic = 'force-dynamic';

export default async function PaymentsPage() {
  const [students, payments] = await Promise.all([
    getStudents(),
    getPayments(new Date().getMonth() + 1, new Date().getFullYear()),
  ]);

  return <PaymentManager initialStudents={students} initialPayments={payments} />;
}
