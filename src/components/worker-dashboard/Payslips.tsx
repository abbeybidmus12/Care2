import React from "react";
import Header from "../dashboard/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface PayslipDeduction {
  type: string;
  amount: number;
}

interface Payslip {
  id: string;
  period: string;
  totalHours: number;
  basicPay: number;
  overtimePay: number;
  holidayPay: number;
  nationalInsurance: number;
  incomeTax: number;
  otherDeductions: PayslipDeduction[];
  netPay: number;
  status: "pending" | "approved";
}

const mockPayslips: Record<"pending" | "approved", Payslip[]> = {
  pending: [
    {
      id: "PS001",
      period: "March 2024",
      totalHours: 160,
      basicPay: 3200,
      overtimePay: 450,
      holidayPay: 200,
      nationalInsurance: 280,
      incomeTax: 420,
      otherDeductions: [
        { type: "Student Loan", amount: 150 },
        { type: "Pension", amount: 100 },
      ],
      netPay: 2900,
      status: "pending",
    },
  ],
  approved: [
    {
      id: "PS002",
      period: "February 2024",
      totalHours: 152,
      basicPay: 3040,
      overtimePay: 300,
      holidayPay: 180,
      nationalInsurance: 260,
      incomeTax: 400,
      otherDeductions: [
        { type: "Student Loan", amount: 150 },
        { type: "Pension", amount: 100 },
      ],
      netPay: 2610,
      status: "approved",
    },
  ],
};

const PayslipDetails = ({ payslip }: { payslip: Payslip }) => {
  const totalEarnings =
    payslip.basicPay + payslip.overtimePay + payslip.holidayPay;
  const totalDeductions =
    payslip.nationalInsurance +
    payslip.incomeTax +
    payslip.otherDeductions.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-4">
          <h4 className="font-semibold text-lg">Earnings</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Basic Pay ({payslip.totalHours} hours)</span>
              <span>£{payslip.basicPay.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Overtime Pay</span>
              <span>£{payslip.overtimePay.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Holiday Pay</span>
              <span>£{payslip.holidayPay.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-medium pt-2 border-t">
              <span>Total Earnings</span>
              <span>£{totalEarnings.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold text-lg">Deductions</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>National Insurance</span>
              <span>£{payslip.nationalInsurance.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Income Tax</span>
              <span>£{payslip.incomeTax.toFixed(2)}</span>
            </div>
            {payslip.otherDeductions.map((deduction, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span>{deduction.type}</span>
                <span>£{deduction.amount.toFixed(2)}</span>
              </div>
            ))}
            <div className="flex justify-between font-medium pt-2 border-t">
              <span>Total Deductions</span>
              <span>£{totalDeductions.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t">
        <div className="flex justify-between font-semibold text-lg">
          <span>Net Pay</span>
          <span className="text-green-600">£{payslip.netPay.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Download PDF
        </Button>
      </div>
    </div>
  );
};

const PayslipTable = ({ payslips }: { payslips: Payslip[] }) => (
  <div className="rounded-md border">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Payslip ID</TableHead>
          <TableHead>Period</TableHead>
          <TableHead>Hours</TableHead>
          <TableHead>Gross Pay</TableHead>
          <TableHead>Deductions</TableHead>
          <TableHead>Net Pay</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {payslips.map((payslip) => {
          const grossPay =
            payslip.basicPay + payslip.overtimePay + payslip.holidayPay;
          const totalDeductions =
            payslip.nationalInsurance +
            payslip.incomeTax +
            payslip.otherDeductions.reduce((acc, curr) => acc + curr.amount, 0);

          return (
            <TableRow key={payslip.id}>
              <TableCell>{payslip.id}</TableCell>
              <TableCell>{payslip.period}</TableCell>
              <TableCell>{payslip.totalHours}</TableCell>
              <TableCell>£{grossPay.toFixed(2)}</TableCell>
              <TableCell>£{totalDeductions.toFixed(2)}</TableCell>
              <TableCell>£{payslip.netPay.toFixed(2)}</TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <FileText className="w-4 h-4 mr-2" />
                      View
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>
                        Payslip Details - {payslip.period}
                      </DialogTitle>
                    </DialogHeader>
                    <PayslipDetails payslip={payslip} />
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  </div>
);

export default function Payslips() {
  return (
    <div className="flex flex-col bg-gradient-to-br from-slate-50/50 to-slate-100/50 min-h-screen">
      <div className="sticky top-0 z-40">
        <Header title="Payslips" showWorkerName />
      </div>
      <div className="p-6">
        <div className="w-full bg-white/95 rounded-lg border shadow-sm p-6 backdrop-blur supports-[backdrop-filter]:bg-white/80">
          <PayslipTable
            payslips={[...mockPayslips.pending, ...mockPayslips.approved]}
          />
        </div>
      </div>
    </div>
  );
}
