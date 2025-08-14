"use client";

import { useState, useEffect } from "react";
import { CreditCard, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ConfirmationDialog } from "./confirmation-dialog";
import { toast } from "sonner";

interface PaymentMethod {
  id: string;
  type: "card";
  last4: string;
  brand: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
}

export function PaymentMethods() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    methodId: string | null;
  }>({ open: false, methodId: null });

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/payment-methods");
      if (response.ok) {
        const methods = await response.json();
        setPaymentMethods(methods);
      }
    } catch (error) {
      toast.error("Failed to load payment methods");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePaymentMethod = async (methodId: string) => {
    try {
      const response = await fetch(`/api/payment-methods/${methodId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setPaymentMethods((prev) => prev.filter((m) => m.id !== methodId));
        toast.success("Payment method removed");
      } else {
        toast.error("Failed to remove payment method");
      }
    } catch (error) {
      toast.error("Failed to remove payment method");
    }
    setDeleteDialog({ open: false, methodId: null });
  };

  const handleSetDefault = async (methodId: string) => {
    try {
      const response = await fetch(`/api/payment-methods/${methodId}/default`, {
        method: "POST",
      });

      if (response.ok) {
        setPaymentMethods((prev) =>
          prev.map((m) => ({ ...m, isDefault: m.id === methodId }))
        );
        toast.success("Default payment method updated");
      } else {
        toast.error("Failed to update default payment method");
      }
    } catch (error) {
      toast.error("Failed to update default payment method");
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
          <CardDescription>Loading payment methods...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>
                Manage your saved payment methods
              </CardDescription>
            </div>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Method
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {paymentMethods.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No payment methods saved</p>
            </div>
          ) : (
            paymentMethods.map((method) => (
              <div
                key={method.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="h-8 w-12 bg-slate-100 dark:bg-slate-800 rounded flex items-center justify-center">
                    <CreditCard className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">
                        {method.brand.toUpperCase()} •••• {method.last4}
                      </span>
                      {method.isDefault && (
                        <Badge variant="secondary">Default</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Expires {method.expiryMonth.toString().padStart(2, "0")}/
                      {method.expiryYear.toString().slice(-2)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {!method.isDefault && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetDefault(method.id)}
                    >
                      Set Default
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setDeleteDialog({ open: true, methodId: method.id })
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <ConfirmationDialog
        open={deleteDialog.open}
        onOpenChange={(open) =>
          setDeleteDialog({ open, methodId: deleteDialog.methodId })
        }
        title="Remove Payment Method"
        description="Are you sure you want to remove this payment method? This action cannot be undone."
        confirmText="Remove"
        variant="destructive"
        onConfirm={() =>
          deleteDialog.methodId &&
          handleDeletePaymentMethod(deleteDialog.methodId)
        }
      />
    </>
  );
}
