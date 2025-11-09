"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CreditCard, Trash2, Plus, Download } from "lucide-react";

export default function StudentBillingPage() {
  // Mock payment methods
  const paymentMethods = [
    {
      id: "1",
      type: "visa",
      last4: "1234",
      expiry: "12/2025",
      name: "Visa ending in 1234",
    },
    {
      id: "2",
      type: "mtn",
      last4: "123",
      phone: "077 **** 123",
      name: "MTN Mobile Money",
    },
    {
      id: "3",
      type: "airtel",
      last4: "456",
      phone: "075 **** 456",
      name: "Airtel Money",
    },
  ];

  // Mock billing history
  const billingHistory = [
    {
      id: "1",
      date: "2024-07-01",
      description: "Instructor Platform Fee",
      amount: "$49.00",
      status: "Paid",
    },
  ];

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold font-heading">Billing</h1>
      </div>

      {/* Current Plan */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Current Plan</CardTitle>
              <CardDescription>You are currently on the Instructor plan.</CardDescription>
            </div>
            <Button>Upgrade Plan</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Instructor Plan</h3>
                <Badge>Active</Badge>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1 mt-3">
                <li>• Access to all instructor features.</li>
                <li>• Create and manage courses</li>
                <li>• Unlimited student support</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
          <CardDescription>Manage your saved payment methods.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-4">
                  {method.type === "visa" && (
                    <CreditCard className="h-8 w-8 text-primary" />
                  )}
                  {method.type === "mtn" && (
                    <div className="h-8 w-8 rounded-full bg-yellow-500 flex items-center justify-center text-white font-bold text-xs">
                      MTN
                    </div>
                  )}
                  {method.type === "airtel" && (
                    <div className="h-8 w-8 rounded-full bg-red-500 flex items-center justify-center text-white font-bold text-xs">
                      A
                    </div>
                  )}
                  <div>
                    <div className="font-medium">{method.name}</div>
                    {method.expiry && (
                      <div className="text-sm text-muted-foreground">
                        Expires {method.expiry}
                      </div>
                    )}
                    {method.phone && (
                      <div className="text-sm text-muted-foreground">
                        {method.phone}
                      </div>
                    )}
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Add Payment Method
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>View your past invoices and payments.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Invoice</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {billingHistory.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <p className="text-muted-foreground">No billing history</p>
                  </TableCell>
                </TableRow>
              ) : (
                billingHistory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.date}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{item.amount}</TableCell>
                    <TableCell>
                      <Badge className="bg-green-500/10 text-green-600 dark:text-green-400">
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

