"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle } from "lucide-react"
import { TransactionForm } from "@/components/transactionForm"
import { TransactionList } from "@/components/transactionListEnhanced"
import type { Transaction } from "@/types"

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTransactions()
  }, [])

  const fetchTransactions = async () => {
    try {
      const response = await fetch("/api/transactions")
      const data = await response.json()
      setTransactions(data)
    } catch (error) {
      console.error("Error fetching transactions:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddTransaction = async (transaction: Omit<Transaction, "id">) => {
    try {
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transaction),
      })

      if (response.ok) {
        await fetchTransactions()
        setShowForm(false)
      }
    } catch (error) {
      console.error("Error adding transaction:", error)
    }
  }

  const handleEditTransaction = async (transaction: Transaction) => {
    try {
      const response = await fetch(`/api/transactions/${transaction.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transaction),
      })

      if (response.ok) {
        await fetchTransactions()
        setEditingTransaction(null)
      }
    } catch (error) {
      console.error("Error updating transaction:", error)
    }
  }

  const handleDeleteTransaction = async (id: string) => {
    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await fetchTransactions()
      } else {
        console.error("Failed to delete transaction")
      }
    } catch (error) {
      console.error("Error deleting transaction:", error)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground">Manage your financial transactions</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Transaction
        </Button>
      </div>

      {(showForm || editingTransaction) && (
        <Card>
          <CardHeader>
            <CardTitle>{editingTransaction ? "Edit Transaction" : "Add New Transaction"}</CardTitle>
            <CardDescription>
              {editingTransaction
                ? "Update the transaction details below."
                : "Enter the details for your new transaction."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TransactionForm
              transaction={editingTransaction}
              onSubmit={(transaction) => {
                if (editingTransaction) {
                  void handleEditTransaction(transaction as Transaction)
                } else {
                  void handleAddTransaction(transaction as Omit<Transaction, "id">)
                }
              }}
              onCancel={() => {
                setShowForm(false)
                setEditingTransaction(null)
              }}
            />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Transactions</CardTitle>
          <CardDescription>A complete list of your financial transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <TransactionList
            transactions={transactions}
            onEdit={setEditingTransaction}
            onDelete={handleDeleteTransaction}
          />
        </CardContent>
      </Card>
    </div>
  )
}
