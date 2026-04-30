"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle } from "lucide-react"
import { BudgetForm } from "@/components/budgetForm"
import { BudgetList } from "@/components/budgetListEnhanced"
import { BudgetVsActualChart } from "@/components/budgetVsActual"
import { SpendingInsights } from "@/components/spendingInsights"
import type { Budget, Transaction } from "@/types"

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [budgetsRes, transactionsRes] = await Promise.all([fetch("/api/budgets"), fetch("/api/transactions")])

      const budgetsData = await budgetsRes.json()
      const transactionsData = await transactionsRes.json()

      setBudgets(budgetsData)
      setTransactions(transactionsData)
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddBudget = async (budget: Omit<Budget, "id">) => {
    try {
      const response = await fetch("/api/budgets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(budget),
      })

      if (response.ok) {
        await fetchData()
        setShowForm(false)
      }
    } catch (error) {
      console.error("Error adding budget:", error)
    }
  }

  const handleEditBudget = async (budget: Budget | Omit<Budget, "id">) => {
    try {
      // Ensure budget has an id before making the PUT request
      if (!("id" in budget)) {
        console.error("Cannot edit budget: missing id")
        return
      }
      const response = await fetch(`/api/budgets/${budget.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(budget),
      })

      if (response.ok) {
        await fetchData()
        setEditingBudget(null)
      }
    } catch (error) {
      console.error("Error updating budget:", error)
    }
  }

  const handleDeleteBudget = async (id: string) => {
    try {
      const response = await fetch(`/api/budgets/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await fetchData()
      }
    } catch (error) {
      console.error("Error deleting budget:", error)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Budgets</h1>
          <p className="text-muted-foreground">Set and track your monthly spending budgets</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Budget
        </Button>
      </div>

      {(showForm || editingBudget) && (
        <Card>
          <CardHeader>
            <CardTitle>{editingBudget ? "Edit Budget" : "Add New Budget"}</CardTitle>
            <CardDescription>
              {editingBudget ? "Update the budget details below." : "Set a monthly budget for a category."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BudgetForm
              budget={editingBudget}
              onSubmit={editingBudget ? handleEditBudget : handleAddBudget}
              onCancel={() => {
                setShowForm(false)
                setEditingBudget(null)
              }}
            />
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Budget vs Actual</CardTitle>
            <CardDescription>Compare your budgets with actual spending</CardDescription>
          </CardHeader>
          <CardContent>
            <BudgetVsActualChart budgets={budgets} transactions={transactions} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Spending Insights</CardTitle>
            <CardDescription>Analysis of your spending patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <SpendingInsights budgets={budgets} transactions={transactions} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Budgets</CardTitle>
          <CardDescription>Manage your monthly category budgets</CardDescription>
        </CardHeader>
        <CardContent>
          <BudgetList
            budgets={budgets}
            transactions={transactions}
            onEdit={setEditingBudget}
            onDelete={handleDeleteBudget}
          />
        </CardContent>
      </Card>
    </div>
  )
}
