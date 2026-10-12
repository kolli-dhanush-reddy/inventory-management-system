'use client'

import React, { useState, useMemo, useEffect } from 'react'
import {
  Boxes,
  AlertTriangle,
  TrendingUp,
  Search,
  Filter,
  ArrowUpDown,
  Plus,
  Minus,
  RefreshCw,
  PackageCheck,
  PackageX,
  ExternalLink,
  ChevronRight,
  CheckCircle2,
  Sparkles,
  Layers,
  ArrowUpRight,
  X,
  SlidersHorizontal,
  Download
} from 'lucide-react'

// ============================================================================
// TYPES & DATA CONTRACTS
// ============================================================================

export type StockStatus = 'optimal' | 'low' | 'critical' | 'out_of_stock'

export interface InventoryItem {
  id: string
  sku: string
  name: string
  category: 'Electronics' | 'Machinery' | 'Packaging' | 'Raw Materials'
  stock: number
  minThreshold: number
  maxCapacity: number
  unitCost: number
  location: string
  status: StockStatus
  lastUpdated: string
}

const INITIAL_ITEMS: InventoryItem[] = [
  {
    id: 'inv-1',
    sku: 'ELC-9042',
    name: 'Precision Micro-controller v4',
    category: 'Electronics',
    stock: 14,
    minThreshold: 25,
    maxCapacity: 200,
    unitCost: 48.5,
    location: 'Aisle 3, Bin B-12',
    status: 'low',
    lastUpdated: '12m ago',
  },
  {
    id: 'inv-2',
    sku: 'RAW-1089',
    name: 'Anodized Aluminum Chassis',
    category: 'Raw Materials',
    stock: 142,
    minThreshold: 40,
    maxCapacity: 300,
    unitCost: 112.0,
    location: 'Bay 7, Rack 4',
    status: 'optimal',
    lastUpdated: '1h ago',
  },
  {
    id: 'inv-3',
    sku: 'ELC-7721',
    name: 'Optic Sensor Array 120Hz',
    category: 'Electronics',
    stock: 3,
    minThreshold: 20,
    maxCapacity: 150,
    unitCost: 89.2,
    location: 'Aisle 2, Bin C-01',
    status: 'critical',
    lastUpdated: 'Just now',
  },
  {
    id: 'inv-4',
    sku: 'PKG-3004',
    name: 'Anti-Static ESD Protective Bags',
    category: 'Packaging',
    stock: 0,
    minThreshold: 100,
    maxCapacity: 1500,
    unitCost: 1.25,
    location: 'Warehouse Dock A',
    status: 'out_of_stock',
    lastUpdated: '4h ago',
  },
  {
    id: 'inv-5',
    sku: 'MCH-5510',
    name: 'Brushless Servo Motor 48V',
    category: 'Machinery',
    stock: 58,
    minThreshold: 15,
    maxCapacity: 100,
    unitCost: 215.0,
    location: 'Vault 1, Sec D',
    status: 'optimal',
    lastUpdated: '32m ago',
  },
  {
    id: 'inv-6',
    sku: 'RAW-4402',
    name: 'Thermal Interface Silicone Pads',
    category: 'Raw Materials',
    stock: 22,
    minThreshold: 50,
    maxCapacity: 500,
    unitCost: 6.4,
    location: 'Aisle 4, Bin A-08',
    status: 'low',
    lastUpdated: '2h ago',
  },
]

// ============================================================================
// COMPONENT: InventoryStockDashboard
// Designed with Modern Dark Mode (Slate #0F172A), Indigo #6366F1 Accent Glow,
// Tactile Micro-Interactions, and High-Performance CSS Transitions.
// ============================================================================

export default function InventoryStockDashboard() {
  const [items, setItems] = useState<InventoryItem[]>(INITIAL_ITEMS)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)
  const [restockModalItem, setRestockModalItem] = useState<InventoryItem | null>(null)
  const [restockAmount, setRestockAmount] = useState<number>(25)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Auto-dismiss notification toasts
  useEffect(() => {
    if (!toastMessage) return
    const timer = setTimeout(() => setToastMessage(null), 3500)
    return () => clearTimeout(timer)
  }, [toastMessage])

  // Aggregate Key Metrics
  const metrics = useMemo(() => {
    const totalCount = items.length
    const totalInventoryUnits = items.reduce((acc, i) => acc + i.stock, 0)
    const lowCount = items.filter((i) => i.status === 'low' || i.status === 'critical').length
    const outCount = items.filter((i) => i.status === 'out_of_stock').length
    const valuation = items.reduce((acc, i) => acc + i.stock * i.unitCost, 0)
    const healthPercentage = Math.round(
      ((totalCount - (lowCount + outCount)) / (totalCount || 1)) * 100
    )

    return {
      totalCount,
      totalInventoryUnits,
      lowCount,
      outCount,
      valuation,
      healthPercentage,
    }
  }, [items])

  // Filtered Items logic
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory

      const matchesStatus =
        statusFilter === 'all'
          ? true
          : statusFilter === 'attention'
          ? item.status === 'low' || item.status === 'critical' || item.status === 'out_of_stock'
          : item.status === statusFilter

      return matchesSearch && matchesCategory && matchesStatus
    })
  }, [items, searchQuery, selectedCategory, statusFilter])

  // Stock adjustment handlers with instant tactile state update
  const handleAdjustStock = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item
        const newStock = Math.max(0, item.stock + delta)
        let status: StockStatus = 'optimal'
        if (newStock === 0) status = 'out_of_stock'
        else if (newStock <= item.minThreshold * 0.3) status = 'critical'
        else if (newStock <= item.minThreshold) status = 'low'

        return {
          ...item,
          stock: newStock,
          status,
          lastUpdated: 'Just now',
        }
      })
    )
  }

  // Confirm restock modal submission
  const handleExecuteRestock = () => {
    if (!restockModalItem) return
    const id = restockModalItem.id
    const amount = Number(restockAmount) || 0

    handleAdjustStock(id, amount)
    setToastMessage(`Successfully replenished +${amount} units for ${restockModalItem.sku}`)
    setRestockModalItem(null)
  }

  return (
    <section
      aria-label="Real-Time Inventory and Stock Management Dashboard"
      className="relative w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 rounded-3xl bg-[#0B0F19] border border-slate-800/80 text-slate-100 shadow-2xl backdrop-blur-xl overflow-hidden font-sans"
    >
      {/* Background Ambient Glow Accents */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 -right-40 w-96 h-96 bg-indigo-600/15 rounded-full blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-600/10 rounded-full blur-[120px]"
      />

      {/* ==================================================================== */}
      {/* HEADER SECTION */}
      {/* ==================================================================== */}
      <header className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/70">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-semibold tracking-wider uppercase text-emerald-400">
              Live Stock Telemetry
            </span>
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            Inventory Operations Hub
            <Sparkles className="w-5 h-5 text-indigo-400 inline" />
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Monitor real-time stock availability, replenish deficits, and prevent supply disruption.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setItems(INITIAL_ITEMS)
              setToastMessage('Inventory telemetry data re-synchronized.')
            }}
            /*
              INTERACTION SPEC:
              - Smooth 200ms transition
              - Hover scale: 1.02 with slight background opacity shift
              - Active press: scale 0.98
              - Focus ring for keyboard accessibility
            */
            className="group inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-xl bg-slate-800/70 hover:bg-slate-700/80 active:scale-[0.98] hover:scale-[1.02] text-slate-200 border border-slate-700/80 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500/70 focus:ring-offset-2 focus:ring-offset-slate-900 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-400 group-hover:rotate-180 transition-transform duration-500 ease-in-out" />
            <span>Reset Demo</span>
          </button>

          <button
            type="button"
            onClick={() => {
              const csvContent =
                'data:text/csv;charset=utf-8,' +
                ['SKU,Name,Category,Stock,MinThreshold,Location,Status']
                  .concat(
                    items.map(
                      (i) =>
                        `${i.sku},"${i.name}",${i.category},${i.stock},${i.minThreshold},"${i.location}",${i.status}`
                    )
                  )
                  .join('\n')
              const encodedUri = encodeURI(csvContent)
              const link = document.createElement('a')
              link.setAttribute('href', encodedUri)
              link.setAttribute('download', `inventory_report_${Date.now()}.csv`)
              document.body.appendChild(link)
              link.click()
              document.body.removeChild(link)
              setToastMessage('Stock ledger CSV export generated successfully.')
            }}
            /*
              INTERACTION SPEC:
              Primary Call-To-Action button with subtle gradient, 200ms duration,
              scale 1.02 on hover, 0.98 on click.
            */
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] hover:scale-[1.02] text-white shadow-lg shadow-indigo-600/30 border border-indigo-400/30 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-slate-900 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Manifest</span>
          </button>
        </div>
      </header>

      {/* ==================================================================== */}
      {/* METRICS OVERVIEW CARDS (Animated Slide & Fade Up) */}
      {/* ==================================================================== */}
      <section
        aria-label="Inventory Key Performance Indicators"
        className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-6"
      >
        {/* Card 1: Total Valuation */}
        <article className="group relative p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/50 shadow-lg hover:shadow-indigo-500/10 transition-all duration-200 ease-in-out hover:scale-[1.01]">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Portfolio Valuation</span>
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-white">
            ${metrics.valuation.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
            <ArrowUpRight className="w-3 h-3" />
            <span>+4.8% vs last closing cycle</span>
          </div>
        </article>

        {/* Card 2: Units In Warehouse */}
        <article className="group relative p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 shadow-lg transition-all duration-200 ease-in-out hover:scale-[1.01]">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Active SKUs / Units</span>
            <div className="p-1.5 rounded-lg bg-slate-800 text-slate-300">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-white">
            {metrics.totalInventoryUnits}{' '}
            <span className="text-xs font-normal text-slate-400">units across {metrics.totalCount} SKUs</span>
          </p>
          <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-400">
            <span className="w-2 h-2 rounded-full bg-indigo-400 inline-block" />
            <span>Operational logistics normal</span>
          </div>
        </article>

        {/* Card 3: Stock Health Score */}
        <article className="group relative p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-emerald-500/40 shadow-lg transition-all duration-200 ease-in-out hover:scale-[1.01]">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Inventory Health Index</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <PackageCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-white">
            {metrics.healthPercentage}%
          </p>
          {/* Health Progress Indicator */}
          <div className="mt-2 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ease-out rounded-full ${
                metrics.healthPercentage > 75
                  ? 'bg-emerald-500'
                  : metrics.healthPercentage > 50
                  ? 'bg-amber-500'
                  : 'bg-rose-500'
              }`}
              style={{ width: `${metrics.healthPercentage}%` }}
            />
          </div>
        </article>

        {/* Card 4: Actionable Stock Deficits */}
        <article className="group relative p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-amber-500/50 shadow-lg transition-all duration-200 ease-in-out hover:scale-[1.01]">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Critical & Deficits</span>
            <div className="relative p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <AlertTriangle className="w-4 h-4" />
              {metrics.lowCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500" />
                </span>
              )}
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-white flex items-baseline gap-2">
            {metrics.lowCount + metrics.outCount}
            <span className="text-xs font-normal text-rose-400">
              ({metrics.outCount} depleted)
            </span>
          </p>
          <div className="mt-2 text-[11px] text-amber-300 font-medium">
            Requires restocking intervention
          </div>
        </article>
      </section>

      {/* ==================================================================== */}
      {/* FILTER & DISCOVERY TOOLBAR */}
      {/* ==================================================================== */}
      <nav
        aria-label="Stock Search and Filtering Toolbar"
        className="relative z-10 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between p-3 rounded-2xl bg-slate-900/80 border border-slate-800/80 shadow-md mb-4"
      >
        {/* Search Input with Keyboard Focus Accent */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by SKU, item description, or storage bay..."
            className="w-full pl-9 pr-8 py-2 text-xs rounded-xl bg-slate-950/70 border border-slate-800 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/80 focus:border-indigo-500 transition-all duration-200 ease-in-out"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Pill Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {['All', 'Electronics', 'Raw Materials', 'Machinery', 'Packaging'].map((cat) => {
            const isActive = selectedCategory === cat
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                /*
                  INTERACTION SPEC:
                  Filter pill with 200ms ease-in-out transition,
                  scale 1.02 on hover, 0.98 on active tap, and clear focus ring.
                */
                className={`whitespace-nowrap px-3 py-1.5 text-xs font-medium rounded-xl transition-all duration-200 ease-in-out active:scale-[0.98] hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-indigo-500/70 cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 border border-indigo-400/40'
                    : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-transparent'
                }`}
              >
                {cat}
              </button>
            )
          })}
        </div>

        {/* Status Quick Filter */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none pl-3 pr-8 py-1.5 text-xs font-medium rounded-xl bg-slate-950/70 border border-slate-800 text-slate-300 hover:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/70 cursor-pointer transition-colors"
            >
              <option value="all">All Statuses</option>
              <option value="optimal">In Stock Only</option>
              <option value="attention">Needs Attention</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
            <SlidersHorizontal className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </nav>

      {/* ==================================================================== */}
      {/* INTERACTIVE DATA TABLE */}
      {/* ==================================================================== */}
      <div className="relative z-10 w-full overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/40 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300 border-collapse">
            {/* Table Header */}
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/80 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                <th scope="col" className="py-3 px-4">Item & SKU</th>
                <th scope="col" className="py-3 px-4">Category</th>
                <th scope="col" className="py-3 px-4">Stock Status</th>
                <th scope="col" className="py-3 px-4">Current Units</th>
                <th scope="col" className="py-3 px-4">Unit Cost</th>
                <th scope="col" className="py-3 px-4">Storage Location</th>
                <th scope="col" className="py-3 px-4 text-right">Quick Stock Actions</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-slate-800/60">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <PackageX className="w-8 h-8 text-slate-500 stroke-1" />
                      <p className="text-sm font-medium text-slate-300">No inventory matches your search criteria.</p>
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery('')
                          setSelectedCategory('All')
                          setStatusFilter('all')
                        }}
                        className="mt-1 text-xs text-indigo-400 hover:text-indigo-300 underline font-medium cursor-pointer"
                      >
                        Reset all filters
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredItems.map((item, idx) => {
                  const capacityPercent = Math.min(100, Math.round((item.stock / item.maxCapacity) * 100))

                  return (
                    <tr
                      key={item.id}
                      /*
                        ROW INTERACTION:
                        Subtle hover highlight with 200ms smooth background shift.
                      */
                      className="group hover:bg-slate-800/50 transition-colors duration-200 ease-in-out"
                    >
                      {/* Name & SKU */}
                      <td className="py-3.5 px-4">
                        <button
                          type="button"
                          onClick={() => setSelectedItem(item)}
                          className="text-left group-hover:text-indigo-300 transition-colors focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded p-0.5 cursor-pointer"
                        >
                          <div className="font-semibold text-white tracking-tight flex items-center gap-1.5">
                            {item.name}
                            <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:translate-x-0.5 group-hover:text-indigo-400 transition-transform duration-200" />
                          </div>
                          <div className="text-[11px] font-mono text-slate-400">{item.sku}</div>
                        </button>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700/60">
                          {item.category}
                        </span>
                      </td>

                      {/* Status Badge */}
                      <td className="py-3.5 px-4">
                        {item.status === 'optimal' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            In Stock
                          </span>
                        )}
                        {item.status === 'low' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                            Low Stock
                          </span>
                        )}
                        {item.status === 'critical' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-rose-500/15 text-rose-300 border border-rose-500/30">
                            {/* Animated pulse dot */}
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
                            </span>
                            Critical Reserve
                          </span>
                        )}
                        {item.status === 'out_of_stock' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-800 text-slate-400 border border-slate-700">
                            <PackageX className="w-3 h-3 text-slate-400" />
                            Depleted
                          </span>
                        )}
                      </td>

                      {/* Current Units with Gauge */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">{item.stock}</span>
                          <span className="text-[10px] text-slate-500">/ {item.maxCapacity}</span>
                        </div>
                        <div className="w-24 bg-slate-800 h-1 rounded-full overflow-hidden mt-1">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              capacityPercent < 15
                                ? 'bg-rose-500'
                                : capacityPercent < 35
                                ? 'bg-amber-500'
                                : 'bg-indigo-400'
                            }`}
                            style={{ width: `${capacityPercent}%` }}
                          />
                        </div>
                      </td>

                      {/* Unit Cost */}
                      <td className="py-3.5 px-4 font-mono text-slate-200">
                        ${item.unitCost.toFixed(2)}
                      </td>

                      {/* Warehouse Location */}
                      <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                        {item.location}
                      </td>

                      {/* Quick Stock Actions (+, -, Restock) */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Decrement Button */}
                          <button
                            type="button"
                            aria-label={`Decrease stock for ${item.name}`}
                            disabled={item.stock === 0}
                            onClick={() => handleAdjustStock(item.id, -1)}
                            /*
                              INTERACTION SPEC:
                              Tactile press scale 0.98, hover scale 1.02,
                              disabled state handles opacity gracefully.
                            */
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-[0.98] hover:scale-[1.02] text-slate-300 disabled:opacity-30 disabled:pointer-events-none transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>

                          {/* Increment Button */}
                          <button
                            type="button"
                            aria-label={`Increase stock for ${item.name}`}
                            onClick={() => handleAdjustStock(item.id, 1)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-[0.98] hover:scale-[1.02] text-slate-300 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>

                          {/* Quick Restock Trigger */}
                          <button
                            type="button"
                            onClick={() => {
                              setRestockModalItem(item)
                              setRestockAmount(Math.max(20, item.minThreshold - item.stock))
                            }}
                            className="ml-1 px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-indigo-600/80 hover:bg-indigo-600 active:scale-[0.98] hover:scale-[1.02] text-white shadow-sm transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-400 cursor-pointer"
                          >
                            Restock
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* DRAWER: DETAILED ITEM INSPECTION */}
      {/* ==================================================================== */}
      {selectedItem && (
        <aside
          role="dialog"
          aria-modal="true"
          aria-labelledby="drawer-item-title"
          className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm transition-opacity duration-300 ease-out"
        >
          <div className="relative w-full max-w-md h-full bg-[#0F172A] border-l border-slate-800 p-6 shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <span className="text-xs font-mono text-indigo-400 uppercase tracking-wider">
                  Item Telemetry & Logistics
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedItem(null)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 active:scale-[0.98] transition-all duration-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-6">
                <span className="inline-block px-2.5 py-0.5 rounded-md text-xs font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  {selectedItem.category}
                </span>
                <h2 id="drawer-item-title" className="mt-2 text-xl font-bold text-white tracking-tight">
                  {selectedItem.name}
                </h2>
                <p className="text-xs font-mono text-slate-400 mt-1">SKU: {selectedItem.sku}</p>
              </div>

              {/* Data Grid */}
              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[11px] text-slate-400">Current Balance</span>
                  <p className="text-xl font-bold text-white mt-1">{selectedItem.stock} units</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[11px] text-slate-400">Min Safety Level</span>
                  <p className="text-xl font-bold text-amber-400 mt-1">{selectedItem.minThreshold} units</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[11px] text-slate-400">Unit Valuation</span>
                  <p className="text-xl font-bold text-emerald-400 mt-1">${selectedItem.unitCost.toFixed(2)}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[11px] text-slate-400">Storage Coordinates</span>
                  <p className="text-xs font-mono font-medium text-slate-300 mt-1">{selectedItem.location}</p>
                </div>
              </div>

              {/* Operational Recommendation Box */}
              <div className="mt-6 p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <h4 className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                  Supply Chain Recommendation
                </h4>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  {selectedItem.stock <= selectedItem.minThreshold
                    ? 'Inventory level is below safety threshold. Trigger an urgent procurement batch to avoid stockout.'
                    : 'Inventory level is operating in optimum safety buffer. No replenishment needed currently.'}
                </p>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-slate-800 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setRestockModalItem(selectedItem)
                  setSelectedItem(null)
                }}
                className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] hover:scale-[1.02] text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 transition-all duration-200"
              >
                Replenish Item
              </button>
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-[0.98] text-xs font-medium text-slate-300 transition-all duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* ==================================================================== */}
      {/* MODAL: RAPID REPLENISHMENT */}
      {/* ==================================================================== */}
      {restockModalItem && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="restock-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div className="relative w-full max-w-md rounded-2xl bg-[#0F172A] border border-slate-700 p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 id="restock-modal-title" className="text-base font-bold text-white flex items-center gap-2">
                <PackageCheck className="w-4 h-4 text-emerald-400" />
                Replenish Stock Batch
              </h3>
              <button
                type="button"
                onClick={() => setRestockModalItem(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4">
              <p className="text-xs text-slate-400">
                Replenishing inventory for{' '}
                <strong className="text-white">{restockModalItem.name}</strong> ({restockModalItem.sku}).
              </p>

              <div className="mt-4">
                <label htmlFor="restock-qty" className="block text-xs font-medium text-slate-300 mb-1.5">
                  Quantity to Ingest
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id="restock-qty"
                    type="number"
                    min="1"
                    value={restockAmount}
                    onChange={(e) => setRestockAmount(Math.max(1, parseInt(e.target.value) || 0))}
                    className="flex-1 px-3 py-2 text-sm rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono"
                  />
                  {/* Preset quick buttons */}
                  {[10, 50, 100].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setRestockAmount(preset)}
                      className="px-2.5 py-2 text-xs font-mono font-medium rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-[0.98] text-slate-300 border border-slate-700 transition-all"
                    >
                      +{preset}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4 p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">Resulting Total:</span>
                <span className="font-bold text-emerald-400 font-mono">
                  {restockModalItem.stock + restockAmount} units
                </span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setRestockModalItem(null)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteRestock}
                /*
                  INTERACTION SPEC:
                  High-converting primary action button:
                  200ms transition, hover scale 1.02, active press 0.98,
                  smooth glow shadow.
                */
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] hover:scale-[1.02] text-white shadow-lg shadow-emerald-600/25 border border-emerald-400/30 transition-all duration-200 cursor-pointer"
              >
                Confirm Restock
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TOAST FEEDBACK NOTIFICATION */}
      {/* ==================================================================== */}
      {toastMessage && (
        <aside
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-900/95 border border-indigo-500/40 text-white text-xs font-medium shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom-3 duration-200"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="ml-2 p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </aside>
      )}
    </section>
  )
}
