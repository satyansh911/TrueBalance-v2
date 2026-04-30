"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Transaction } from "@/types"
import { CATEGORIES } from "@/types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { LottieSafeWrapper } from "./lottie-safe-wrapper"
import { DeleteConfirmation } from "./deleteConfirmation"
import { Button as UIButton } from "@/components/ui/button"

interface TransactionListProps {
  transactions: Transaction[]
  onEdit: (transaction: Transaction) => void
  onDelete: (id: string) => void
}

type SortField = "date" | "amount" | "category"
type SortOrder = "asc" | "desc"

export function TransactionList({ transactions, onEdit, onDelete }: TransactionListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [sortField, setSortField] = useState<SortField>("date")
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc")
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; isOpen: boolean }>({
    id: "",
    isOpen: false,
  })

  const filteredAndSortedTransactions = useMemo(() => {
    let filtered = transactions.filter((t) => {
      const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === "all" || t.category === selectedCategory
      return matchesSearch && matchesCategory
    })

    filtered.sort((a, b) => {
      let aValue: number | string = 0
      let bValue: number | string = 0

      if (sortField === "date") {
        aValue = new Date(a.date).getTime()
        bValue = new Date(b.date).getTime()
      } else if (sortField === "amount") {
        aValue = a.amount
        bValue = b.amount
      } else if (sortField === "category") {
        aValue = a.category
        bValue = b.category
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1
      return 0
    })

    return filtered
  }, [transactions, searchTerm, selectedCategory, sortField, sortOrder])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortOrder("asc")
    }
  }

  const handleDeleteClick = (id: string) => {
    setDeleteConfirm({ id, isOpen: true })
  }

  const handleConfirmDelete = () => {
    onDelete(deleteConfirm.id)
    setDeleteConfirm({ id: "", isOpen: false })
  }

  const SortIndicator = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null
    return sortOrder === "asc" ? " ↑" : " ↓"
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No transactions found.</p>
        <p className="text-sm text-muted-foreground mt-1">Add your first transaction to get started.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-2">
          <label className="text-sm font-medium">Search Description</label>
          <Input
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Filter by Category</label>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Sort By</label>
          <Select value={sortField} onValueChange={(value) => setSortField(value as SortField)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date {sortField === "date" && (sortOrder === "asc" ? "↑" : "↓")}</SelectItem>
              <SelectItem value="amount">Amount {sortField === "amount" && (sortOrder === "asc" ? "↑" : "↓")}</SelectItem>
              <SelectItem value="category">Category {sortField === "category" && (sortOrder === "asc" ? "↑" : "↓")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredAndSortedTransactions.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No transactions match your filters.</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            Showing {filteredAndSortedTransactions.length} of {transactions.length} transactions
          </p>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <button onClick={() => handleSort("date")} className="hover:underline">
                      Date
                      <SortIndicator field="date" />
                    </button>
                  </TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">
                    <button onClick={() => handleSort("amount")} className="hover:underline">
                      Amount
                      <SortIndicator field="amount" />
                    </button>
                  </TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">{new Date(transaction.date).toLocaleDateString()}</TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{transaction.category}</Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">${transaction.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <UIButton variant="ghost" size="sm" onClick={() => onEdit(transaction)}>
                          <LottieSafeWrapper
                            src="/edit.json"
                            size={24}
                            autoplay={true}
                            loop={true}
                            fallbackIcon="✏️"
                          />
                        </UIButton>
                        <UIButton
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClick(transaction.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <LottieSafeWrapper
                            src="/delete.json"
                            size={24}
                            autoplay={true}
                            loop={true}
                            fallbackIcon="🗑️"
                          />
                        </UIButton>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}

      <DeleteConfirmation
        isOpen={deleteConfirm.isOpen}
        title="Delete Transaction"
        description="This transaction will be permanently deleted. This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteConfirm({ id: "", isOpen: false })}
      />
    </div>
  )
}
