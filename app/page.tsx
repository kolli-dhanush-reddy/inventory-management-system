'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  AlertCircle,
  AlertTriangle,
  ArrowDownToLine,
  ArrowUpFromLine,
  BarChart3,
  Bell,
  Boxes,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Command,
  CreditCard,
  DollarSign,
  Download,
  Eye,
  Filter,
  Grid,
  Info,
  Key,
  LayoutDashboard,
  List,
  LogOut,
  Package,
  Pencil,
  Plus,
  Printer,
  QrCode,
  RotateCcw,
  Search,
  Settings,
  ShieldAlert,
  SlidersHorizontal,
  Sparkles,
  Tag,
  Trash2,
  TrendingDown,
  TrendingUp,
  Truck,
  Users,
  X,
} from 'lucide-react'
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import InventoryStockDashboard from '@/components/inventory-stock-dashboard'

type A = any

const NAV: [string, A][] = [
  ['Dashboard', LayoutDashboard],
  ['Live Telemetry Hub', Sparkles],
  ['Products', Package],
  ['Inventory Operations', ClipboardList],
  ['Suppliers', Truck],
  ['Transactions', Boxes],
  ['Reports', BarChart3],
  ['User Management', Users],
  ['Settings', Settings],
]

const CATS0 = ['Electronics', 'Office', 'Tools', 'Packaging']

const SUP0 = [
  { id: 1, name: 'Apex Components', contact: 'Maria Lopez', email: 'maria@apex.com', phone: '+1 555 0101', address: '12 Industrial Way, Austin TX', cats: 'Electronics, Tools', rating: '99%', active: true },
  { id: 2, name: 'Northstar Supply', contact: 'Ken Ito', email: 'ken@northstar.io', phone: '+1 555 0144', address: '88 Harbor Rd, Seattle WA', cats: 'Office, Packaging', rating: '95%', active: true },
  { id: 3, name: 'Vertex Plastics', contact: 'Ana Silva', email: 'ana@vertex.co', phone: '+1 555 0172', address: '5 Mill St, Dayton OH', cats: 'Packaging', rating: '98%', active: true },
  { id: 4, name: 'Meridian Trade', contact: 'Tom Reed', email: 'tom@meridian.com', phone: '+1 555 0190', address: '40 Bay Ave, Miami FL', cats: 'Tools, Office', rating: '88%', active: false },
]

const P0: A[] = [
  ['EL-1001', 'USB-C Hub 7-in-1', 'Electronics', 39.9, 120, 30, 1],
  ['EL-1002', 'Wireless Mouse', 'Electronics', 19.5, 14, 25, 1],
  ['EL-1003', '27" Monitor', 'Electronics', 229, 0, 10, 1],
  ['EL-1004', 'Mechanical Keyboard', 'Electronics', 74, 42, 15, 1],
  ['OF-2001', 'A4 Paper Ream', 'Office', 4.2, 600, 150, 2],
  ['OF-2002', 'Gel Pens (12pk)', 'Office', 6.8, 18, 40, 2],
  ['OF-2003', 'Desk Organizer', 'Office', 15, 55, 20, 2],
  ['TL-3001', 'Cordless Drill', 'Tools', 89, 8, 10, 4],
  ['TL-3002', 'Socket Set 40pc', 'Tools', 45, 33, 12, 1],
  ['TL-3003', 'Laser Measure', 'Tools', 34, 0, 8, 4],
  ['PK-4001', 'Shipping Box M', 'Packaging', 1.1, 900, 300, 3],
  ['PK-4002', 'Bubble Wrap Roll', 'Packaging', 18, 22, 25, 3],
  ['PK-4003', 'Packing Tape 6pk', 'Packaging', 9.5, 140, 50, 2],
  ['PK-4004', 'Pallet Wrap', 'Packaging', 21, 61, 20, 3],
].map((r, i) => ({ id: i + 1, sku: r[0], name: r[1], cat: r[2], price: r[3], qty: r[4], min: r[5], sup: r[6], desc: 'High quality industrial inventory asset' }))

const USERS0 = [
  { id: 1, name: 'Dana Whitfield', email: 'dana@stockly.io', role: 'Admin', active: true, last: '2026-10-08 09:12' },
  { id: 2, name: 'Raj Patel', email: 'raj@stockly.io', role: 'Inventory Staff', active: true, last: '2026-10-08 08:40' },
  { id: 3, name: 'Lena Fox', email: 'lena@stockly.io', role: 'Inventory Staff', active: true, last: '2026-10-07 17:05' },
  { id: 4, name: 'Omar Haddad', email: 'omar@stockly.io', role: 'Inventory Staff', active: false, last: '2026-09-21 11:30' },
]

const who = ['Dana Whitfield', 'Raj Patel', 'Lena Fox']
const T0: A[] = Array.from({ length: 36 }, (_, i) => {
  const t = i % 5 === 0 ? 'Stock In' : i % 11 === 0 ? 'Adjustment' : 'Stock Out'
  const d = new Date(2026, 9, 8 - Math.floor(i / 5))
  const day = d.toISOString().slice(0, 10)
  return {
    id: i + 1,
    type: t,
    pid: (i * 7) % 14 + 1,
    qty: t === 'Adjustment' ? (i % 2 ? -3 : 4) : 5 + (i * 13) % 40,
    by: who[i % 3],
    at: `${day} ${String(8 + (i % 9)).padStart(2, '0')}:${String((i * 17) % 60).padStart(2, '0')}`,
    ref: t === 'Stock In' ? `PO-${5000 + i}` : t === 'Stock Out' ? `SO-${7000 + i}` : 'Audit',
    note: i % 4 === 0 ? 'Routine warehouse verification' : '',
  }
})

const status = (p: A) => (p.qty === 0 ? 'Out of Stock' : p.qty <= p.min ? 'Low Stock' : 'In Stock')
const SC: Record<string, string> = {
  'Out of Stock': 'bg-red-100 text-red-950 border-red-300 font-semibold',
  'Low Stock': 'bg-amber-100 text-amber-950 border-amber-300 font-semibold',
  'In Stock': 'bg-emerald-100 text-emerald-950 border-emerald-300 font-semibold',
}
const TC: Record<string, string> = {
  'Stock In': 'bg-emerald-100 text-emerald-800 font-semibold',
  'Stock Out': 'bg-rose-100 text-rose-800 font-semibold',
  Adjustment: 'bg-sky-100 text-sky-800 font-semibold',
}

const inp = 'h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-1 disabled:opacity-50 transition-all'

function Field({ label, children }: A) {
  return <label className="grid gap-1 text-xs font-semibold text-slate-700">{label}{children}</label>
}

function Modal({ title, onClose, isDirty = false, children }: A) {
  const handleClose = () => {
    if (isDirty && !confirm('You have unsaved changes. Discard changes?')) return
    onClose()
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs animate-in fade-in" onClick={handleClose}>
      <div className="max-h-[90vh] w-full max-w-lg overflow-auto rounded-xl bg-white p-6 shadow-2xl border border-slate-200" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">{title}</h3>
          <button onClick={handleClose} aria-label="Close dialog" className="rounded-lg p-1.5 hover:bg-slate-100 text-slate-500 focus-visible:ring-2 focus-visible:ring-slate-900 transition-colors">
            <X className="size-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

const Sb = ({ s }: { s: string }) => (
  <Badge variant="outline" className={`gap-1.5 px-2 py-0.5 ${SC[s]}`}>
    <span className={`size-1.5 rounded-full ${s === 'In Stock' ? 'bg-emerald-600' : s === 'Low Stock' ? 'bg-amber-600 animate-pulse' : 'bg-red-600 animate-pulse'}`} />
    {s}
  </Badge>
)

export default function Page() {
  const [role, setRole] = useState<'Administrator' | 'Staff Member'>('Administrator')
  const admin = role === 'Administrator'
  const [view, setView] = useState('Dashboard')
  const [cats, setCats] = useState(CATS0)
  const [sups, setSups] = useState<A[]>(SUP0)
  const [prods, setProds] = useState<A[]>(P0)
  const [txns, setTxns] = useState<A[]>(T0)
  const [users] = useState<A[]>(USERS0)
  const [modal, setModal] = useState<A>(null)

  // Interactive Settings State
  const [currency, setCurrency] = useState('$')
  const [reorderMult, setReorderMult] = useState(2)

  // Toast & Undo State
  const [toast, setToast] = useState<{ msg: string; undoAction?: () => void } | null>(null)
  const [lastDeleted, setLastDeleted] = useState<A>(null)

  // Quick Action Modal State
  const [quickOp, setQuickOp] = useState<{ open: boolean; type: string; prod?: A; qty?: string; ref?: string; reason?: string; note?: string }>({ open: false, type: 'Stock In' })

  // Bulk Receive State
  const [bulkModal, setBulkModal] = useState(false)
  const [bulkItems, setBulkItems] = useState<{ pid: number; qty: string }[]>([
    { pid: 1, qty: '10' },
    { pid: 2, qty: '15' },
  ])
  const [bulkRef, setBulkRef] = useState('PO-BULK-901')

  // Batch Selection State
  const [selectedIds, setSelectedIds] = useState<number[]>([])

  // Delete Confirmation Modal State
  const [deleteConfirm, setDeleteConfirm] = useState<A>(null)

  // NEW UI/UX FEATURES:
  // 1. Command Palette State (Ctrl+K / ⌘K)
  const [cmdOpen, setCmdOpen] = useState(false)
  const [cmdQuery, setCmdQuery] = useState('')

  // 2. Notifications Drawer State
  const [notifOpen, setNotifOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(3)

  // 3. Product View Mode (Table vs Grid Cards)
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')

  // 4. Interactive Product Detail Drawer State
  const [drawerProd, setDrawerProd] = useState<A>(null)

  // 5. Table Sorting State
  const [sortField, setSortField] = useState<string>('name')
  const [sortAsc, setSortAsc] = useState<boolean>(true)

  // System Helpers
  const say = (msg: string, undoAction?: () => void) => {
    setToast({ msg, undoAction })
    setTimeout(() => setToast(null), 6000)
  }
  const $ = (n: number) => currency + n.toLocaleString(undefined, { maximumFractionDigits: 0 })
  const pname = (id: number) => prods.find((p) => p.id === id)
  const supName = (id: number) => sups.find((s) => s.id === id)?.name ?? '—'

  const low = prods.filter((p) => status(p) === 'Low Stock')
  const out = prods.filter((p) => status(p) === 'Out of Stock')
  const value = prods.reduce((a, p) => a + p.qty * p.price, 0)
  const items = prods.reduce((a, p) => a + p.qty, 0)

  // Keyboard shortcut listener for Ctrl+K / ⌘K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setCmdOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Search & Filter State
  const [q, setQ] = useState('')
  const [fc, setFc] = useState('')
  const [fs, setFs] = useState('')
  const [pg, setPg] = useState(0)
  const [pageSize, setPageSize] = useState<number>(6)
  const [ptab, setPtab] = useState('Products')

  const filtered = useMemo(() => {
    let list = prods.filter((p) => {
      const matchQ = (p.name + p.sku).toLowerCase().includes(q.toLowerCase())
      const matchCat = !fc || p.cat === fc
      const s = status(p)
      const matchStatus = !fs || (fs === 'Requires Attention' ? (s === 'Low Stock' || s === 'Out of Stock') : s === fs)
      return matchQ && matchCat && matchStatus
    })

    list.sort((a, b) => {
      let vA = a[sortField as keyof typeof a]
      let vB = b[sortField as keyof typeof b]
      if (typeof vA === 'string') vA = (vA as string).toLowerCase()
      if (typeof vB === 'string') vB = (vB as string).toLowerCase()
      if (vA < vB) return sortAsc ? -1 : 1
      if (vA > vB) return sortAsc ? 1 : -1
      return 0
    })

    return list
  }, [prods, q, fc, fs, sortField, sortAsc])

  const effectivePageSize = pageSize === 0 ? filtered.length || 1 : pageSize
  const pages = Math.max(1, Math.ceil(filtered.length / effectivePageSize))

  // Transactions Filtering
  const [tq, setTq] = useState('')
  const [tt, setTt] = useState('')
  const [d1, setD1] = useState('')
  const [d2, setD2] = useState('')
  const tf = txns.filter((t) => {
    const p = pname(t.pid)
    const matchQ = !tq || (p?.sku + p?.name).toLowerCase().includes(tq.toLowerCase())
    const matchT = !tt || t.type === tt
    const matchD1 = !d1 || t.at.slice(0, 10) >= d1
    const matchD2 = !d2 || t.at.slice(0, 10) <= d2
    return matchQ && matchT && matchD1 && matchD2
  })
  const [rep, setRep] = useState('Inventory Valuation')

  const byCat = cats.map((c) => ({ name: c, stock: prods.filter((p) => p.cat === c).reduce((a, p) => a + p.qty, 0), value: Math.round(prods.filter((p) => p.cat === c).reduce((a, p) => a + p.qty * p.price, 0)) }))
  const trend = useMemo(() => Array.from({ length: 7 }, (_, i) => {
    const day = new Date(2026, 9, 2 + i).toISOString().slice(0, 10)
    const ts = txns.filter((t) => t.at.startsWith(day))
    return { day: day.slice(5), In: ts.filter((t) => t.type === 'Stock In').reduce((a, t) => a + t.qty, 0), Out: ts.filter((t) => t.type === 'Stock Out').reduce((a, t) => a + t.qty, 0) }
  }), [txns])
  const movers = prods.map((p) => ({ ...p, sold: txns.filter((t) => t.pid === p.id && t.type === 'Stock Out').reduce((a, t) => a + t.qty, 0) })).sort((a, b) => b.sold - a.sold)

  // Transaction Recording
  function record(type: string, pid: number, qty: number, ref: string, note: string, date: string = '2026-10-08') {
    const p = pname(pid)!
    const delta = type === 'Stock In' ? qty : type === 'Stock Out' ? -qty : qty - p.qty
    const newQty = p.qty + delta
    setProds((prev) => prev.map((x) => (x.id === pid ? { ...x, qty: newQty } : x)))
    setTxns((prev) => [
      { id: Date.now(), type, pid, qty: type === 'Adjustment' ? delta : qty, by: admin ? 'Dana Whitfield' : 'Raj Patel', at: `${date} ${new Date().toTimeString().slice(0, 5)}`, ref, note },
      ...prev,
    ])
    say(`${type} recorded for ${p.sku} (New Total: ${newQty} units)`)
  }

  // Safe Deletion with Undo Toast
  function deleteProduct(p: A) {
    setLastDeleted(p)
    setProds((prev) => prev.filter((x) => x.id !== p.id))
    setSelectedIds((prev) => prev.filter((id) => id !== p.id))
    setDeleteConfirm(null)
    say(`Deleted "${p.name}".`, () => {
      setProds((prev) => [...prev, p])
      say(`Restored "${p.name}" to inventory.`)
    })
  }

  // Bulk Delete
  function bulkDelete() {
    if (!confirm(`Delete ${selectedIds.length} selected items?`)) return
    const itemsToDelete = prods.filter((p) => selectedIds.includes(p.id))
    setProds((prev) => prev.filter((p) => !selectedIds.includes(p.id)))
    setSelectedIds([])
    say(`Bulk deleted ${itemsToDelete.length} products.`, () => {
      setProds((prev) => [...prev, ...itemsToDelete])
      say(`Restored ${itemsToDelete.length} products.`)
    })
  }

  // Bulk Receive
  function submitBulkReceive() {
    const date = '2026-10-08'
    let count = 0
    bulkItems.forEach((item) => {
      const q = Number(item.qty)
      if (item.pid && q > 0) {
        record('Stock In', item.pid, q, bulkRef || 'PO-BULK', 'Multi-item shipment receipt', date)
        count++
      }
    })
    setBulkModal(false)
    say(`Received bulk shipment of ${count} items under ${bulkRef}`)
  }

  // Quick Action Helper
  function openQuickAction(product: A, type: string = 'Stock In') {
    const suggestedQty = type === 'Stock In' ? Math.max(1, product.min * reorderMult - product.qty) : type === 'Adjustment' ? product.qty : 1
    setQuickOp({
      open: true,
      type,
      prod: product,
      qty: String(suggestedQty),
      ref: type === 'Stock In' ? `PO-${Math.floor(5000 + Math.random() * 900)}` : type === 'Stock Out' ? `SO-${Math.floor(7000 + Math.random() * 900)}` : 'Audit',
      reason: 'Audit',
      note: '',
    })
  }

  function toggleSort(field: string) {
    if (sortField === field) setSortAsc(!sortAsc)
    else {
      setSortField(field)
      setSortAsc(true)
    }
  }

  function exportCsv() {
    const rows = [['Date', 'Type', 'SKU', 'Product', 'Qty', 'Performed By', 'Reference', 'Notes'], ...tf.map((t) => [t.at, t.type, pname(t.pid)?.sku, pname(t.pid)?.name, t.qty, t.by, t.ref, t.note])]
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([rows.map((r) => r.join(',')).join('\n')], { type: 'text/csv' }))
    a.download = `inventory_transactions_${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
  }

  function printPdfReport() {
    window.print()
  }

  // Product Form
  function ProductForm() {
    const e = modal.data
    const [f, setF] = useState<A>(e ?? { sku: '', name: '', cat: cats[0] || 'Electronics', price: '', qty: 0, min: 10, sup: sups[0]?.id || 1, desc: '' })
    const [isDirty, setIsDirty] = useState(false)
    const [newCatInline, setNewCatInline] = useState('')
    const [showInlineCat, setShowInlineCat] = useState(false)
    const [err, setErr] = useState('')

    const set = (k: string, v: A) => {
      setIsDirty(true)
      setErr('')
      setF({ ...f, [k]: v })
    }

    const saveInlineCat = () => {
      if (!newCatInline.trim()) return
      const name = newCatInline.trim()
      if (!cats.includes(name)) setCats([...cats, name])
      set('cat', name)
      setShowInlineCat(false)
      setNewCatInline('')
      say(`Created category "${name}"`)
    }

    const save = () => {
      if (!f.sku || !f.name) return setErr('SKU and Product Name are required.')
      if (Number(f.price) < 0) return setErr('Unit price cannot be negative.')
      if (Number(f.qty) < 0 || Number(f.min) < 0) return setErr('Stock quantity and threshold cannot be negative.')
      
      const rec = { ...f, price: Number(f.price) || 0, qty: Number(f.qty), min: Number(f.min), sup: Number(f.sup) }
      setProds(e ? prods.map((x) => (x.id === e.id ? rec : x)) : [...prods, { ...rec, id: Date.now() }])
      setModal(null)
      say(`Product "${f.name}" saved successfully`)
    }

    const matchingSups = useMemo(() => {
      return [...sups].sort((a, b) => {
        const aMatches = f.cat && a.cats.toLowerCase().includes(f.cat.toLowerCase())
        const bMatches = f.cat && b.cats.toLowerCase().includes(f.cat.toLowerCase())
        return aMatches === bMatches ? 0 : aMatches ? -1 : 1
      })
    }, [f.cat])

    return (
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="SKU / Item Code *">
          <input className={inp} value={f.sku} onChange={(x) => set('sku', x.target.value)} placeholder="e.g. EL-1005" />
        </Field>
        <Field label="Product Name *">
          <input className={inp} value={f.name} onChange={(x) => set('name', x.target.value)} placeholder="e.g. Ergonomic Chair" />
        </Field>
        <Field label="Category">
          {showInlineCat ? (
            <div className="flex gap-1">
              <input className={inp} value={newCatInline} onChange={(x) => setNewCatInline(x.target.value)} placeholder="New category name" autoFocus />
              <Button size="sm" type="button" onClick={saveInlineCat}>Add</Button>
              <Button size="sm" type="button" variant="ghost" onClick={() => setShowInlineCat(false)}>Cancel</Button>
            </div>
          ) : (
            <div className="flex gap-1">
              <select className={inp} value={f.cat} onChange={(x) => set('cat', x.target.value)}>
                {cats.map((c) => <option key={c}>{c}</option>)}
              </select>
              <Button size="sm" type="button" variant="outline" onClick={() => setShowInlineCat(true)} title="Quick Add Category" aria-label="Add category inline">+</Button>
            </div>
          )}
        </Field>
        <Field label={`Unit Price (${currency})`}>
          <input type="number" min={0} step="0.01" className={inp} value={f.price} onChange={(x) => set('price', x.target.value)} />
        </Field>
        <Field label={e ? 'Current Stock Quantity' : 'Initial Stock Quantity'}>
          <input type="number" min={0} className={inp} value={f.qty} onChange={(x) => set('qty', x.target.value)} />
        </Field>
        <Field label="Minimum Reorder Threshold">
          <input type="number" min={0} className={inp} value={f.min} onChange={(x) => set('min', x.target.value)} />
        </Field>
        <Field label="Supplier (Ranked by Category)">
          <select className={inp} value={f.sup} onChange={(x) => set('sup', x.target.value)}>
            {matchingSups.map((s) => {
              const matches = f.cat && s.cats.toLowerCase().includes(f.cat.toLowerCase())
              return (
                <option key={s.id} value={s.id}>
                  {s.name} {matches ? '✓ (Supplies Category)' : ''}
                </option>
              )
            })}
          </select>
        </Field>
        <Field label="Description">
          <input className={inp} value={f.desc} onChange={(x) => set('desc', x.target.value)} placeholder="Optional item details" />
        </Field>
        {err && <p className="text-xs font-semibold text-red-600 sm:col-span-2">{err}</p>}
        <div className="sm:col-span-2 pt-2">
          <Button onClick={save} className="w-full">Save Product</Button>
        </div>
      </div>
    )
  }

  function SupplierForm() {
    const e = modal.data
    const [f, setF] = useState<A>(e ?? { name: '', contact: '', email: '', phone: '', address: '', cats: '', active: true })
    const set = (k: string, v: A) => setF({ ...f, [k]: v })
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        {['name', 'contact', 'email', 'phone', 'address', 'cats'].map((k) => (
          <Field key={k} label={k === 'cats' ? 'Supplied categories' : k[0].toUpperCase() + k.slice(1)}>
            <input className={inp} value={f[k] || ''} onChange={(x) => set(k, x.target.value)} />
          </Field>
        ))}
        <label className="flex items-center gap-2 text-sm sm:col-span-2 cursor-pointer">
          <input type="checkbox" checked={f.active} onChange={(x) => set('active', x.target.checked)} className="rounded text-slate-900 focus:ring-slate-900" />
          Active Supplier
        </label>
        <div className="sm:col-span-2 pt-2">
          <Button className="w-full" onClick={() => {
            if (!f.name) return say('Supplier name required')
            const rec = { ...f, id: e ? e.id : Date.now() }
            setSups(e ? sups.map((s) => (s.id === e.id ? rec : s)) : [...sups, rec])
            setModal(null)
            say('Supplier details saved')
          }}>Save Supplier</Button>
        </div>
      </div>
    )
  }

  const Kpi = ({ t, v, i: I, c = '', bg = 'bg-white dark:bg-zinc-900', trendStr }: A) => (
    <Card className={`${bg} border border-slate-200/80 rounded-xl shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-slate-500">{t}</p>
          <div className="rounded-lg bg-slate-100 p-2 text-slate-700">
            <I className="size-4" />
          </div>
        </div>
        <p className={`mt-2 text-2xl font-bold tracking-tight ${c}`}>{v}</p>
        {trendStr && <p className="mt-1 text-[11px] font-medium text-emerald-600 flex items-center gap-1"><TrendingUp className="size-3" />{trendStr}</p>}
      </CardContent>
    </Card>
  )

  const TH = ({ cols }: { cols: string[] }) => (
    <TableHeader>
      <TableRow className="bg-slate-50/80 hover:bg-slate-50/80 border-b border-slate-200/80">
        {cols.map((c) => (
          <TableHead key={c} className="font-semibold text-slate-700 text-xs py-3">
            {c}
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  )

  const Sel = ({ v, set, opts, ph, label }: A) => (
    <select aria-label={label || ph} className={inp + ' sm:w-44 font-medium'} value={v} onChange={(e) => set(e.target.value)}>
      <option value="">{ph}</option>
      {opts.map((o: string) => <option key={o}>{o}</option>)}
    </select>
  )

  const TxRow = (t: A) => (
    <TableRow key={t.id} className="hover:bg-slate-50/60 transition-colors">
      <TableCell className="whitespace-nowrap text-slate-500 text-xs font-mono">{t.at}</TableCell>
      <TableCell><Badge className={TC[t.type]}>{t.type}</Badge></TableCell>
      <TableCell className="font-medium text-slate-900">{pname(t.pid)?.sku} · {pname(t.pid)?.name}</TableCell>
      <TableCell className="font-semibold">{t.qty > 0 && t.type === 'Adjustment' ? '+' : t.type === 'Stock Out' ? '−' : ''}{Math.abs(t.qty)}</TableCell>
      <TableCell className="text-slate-700 text-xs">
        <span className="font-medium">{t.ref || '—'}</span>
        {t.note && <span className="block text-[11px] text-slate-500 font-normal italic">{t.note}</span>}
      </TableCell>
      <TableCell className="text-slate-600">{t.by}</TableCell>
    </TableRow>
  )

  return (
    <div className="flex min-h-screen flex-col bg-slate-50/60 text-slate-900 font-sans">
      {/* Demo Sandbox Top Header */}
      <header className="bg-slate-900 px-4 py-2 text-white text-xs flex flex-wrap items-center justify-between gap-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[10px] font-mono">Demo Mode</Badge>
          <span className="text-slate-300 hidden sm:inline">Stockly Enterprise Operations Suite</span>
        </div>
        
        {/* Top Header Interactive Search & Notification Bar */}
        <div className="flex items-center gap-3">
          {/* Command Palette Trigger */}
          <button
            onClick={() => setCmdOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-slate-800 px-2.5 py-1 text-xs text-slate-300 hover:bg-slate-700 hover:text-white transition-colors border border-slate-700"
          >
            <Search className="size-3.5" />
            <span className="hidden sm:inline">Search system...</span>
            <kbd className="rounded bg-slate-700 px-1.5 py-0.5 text-[10px] font-mono text-slate-300">⌘K</kbd>
          </button>

          {/* Notifications Trigger */}
          <button
            onClick={() => setNotifOpen(true)}
            aria-label="View notifications"
            className="relative rounded-lg p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
          >
            <Bell className="size-4" />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-red-600 text-[9px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>

          <span className="text-slate-700">|</span>

          <div className="flex items-center gap-2">
            <span className="font-medium text-slate-300 hidden sm:inline">Role:</span>
            <select
              className="bg-slate-800 text-white border border-slate-700 rounded px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
              value={role}
              aria-label="Toggle preview role"
              onChange={(e) => {
                setRole(e.target.value as A)
                if (e.target.value !== 'Administrator' && view === 'User Management') setView('Dashboard')
              }}
            >
              <option>Administrator</option>
              <option>Staff Member</option>
            </select>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar Navigation */}
        <aside className="hidden w-60 shrink-0 flex-col border-r border-slate-200/80 bg-white md:flex">
          <div className="flex items-center gap-2 px-5 py-4 text-lg font-bold border-b border-slate-100">
            <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-xs">
              <Boxes className="size-4" />
            </div>
            Stockly
          </div>
          <nav className="grid gap-1 p-3">
            {NAV.map(([l, I]) => (
              <button
                key={l}
                onClick={() => setView(l)}
                aria-label={`Navigate to ${l}`}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all ${view === l ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
              >
                <I className="size-4 shrink-0" />
                {l}
              </button>
            ))}
          </nav>
          <div className="mt-auto border-t border-slate-200/80 p-4 bg-slate-50/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900 text-xs">{admin ? 'Dana Whitfield' : 'Raj Patel'}</p>
                <Badge variant="outline" className="text-[10px] py-0 font-medium">{admin ? 'Admin' : 'Staff'}</Badge>
              </div>
              <LogOut className="size-4 text-slate-400" />
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="min-w-0 flex-1 p-4 md:p-6 bg-slate-50/60">
          {/* Mobile Touch Navigation */}
          <div className="mb-4 border-b border-slate-200/80 pb-3 md:hidden">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-base font-bold"><Boxes className="size-5 text-emerald-600" />Stockly</div>
              <Badge variant="outline" className="text-[10px]">{admin ? 'Admin' : 'Staff'}</Badge>
            </div>
            <div className="flex overflow-x-auto gap-1.5 pb-1 no-scrollbar">
              {NAV.map(([l, I]) => (
                <button
                  key={l}
                  onClick={() => setView(l)}
                  className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${view === l ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                >
                  <I className="size-3.5" />
                  {l}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">{view}</h1>
              <p className="text-xs text-slate-500">Real-time Stock Maintaining & Inventory Management System</p>
            </div>

            {/* Quick Command Trigger Badge */}
            <button onClick={() => setCmdOpen(true)} className="hidden lg:flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-slate-900 bg-white border border-slate-200 rounded-lg px-3 py-1.5 shadow-2xs hover:shadow-xs transition-all">
              <Sparkles className="size-3.5 text-amber-500" /> Quick Search & Actions <kbd className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-mono text-slate-600">⌘K</kbd>
            </button>
          </div>

          {/* ---------------- DASHBOARD VIEW ---------------- */}
          {view === 'Dashboard' && (
            <div className="grid gap-6">
              {/* Live Telemetry Operations Widget */}
              <InventoryStockDashboard />

              {/* KPI Cards */}
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
                <Kpi t="Total Products" v={prods.length} i={Package} trendStr="+2 this week" />
                <Kpi t="Total Stock Items" v={items.toLocaleString()} i={Boxes} trendStr="+140 incoming" />
                <Kpi t="Low Stock Warnings" v={low.length} i={AlertTriangle} c="text-amber-700" bg={low.length > 0 ? 'bg-amber-50/40 border border-amber-200/80 rounded-xl shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)]' : 'bg-white dark:bg-zinc-900 border border-slate-200/80 rounded-xl shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)]'} />
                <Kpi t="Out of Stock Emergencies" v={out.length} i={AlertCircle} c="text-red-700" bg={out.length > 0 ? 'bg-red-50/40 border border-red-200/60 rounded-xl shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)]' : 'bg-white dark:bg-zinc-900 border border-slate-200/80 rounded-xl shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)]'} />
                <Kpi t="Total Inventory Value" v={$(value)} i={DollarSign} trendStr="+4.2% capital valuation" />
              </div>

              {/* Quick Movement Actions */}
              <Card className="border border-slate-200/80 bg-white dark:bg-zinc-900 rounded-xl shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)]">
                <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="size-4 text-slate-500" />
                    <span className="text-xs font-bold text-slate-800">Quick Operations Dock:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" onClick={() => setModal({ k: 'product' })} className="gap-1.5"><Plus className="size-4" />Add Product</Button>
                    <Button size="sm" variant="outline" className="bg-emerald-50 text-emerald-900 border-emerald-300 hover:bg-emerald-100 gap-1.5" onClick={() => openQuickAction(prods[0], 'Stock In')}><ArrowDownToLine className="size-4 text-emerald-700" />Stock In</Button>
                    <Button size="sm" variant="outline" className="bg-rose-50 text-rose-900 border-rose-300 hover:bg-rose-100 gap-1.5" onClick={() => openQuickAction(prods[0], 'Stock Out')}><ArrowUpFromLine className="size-4 text-rose-700" />Stock Out</Button>
                    <Button size="sm" variant="outline" className="bg-sky-50 text-sky-900 border-sky-300 hover:bg-sky-100 gap-1.5" onClick={() => openQuickAction(prods[0], 'Adjustment')}><SlidersHorizontal className="size-4 text-sky-700" />Stock Adjustment</Button>
                    <Button size="sm" variant="secondary" className="bg-slate-900 text-white hover:bg-slate-800 gap-1.5" onClick={() => setBulkModal(true)}><Truck className="size-4" />Bulk Receive PO</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Emergency Out-of-Stock Alert Banner */}
              {out.length > 0 && (
                <Card className="border border-red-200/60 bg-red-50/40 rounded-xl shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] animate-in fade-in">
                  <CardHeader className="pb-2"><CardTitle className="text-sm font-bold text-red-700 flex items-center gap-2"><AlertCircle className="size-4 text-red-600 animate-pulse" />CRITICAL: Out of Stock Emergencies ({out.length} items)</CardTitle></CardHeader>
                  <CardContent className="overflow-x-auto p-4 pt-0">
                    <Table><TH cols={['Product', 'SKU', 'Category', 'Min Threshold', 'Action']} />
                      <TableBody className="divide-y divide-slate-100">
                        {out.map((p) => (
                          <TableRow key={p.id} className="bg-white/80 hover:bg-white transition-colors">
                            <TableCell className="font-bold text-red-700">{p.name}</TableCell>
                            <TableCell className="font-mono text-xs text-slate-600">{p.sku}</TableCell>
                            <TableCell>{p.cat}</TableCell>
                            <TableCell>{p.min} units</TableCell>
                            <TableCell><Button size="sm" className="bg-red-700 hover:bg-red-800 text-white shadow-2xs" onClick={() => openQuickAction(p, 'Stock In')}>Receive Stock Now</Button></TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}

              {/* Visual Charts */}
              <div className="grid gap-4 lg:grid-cols-2">
                <Card className="border border-slate-200/80 bg-white dark:bg-zinc-900 rounded-xl shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)]"><CardHeader><CardTitle className="text-sm font-bold text-slate-900">Stock Level by Category (Units)</CardTitle></CardHeader><CardContent className="h-64"><ResponsiveContainer><BarChart data={byCat}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="name" fontSize={12} /><YAxis fontSize={12} /><Tooltip /><Bar dataKey="stock" fill="#0f172a" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
                <Card className="border border-slate-200/80 bg-white dark:bg-zinc-900 rounded-xl shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)]"><CardHeader><CardTitle className="text-sm font-bold text-slate-900">Transactions Trend (Units, Last 7 Days)</CardTitle></CardHeader><CardContent className="h-64"><ResponsiveContainer><LineChart data={trend}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="day" fontSize={12} /><YAxis fontSize={12} /><Tooltip /><Line dataKey="In" stroke="#059669" strokeWidth={2.5} name="Stock In" /><Line dataKey="Out" stroke="#e11d48" strokeWidth={2.5} name="Stock Out" /></LineChart></ResponsiveContainer></CardContent></Card>
              </div>

              {/* Tables: Low Stock & Recent Transactions */}
              <div className="grid gap-4 lg:grid-cols-2">
                <Card className="border border-slate-200/80 bg-white dark:bg-zinc-900 rounded-xl shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)]">
                  <CardHeader><CardTitle className="text-sm font-bold flex items-center justify-between text-slate-900">Low Stock Reorder Warnings <Badge variant="outline" className="bg-amber-100 text-amber-900 border-amber-300 font-semibold">{low.length} Items</Badge></CardTitle></CardHeader>
                  <CardContent className="overflow-x-auto">
                    {low.length === 0 ? <p className="p-4 text-xs text-slate-500">All products have sufficient stock levels.</p> : (
                      <Table><TH cols={['Product', 'Min', 'Current', 'Suggested Order', 'Action']} />
                        <TableBody className="divide-y divide-slate-100">
                          {low.map((p) => (
                            <TableRow key={p.id}>
                              <TableCell className="font-medium text-slate-900">{p.name}</TableCell>
                              <TableCell>{p.min}</TableCell>
                              <TableCell><Badge variant="outline" className={SC[status(p)]}>{p.qty}</Badge></TableCell>
                              <TableCell className="font-bold text-emerald-900">+{Math.max(1, p.min * reorderMult - p.qty)}</TableCell>
                              <TableCell><Button size="sm" variant="outline" className="border-amber-300 bg-amber-50 text-amber-950 hover:bg-amber-100 font-semibold" onClick={() => openQuickAction(p, 'Stock In')}>Reorder</Button></TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>

                <Card className="border border-slate-200/80 bg-white dark:bg-zinc-900 rounded-xl shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)]">
                  <CardHeader><CardTitle className="text-sm font-bold text-slate-900">Recent Transactions Feed</CardTitle></CardHeader>
                  <CardContent className="overflow-x-auto"><Table><TH cols={['Date', 'Type', 'Product', 'Qty', 'Ref / Note', 'By']} /><TableBody className="divide-y divide-slate-100">{txns.slice(0, 7).map(TxRow)}</TableBody></Table></CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* ---------------- LIVE TELEMETRY HUB VIEW ---------------- */}
          {view === 'Live Telemetry Hub' && (
            <div className="py-2">
              <InventoryStockDashboard />
            </div>
          )}

          {/* ---------------- PRODUCTS VIEW ---------------- */}
          {view === 'Products' && (
            <Card className="border-slate-200"><CardContent className="grid gap-4 p-4">
              {/* Sub-nav switch & View Mode Toggle */}
              <div className="flex flex-wrap items-center justify-between border-b border-slate-200 pb-3 gap-2">
                <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
                  <button onClick={() => setPtab('Products')} className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${ptab === 'Products' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'}`}>Products Directory ({prods.length})</button>
                  <button onClick={() => setPtab('Categories')} className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${ptab === 'Categories' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'}`}>Categories ({cats.length})</button>
                </div>

                {ptab === 'Products' && (
                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                    <button
                      onClick={() => setViewMode('table')}
                      title="Dense Table View"
                      className={`p-1.5 rounded-md text-xs transition-all ${viewMode === 'table' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'}`}
                    >
                      <List className="size-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('grid')}
                      title="Visual Cards View"
                      className={`p-1.5 rounded-md text-xs transition-all ${viewMode === 'grid' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'}`}
                    >
                      <Grid className="size-4" />
                    </button>
                  </div>
                )}
              </div>

              {ptab === 'Products' ? (
                <>
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="relative flex-1 min-w-[200px]">
                      <Search className="absolute left-2.5 top-2.5 size-4 text-slate-400" />
                      <input className={inp + ' pl-8'} placeholder="Search by SKU or product name..." value={q} onChange={(e) => { setQ(e.target.value); setPg(0) }} />
                    </div>
                    <Sel v={fc} set={(v: string) => { setFc(v); setPg(0) }} opts={cats} ph="All Categories" label="Filter by category" />
                    <Sel v={fs} set={(v: string) => { setFs(v); setPg(0) }} opts={['Requires Attention', 'In Stock', 'Low Stock', 'Out of Stock']} ph="All Stock Statuses" label="Filter by stock status" />
                    <Button className="ml-auto" onClick={() => setModal({ k: 'product' })}><Plus className="size-4" />Add Product</Button>
                  </div>

                  {/* Floating Bulk Actions Bar */}
                  {selectedIds.length > 0 && (
                    <div className="flex items-center justify-between rounded-lg bg-slate-900 px-4 py-2.5 text-white text-xs shadow-md animate-in fade-in">
                      <span className="font-medium">Selected <b className="text-emerald-400">{selectedIds.length}</b> products</span>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="destructive" onClick={bulkDelete}><Trash2 className="size-3.5 mr-1" />Bulk Delete ({selectedIds.length})</Button>
                        <Button size="sm" variant="ghost" className="text-slate-300 hover:text-white" onClick={() => setSelectedIds([])}>Deselect All</Button>
                      </div>
                    </div>
                  )}

                  {/* Empty Search & Filter State */}
                  {filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 py-12 text-center bg-slate-50/50">
                      <Search className="size-8 text-slate-400 mb-2" />
                      <h3 className="font-semibold text-slate-900">No matching products found</h3>
                      <p className="text-xs text-slate-500 mt-1 max-w-sm">No inventory items match your current filter settings.</p>
                      <Button size="sm" variant="outline" className="mt-4" onClick={() => { setQ(''); setFc(''); setFs(''); setPg(0) }}>Clear Filters</Button>
                    </div>
                  ) : viewMode === 'table' ? (
                    /* DENSE TABLE VIEW WITH INTERACTIVE COLUMN SORTING */
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-slate-50/80">
                            <TableHead className="w-10">
                              <input
                                type="checkbox"
                                aria-label="Select all products"
                                checked={selectedIds.length > 0 && filtered.every((p) => selectedIds.includes(p.id))}
                                onChange={(e) => {
                                  if (e.target.checked) setSelectedIds(filtered.map((p) => p.id))
                                  else setSelectedIds([])
                                }}
                                className="rounded text-slate-900 focus:ring-slate-900 cursor-pointer"
                              />
                            </TableHead>
                            <TableHead className="font-bold text-slate-800 text-xs cursor-pointer hover:bg-slate-100" onClick={() => toggleSort('sku')}>
                              SKU {sortField === 'sku' ? (sortAsc ? '↑' : '↓') : '↕'}
                            </TableHead>
                            <TableHead></TableHead>
                            <TableHead className="font-bold text-slate-800 text-xs cursor-pointer hover:bg-slate-100" onClick={() => toggleSort('name')}>
                              Name {sortField === 'name' ? (sortAsc ? '↑' : '↓') : '↕'}
                            </TableHead>
                            <TableHead className="font-bold text-slate-800 text-xs cursor-pointer hover:bg-slate-100" onClick={() => toggleSort('cat')}>
                              Category {sortField === 'cat' ? (sortAsc ? '↑' : '↓') : '↕'}
                            </TableHead>
                            <TableHead className="font-bold text-slate-800 text-xs cursor-pointer hover:bg-slate-100" onClick={() => toggleSort('price')}>
                              Price {sortField === 'price' ? (sortAsc ? '↑' : '↓') : '↕'}
                            </TableHead>
                            <TableHead className="font-bold text-slate-800 text-xs cursor-pointer hover:bg-slate-100" onClick={() => toggleSort('qty')}>
                              Stock {sortField === 'qty' ? (sortAsc ? '↑' : '↓') : '↕'}
                            </TableHead>
                            <TableHead className="font-bold text-slate-800 text-xs">Min</TableHead>
                            <TableHead className="font-bold text-slate-800 text-xs">Supplier</TableHead>
                            <TableHead className="font-bold text-slate-800 text-xs">Status</TableHead>
                            <TableHead className="font-bold text-slate-800 text-xs">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filtered.slice(pg * effectivePageSize, (pg + 1) * effectivePageSize).map((p) => (
                            <TableRow key={p.id} className={`hover:bg-slate-50 transition-colors ${selectedIds.includes(p.id) ? 'bg-slate-100/70' : ''}`}>
                              <TableCell className="w-10">
                                <input
                                  type="checkbox"
                                  aria-label={`Select product ${p.name}`}
                                  checked={selectedIds.includes(p.id)}
                                  onChange={(e) => {
                                    if (e.target.checked) setSelectedIds([...selectedIds, p.id])
                                    else setSelectedIds(selectedIds.filter((id) => id !== p.id))
                                  }}
                                  className="rounded text-slate-900 focus:ring-slate-900 cursor-pointer"
                                />
                              </TableCell>
                              <TableCell className="font-mono text-xs font-semibold text-slate-700">{p.sku}</TableCell>
                              <TableCell><div className="flex size-8 items-center justify-center rounded-md bg-slate-100 text-xs font-bold text-slate-700">{p.name[0]}</div></TableCell>
                              <TableCell className="font-semibold text-slate-900 cursor-pointer hover:text-emerald-700 hover:underline" onClick={() => setDrawerProd(p)}>{p.name}</TableCell>
                              <TableCell className="text-slate-600">{p.cat}</TableCell>
                              <TableCell className="font-medium">${p.price.toFixed(2)}</TableCell>
                              <TableCell className="font-bold">{p.qty}</TableCell>
                              <TableCell className="text-slate-500">{p.min}</TableCell>
                              <TableCell className="text-slate-600">{supName(p.sup)}</TableCell>
                              <TableCell><Sb s={status(p)} /></TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-slate-600 hover:bg-slate-100" onClick={() => setDrawerProd(p)} title="Quick View Drawer" aria-label={`View details for ${p.name}`}>
                                    <Eye className="size-4" />
                                  </Button>
                                  <Button size="sm" variant="outline" className="h-8 px-2 text-xs text-emerald-800 bg-emerald-50 border-emerald-300 hover:bg-emerald-100 font-semibold" onClick={() => openQuickAction(p, 'Stock In')} aria-label={`Stock in ${p.name}`}>
                                    <ArrowDownToLine className="size-3.5 mr-1" />In
                                  </Button>
                                  <Button size="sm" variant="outline" className="h-8 px-2 text-xs text-rose-800 bg-rose-50 border-rose-300 hover:bg-rose-100 font-semibold" onClick={() => openQuickAction(p, 'Stock Out')} aria-label={`Stock out ${p.name}`}>
                                    <ArrowUpFromLine className="size-3.5 mr-1" />Out
                                  </Button>
                                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => setModal({ k: 'product', data: p })} aria-label={`Edit ${p.name}`}>
                                    <Pencil className="size-4 text-slate-600" />
                                  </Button>
                                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-red-50" onClick={() => setDeleteConfirm(p)} aria-label={`Delete ${p.name}`}>
                                    <Trash2 className="size-4 text-red-600" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    /* VISUAL CARDS GRID VIEW */
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {filtered.slice(pg * effectivePageSize, (pg + 1) * effectivePageSize).map((p) => (
                        <div key={p.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <div className="flex items-center gap-2">
                                <div className="flex size-9 items-center justify-center rounded-lg bg-slate-100 font-bold text-slate-800 text-sm">
                                  {p.name[0]}
                                </div>
                                <div>
                                  <h3 className="font-bold text-slate-900 text-sm cursor-pointer hover:text-emerald-700" onClick={() => setDrawerProd(p)}>{p.name}</h3>
                                  <p className="font-mono text-[11px] text-slate-500">{p.sku}</p>
                                </div>
                              </div>
                              <Sb s={status(p)} />
                            </div>

                            <div className="mt-3 grid grid-cols-2 gap-2 text-xs border-t border-b border-slate-100 py-2.5 my-2">
                              <div><span className="text-slate-500">Price:</span> <b className="text-slate-900">${p.price.toFixed(2)}</b></div>
                              <div><span className="text-slate-500">Stock:</span> <b className="text-slate-900">{p.qty} units</b></div>
                              <div><span className="text-slate-500">Min Threshold:</span> <span>{p.min}</span></div>
                              <div><span className="text-slate-500">Asset Value:</span> <b className="text-emerald-800">${(p.qty * p.price).toFixed(0)}</b></div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between gap-2 pt-2">
                            <Button size="sm" variant="ghost" className="text-xs text-slate-600" onClick={() => setDrawerProd(p)}>
                              <Eye className="size-3.5 mr-1" /> View Details
                            </Button>
                            <div className="flex gap-1">
                              <Button size="sm" variant="outline" className="bg-emerald-50 text-emerald-900 border-emerald-300" onClick={() => openQuickAction(p, 'Stock In')}>+ In</Button>
                              <Button size="sm" variant="outline" className="bg-rose-50 text-rose-900 border-rose-300" onClick={() => openQuickAction(p, 'Stock Out')}>- Out</Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Density & Pagination Selector */}
                  <div className="flex flex-wrap items-center justify-between text-sm text-slate-500 pt-2 gap-2">
                    <div className="flex items-center gap-2">
                      <span>Showing {filtered.length} products</span>
                      <span className="text-slate-300">|</span>
                      <label className="flex items-center gap-1 text-xs font-medium">
                        Rows per page:
                        <select
                          className="h-7 rounded border border-slate-300 bg-white px-1.5 text-xs text-slate-700 outline-none cursor-pointer"
                          value={pageSize}
                          onChange={(e) => { setPageSize(Number(e.target.value)); setPg(0) }}
                        >
                          <option value={6}>6</option>
                          <option value={12}>12</option>
                          <option value={24}>24</option>
                          <option value={0}>All</option>
                        </select>
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" disabled={pg === 0} onClick={() => setPg(pg - 1)}>Prev</Button>
                      <span>Page {Math.min(pg, pages - 1) + 1} of {pages}</span>
                      <Button size="sm" variant="outline" disabled={pg >= pages - 1} onClick={() => setPg(pg + 1)}>Next</Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="grid gap-3">
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-slate-500">Manage category taxonomy for inventory organization.</p>
                    <Button size="sm" onClick={() => { const n = prompt('New category name:'); if (n?.trim()) { setCats([...cats, n.trim()]); say(`Category "${n.trim()}" added`) } }}><Plus className="size-4" />Add Category</Button>
                  </div>
                  {cats.map((c) => {
                    const assignedProds = prods.filter((p) => p.cat === c)
                    return (
                      <div key={c} className="flex items-center justify-between rounded-lg border border-slate-200 p-3 bg-white hover:border-slate-300 transition-colors">
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-sm text-slate-900">{c}</span>
                          <Badge variant="outline">{assignedProds.length} products</Badge>
                        </div>
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" onClick={() => { const n = prompt('Rename category:', c); if (n?.trim()) { setCats(cats.map((x) => (x === c ? n.trim() : x))); setProds(prods.map((p) => (p.cat === c ? { ...p, cat: n.trim() } : p))); say('Category renamed') } }} aria-label={`Rename category ${c}`}><Pencil className="size-4" /></Button>
                          <Button size="sm" variant="ghost" onClick={() => {
                            if (assignedProds.length > 0) {
                              say(`Cannot delete "${c}": ${assignedProds.length} assigned products.`, () => {
                                setPtab('Products')
                                setFc(c)
                              })
                            } else {
                              setCats(cats.filter((x) => x !== c))
                              say(`Deleted category "${c}"`)
                            }
                          }} aria-label={`Delete category ${c}`}>
                            <Trash2 className="size-4 text-red-600" />
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent></Card>
          )}

          {/* ---------------- INVENTORY OPERATIONS VIEW ---------------- */}
          {view === 'Inventory Operations' && (
            <Card className="border-slate-200"><CardContent className="grid gap-4 p-4">
              <p className="text-xs text-slate-500">Record stock movement transactions and physical inventory count adjustments.</p>
              
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
                <div className="flex flex-wrap gap-2">
                  {['Stock In', 'Stock Out', 'Adjustment'].map((t) => (
                    <Button key={t} size="sm" variant={quickOp.type === t ? 'default' : 'outline'} onClick={() => setQuickOp({ ...quickOp, type: t })}>
                      {t === 'Adjustment' ? 'Stock Adjustment' : t}
                    </Button>
                  ))}
                </div>

                {/* SKU Barcode Scanner Simulator Button */}
                <Button size="sm" variant="outline" className="gap-1.5" onClick={() => {
                  const randomP = prods[Math.floor(Math.random() * prods.length)]
                  openQuickAction(randomP, 'Stock In')
                  say(`Barcode Scanned: ${randomP.sku} (${randomP.name})`)
                }}>
                  <QrCode className="size-4 text-emerald-600" /> Scan SKU Barcode
                </Button>
              </div>

              {/* Operations Form */}
              <div className="grid gap-4 border border-slate-200 rounded-xl p-4 bg-slate-50/50">
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Target Product">
                    <select className={inp} value={quickOp.prod?.id || prods[0]?.id} onChange={(e) => { const p = pname(Number(e.target.value)); setQuickOp({ ...quickOp, prod: p, qty: quickOp.type === 'Adjustment' ? String(p?.qty) : '1' }) }}>
                      {prods.map((x) => <option key={x.id} value={x.id}>{x.sku} · {x.name} (In stock: {x.qty})</option>)}
                    </select>
                  </Field>

                  {quickOp.type === 'Adjustment' ? (
                    <Field label="Physical Count Quantity">
                      <input type="number" min={0} className={inp} value={quickOp.qty || ''} onChange={(e) => setQuickOp({ ...quickOp, qty: e.target.value })} />
                    </Field>
                  ) : (
                    <Field label={quickOp.type === 'Stock In' ? 'Quantity to Add' : 'Quantity to Deduct'}>
                      <input type="number" min={1} className={inp} value={quickOp.qty || ''} onChange={(e) => setQuickOp({ ...quickOp, qty: e.target.value })} />
                    </Field>
                  )}

                  <Field label={quickOp.type === 'Stock In' ? 'PO / Supplier Reference' : quickOp.type === 'Stock Out' ? 'SO / Order Reference' : 'Audit Reason'}>
                    {quickOp.type === 'Adjustment' ? (
                      <select className={inp} value={quickOp.reason || 'Audit'} onChange={(e) => setQuickOp({ ...quickOp, reason: e.target.value })}>
                        {['Audit', 'Damage', 'Expired', 'Correction'].map((r) => <option key={r}>{r}</option>)}
                      </select>
                    ) : (
                      <input className={inp} value={quickOp.ref || ''} onChange={(e) => setQuickOp({ ...quickOp, ref: e.target.value })} placeholder={quickOp.type === 'Stock In' ? 'PO-5001' : 'SO-7001'} />
                    )}
                  </Field>

                  <Field label="Notes / Comments">
                    <input className={inp} value={quickOp.note || ''} onChange={(e) => setQuickOp({ ...quickOp, note: e.target.value })} placeholder="Optional log note" />
                  </Field>
                </div>

                {quickOp.prod && (
                  <div className="rounded-lg bg-white p-3 border border-slate-200 text-xs flex flex-wrap justify-between items-center gap-2">
                    <div>
                      <span className="text-slate-500">Current Stock:</span> <b className="text-slate-900">{quickOp.prod.qty} units</b>
                      {quickOp.type === 'Adjustment' && (
                        <span className="ml-3 font-medium text-slate-700">
                          Variance: {Number(quickOp.qty) - quickOp.prod.qty >= 0 ? '+' : ''}{Number(quickOp.qty) - quickOp.prod.qty} units
                          (${Math.abs((Number(quickOp.qty) - quickOp.prod.qty) * quickOp.prod.price).toFixed(2)})
                        </span>
                      )}
                    </div>
                    {quickOp.type === 'Stock Out' && Number(quickOp.qty) > quickOp.prod.qty && (
                      <div className="text-red-700 font-semibold flex items-center gap-1"><AlertTriangle className="size-4" /> Exceeds available stock ({quickOp.prod.qty})</div>
                    )}
                  </div>
                )}

                <Button
                  disabled={!quickOp.prod || (quickOp.type === 'Stock Out' && Number(quickOp.qty) > quickOp.prod.qty) || !(Number(quickOp.qty) >= 0)}
                  onClick={() => {
                    const targetProd = quickOp.prod || prods[0]
                    record(quickOp.type, targetProd.id, Number(quickOp.qty), quickOp.ref || quickOp.reason || 'Log', quickOp.note || '')
                    setQuickOp({ ...quickOp, open: false })
                  }}
                >
                  Submit {quickOp.type} Transaction
                </Button>
              </div>
            </CardContent></Card>
          )}

          {/* ---------------- SUPPLIERS VIEW ---------------- */}
          {view === 'Suppliers' && (
            <Card className="border-slate-200"><CardContent className="grid gap-4 p-4">
              <div className="flex justify-between items-center">
                <p className="text-xs text-slate-500">Manage vendor contact details and fulfillment ratings.</p>
                {admin && <Button size="sm" onClick={() => setModal({ k: 'supplier' })}><Plus className="size-4" />Add Supplier</Button>}
              </div>
              
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {sups.map((s) => (
                  <div key={s.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-slate-900 text-sm">{s.name}</h3>
                        <Badge variant="outline" className={s.active ? SC['In Stock'] : ''}>{s.active ? 'Active' : 'Inactive'}</Badge>
                      </div>
                      <p className="text-xs text-slate-600 mb-1"><b>Contact:</b> {s.contact}</p>
                      <p className="text-xs text-slate-600 mb-1"><b>Email:</b> {s.email}</p>
                      <p className="text-xs text-slate-600 mb-1"><b>Phone:</b> {s.phone}</p>
                      <p className="text-xs text-slate-500 mb-2 font-mono">{s.address}</p>
                      <div className="text-[11px] bg-slate-50 p-2 rounded-md border border-slate-100 text-slate-600">
                        <b>Categories:</b> {s.cats}
                      </div>
                    </div>
                    {admin && (
                      <div className="pt-3 border-t border-slate-100 mt-3 flex justify-between items-center">
                        <span className="text-[11px] font-semibold text-emerald-700">Fulfillment: {s.rating || '98%'}</span>
                        <Button size="sm" variant="ghost" onClick={() => setModal({ k: 'supplier', data: s })} aria-label={`Edit supplier ${s.name}`}><Pencil className="size-4" /></Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent></Card>
          )}

          {/* ---------------- TRANSACTIONS VIEW ---------------- */}
          {view === 'Transactions' && (
            <Card className="border-slate-200"><CardContent className="grid gap-3 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <input className={inp + ' sm:w-56'} placeholder="Search SKU or product name..." value={tq} onChange={(e) => setTq(e.target.value)} />
                <Sel v={tt} set={setTt} opts={['Stock In', 'Stock Out', 'Adjustment']} ph="All Transaction Types" label="Filter transaction type" />
                <input type="date" className={inp + ' sm:w-40'} aria-label="Start Date" value={d1} onChange={(e) => setD1(e.target.value)} />
                <span className="text-slate-400 text-xs">to</span>
                <input type="date" className={inp + ' sm:w-40'} aria-label="End Date" value={d2} onChange={(e) => setD2(e.target.value)} />

                <div className="ml-auto flex gap-2">
                  <Button variant="outline" size="sm" onClick={exportCsv}><Download className="size-4" />CSV Export</Button>
                  <Button variant="outline" size="sm" onClick={printPdfReport}><Printer className="size-4" />Print PDF</Button>
                </div>
              </div>

              {d1 && d2 && d1 > d2 && (
                <div className="rounded-lg bg-red-50 p-3 border border-red-200 text-xs text-red-700 font-semibold flex items-center gap-2">
                  <AlertTriangle className="size-4 text-red-600 shrink-0" />
                  Invalid Date Range: Start Date cannot be after End Date. Please adjust your date filters.
                </div>
              )}

              {tf.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 py-10 text-center bg-slate-50/50">
                  <Boxes className="size-8 text-slate-400 mb-2" />
                  <h3 className="font-semibold text-slate-900">No transactions match your search</h3>
                  <Button size="sm" variant="outline" className="mt-3" onClick={() => { setTq(''); setTt(''); setD1(''); setD2('') }}>Reset Filters</Button>
                </div>
              ) : (
                <div className="max-h-[60vh] overflow-auto">
                  <Table><TH cols={['Date / Time', 'Type', 'Product', 'Quantity', 'Reference / Reason & Notes', 'Performed By']} />
                    <TableBody>{tf.map(TxRow)}</TableBody>
                  </Table>
                </div>
              )}
              <p className="text-xs text-slate-500">{tf.length} audit records found</p>
            </CardContent></Card>
          )}

          {/* ---------------- REPORTS VIEW ---------------- */}
          {view === 'Reports' && (
            <div className="grid gap-4">
              <div className="flex gap-2">
                {['Inventory Valuation', 'Low-Stock & Reorder', 'Fast vs Slow Moving'].map((r) => (
                  <Button key={r} size="sm" variant={rep === r ? 'default' : 'outline'} onClick={() => setRep(r)}>{r}</Button>
                ))}
              </div>

              {rep === 'Inventory Valuation' && (
                <>
                  <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                    <Kpi t="Total Inventory Value" v={$(value)} i={DollarSign} />
                    <Kpi t="Total Physical Units" v={items.toLocaleString()} i={Boxes} />
                    <Kpi t="Average Unit Valuation" v={currency + (value / (items || 1)).toFixed(2)} i={DollarSign} />
                    <Kpi t="Top Asset Category" v={[...byCat].sort((a, b) => b.value - a.value)[0]?.name || 'N/A'} i={Package} />
                  </div>
                  <Card className="border-slate-200"><CardHeader><CardTitle className="text-sm font-bold text-slate-900">Inventory Capital Valuation by Category ({currency})</CardTitle></CardHeader><CardContent className="h-72"><ResponsiveContainer><BarChart data={byCat}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="name" fontSize={12} /><YAxis fontSize={12} /><Tooltip /><Bar dataKey="value" fill="#059669" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
                </>
              )}

              {rep === 'Low-Stock & Reorder' && (
                <>
                  <div className="grid grid-cols-3 gap-3">
                    <Kpi t="Low Stock Warnings" v={low.length} i={AlertTriangle} c="text-amber-700" />
                    <Kpi t="Out of Stock Emergencies" v={out.length} i={AlertCircle} c="text-red-700" />
                    <Kpi t="Total Units Needed to Reorder" v={[...low, ...out].reduce((a, p) => a + (p.min * reorderMult - p.qty), 0)} i={Truck} />
                  </div>
                  <Card className="border-slate-200"><CardContent className="overflow-x-auto p-4">
                    <Table><TH cols={['Product', 'Supplier', 'Current Stock', 'Min Threshold', 'Suggested Reorder Qty', 'Status']} />
                      <TableBody>
                        {[...out, ...low].map((p) => (
                          <TableRow key={p.id}>
                            <TableCell className="font-semibold">{p.name}</TableCell>
                            <TableCell>{supName(p.sup)}</TableCell>
                            <TableCell>{p.qty}</TableCell>
                            <TableCell>{p.min}</TableCell>
                            <TableCell className="font-bold text-emerald-900">+{p.min * reorderMult - p.qty}</TableCell>
                            <TableCell><Sb s={status(p)} /></TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent></Card>
                </>
              )}

              {rep === 'Fast vs Slow Moving' && (
                <div className="grid gap-4 lg:grid-cols-2">
                  {[['Fast-Moving (Top 5 Outflow)', movers.slice(0, 5), '#0f172a'], ['Slow-Moving (Bottom 5 Outflow)', movers.slice(-5).reverse(), '#94a3b8']].map(([t, d, c]: A) => (
                    <Card key={t} className="border-slate-200"><CardHeader><CardTitle className="text-sm font-bold text-slate-900">{t}</CardTitle></CardHeader><CardContent className="h-64"><ResponsiveContainer><BarChart data={d} layout="vertical"><CartesianGrid strokeDasharray="3 3" horizontal={false} /><XAxis type="number" fontSize={12} /><YAxis type="category" dataKey="name" width={120} fontSize={11} /><Tooltip /><Bar dataKey="sold" fill={c} radius={[0, 4, 4, 0]} name="Units Sold/Issued" /></BarChart></ResponsiveContainer></CardContent></Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ---------------- USER MANAGEMENT VIEW ---------------- */}
          {view === 'User Management' && (admin ? (
            <Card className="border-slate-200"><CardContent className="overflow-x-auto p-4"><Table><TH cols={['Name', 'Email', 'Role', 'Status', 'Last Login']} />
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-semibold">{u.name}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell><Badge variant="outline">{u.role}</Badge></TableCell>
                    <TableCell><Badge variant="outline" className={u.active ? SC['In Stock'] : ''}>{u.active ? 'Active' : 'Inactive'}</Badge></TableCell>
                    <TableCell className="text-slate-500 text-xs font-mono">{u.last}</TableCell>
                  </TableRow>
                ))}
              </TableBody></Table></CardContent></Card>
          ) : <p className="text-slate-500 text-sm">Administrator permissions required.</p>)}

          {/* ---------------- SETTINGS VIEW ---------------- */}
          {view === 'Settings' && (
            <Card className="border-slate-200"><CardContent className="p-5 grid gap-4 max-w-lg">
              <h2 className="font-bold text-base text-slate-900">System Configuration & Preferences</h2>
              <Field label="Currency Symbol">
                <select className={inp} value={currency} onChange={(e) => { setCurrency(e.target.value); say(`Currency symbol set to ${e.target.value}`) }}>
                  <option value="$">$ (USD)</option>
                  <option value="€">€ (EUR)</option>
                  <option value="£">£ (GBP)</option>
                  <option value="₹">₹ (INR)</option>
                </select>
              </Field>
              <Field label="Default Reorder Multiplier">
                <input type="number" min={1} max={5} className={inp} value={reorderMult} onChange={(e) => { setReorderMult(Number(e.target.value) || 2); say('Reorder multiplier updated') }} />
                <span className="text-[11px] text-slate-500">Calculates suggested reorder quantities as (Min Threshold * Multiplier) - Current Qty.</span>
              </Field>
            </CardContent></Card>
          )}
        </main>

        {/* ---------------- MODALS & INTERACTIVE DRAWERS ---------------- */}

        {/* 1. Global Command Palette Modal (Ctrl+K) */}
        {cmdOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-slate-950/60 p-4 backdrop-blur-xs animate-in fade-in" onClick={() => setCmdOpen(false)}>
            <div className="w-full max-w-xl overflow-hidden rounded-xl bg-white shadow-2xl border border-slate-200" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center border-b border-slate-200 px-3">
                <Search className="size-4 text-slate-400 mr-2" />
                <input
                  className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-slate-400 font-medium"
                  placeholder="Type a product, SKU, supplier, or action..."
                  value={cmdQuery}
                  onChange={(e) => setCmdQuery(e.target.value)}
                  autoFocus
                />
                <button onClick={() => setCmdOpen(false)} className="rounded p-1 text-slate-400 hover:text-slate-600"><X className="size-4" /></button>
              </div>

              <div className="max-h-80 overflow-y-auto p-2 text-xs">
                <p className="px-3 py-1.5 font-bold text-slate-400 uppercase tracking-wider text-[10px]">Products & Items</p>
                {prods
                  .filter((p) => (p.name + p.sku).toLowerCase().includes(cmdQuery.toLowerCase()))
                  .slice(0, 5)
                  .map((p) => (
                    <div
                      key={p.id}
                      onClick={() => { setDrawerProd(p); setCmdOpen(false) }}
                      className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Package className="size-4 text-slate-500" />
                        <span className="font-semibold text-slate-900">{p.name}</span>
                        <span className="font-mono text-slate-400 text-[11px]">{p.sku}</span>
                      </div>
                      <Sb s={status(p)} />
                    </div>
                  ))}

                <p className="px-3 py-1.5 font-bold text-slate-400 uppercase tracking-wider text-[10px] mt-2">Navigation Views</p>
                {NAV.map(([l, I]) => (
                  <div
                    key={l}
                    onClick={() => { setView(l); setCmdOpen(false) }}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors font-medium text-slate-800"
                  >
                    <I className="size-4 text-slate-500" />
                    <span>Go to {l}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 2. Real-time Notifications Side Drawer */}
        {notifOpen && (
          <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/40 backdrop-blur-xs animate-in fade-in" onClick={() => setNotifOpen(false)}>
            <div className="w-full max-w-sm h-full bg-white shadow-2xl p-5 border-l border-slate-200 flex flex-col" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <Bell className="size-5 text-emerald-600" />
                  <h3 className="font-bold text-slate-900 text-base">Notifications</h3>
                </div>
                <button onClick={() => setNotifOpen(false)}><X className="size-4 text-slate-400" /></button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3">
                {out.map((p) => (
                  <div key={p.id} className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs">
                    <p className="font-bold text-red-900 flex items-center gap-1.5"><AlertCircle className="size-3.5 text-red-600" /> Out of Stock Emergency</p>
                    <p className="text-slate-700 mt-1"><b>{p.name}</b> (`{p.sku}`) has reached 0 units.</p>
                    <Button size="sm" className="mt-2 text-xs h-7 bg-red-700 text-white" onClick={() => { openQuickAction(p, 'Stock In'); setNotifOpen(false) }}>Restock Now</Button>
                  </div>
                ))}

                {low.map((p) => (
                  <div key={p.id} className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs">
                    <p className="font-bold text-amber-900 flex items-center gap-1.5"><AlertTriangle className="size-3.5 text-amber-600" /> Low Stock Warning</p>
                    <p className="text-slate-700 mt-1"><b>{p.name}</b> is at {p.qty} units (Min: {p.min}).</p>
                  </div>
                ))}
              </div>

              <Button variant="outline" className="w-full mt-4" onClick={() => { setUnreadCount(0); setNotifOpen(false); say('All notifications cleared') }}>
                Mark All as Read
              </Button>
            </div>
          </div>
        )}

        {/* 3. Interactive Product Detail Drawer */}
        {drawerProd && (
          <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/40 backdrop-blur-xs animate-in fade-in" onClick={() => setDrawerProd(null)}>
            <div className="w-full max-w-md h-full bg-white shadow-2xl p-6 border-l border-slate-200 overflow-y-auto flex flex-col justify-between" onClick={(e) => e.stopPropagation()}>
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Package className="size-5 text-emerald-600" />
                    <h3 className="font-bold text-slate-900 text-base">Product Insights</h3>
                  </div>
                  <button onClick={() => setDrawerProd(null)}><X className="size-4 text-slate-400" /></button>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-slate-900">{drawerProd.name}</h2>
                    <Sb s={status(drawerProd)} />
                  </div>
                  <p className="font-mono text-xs text-slate-500">{drawerProd.sku}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-[11px] font-semibold text-slate-500">Current Stock</span>
                    <p className="text-xl font-bold text-slate-900 mt-0.5">{drawerProd.qty} units</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-[11px] font-semibold text-slate-500">Asset Valuation</span>
                    <p className="text-xl font-bold text-emerald-800 mt-0.5">${(drawerProd.qty * drawerProd.price).toFixed(2)}</p>
                  </div>
                </div>

                <div className="space-y-2 text-xs mb-4">
                  <div className="flex justify-between py-1.5 border-b border-slate-100"><span className="text-slate-500">Category:</span> <b className="text-slate-900">{drawerProd.cat}</b></div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100"><span className="text-slate-500">Unit Price:</span> <b className="text-slate-900">${drawerProd.price.toFixed(2)}</b></div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100"><span className="text-slate-500">Min Reorder Threshold:</span> <b className="text-slate-900">{drawerProd.min} units</b></div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100"><span className="text-slate-500">Supplier Contact:</span> <b className="text-slate-900">{supName(drawerProd.sup)}</b></div>
                </div>

                <div className="rounded-lg bg-slate-50 p-3 border border-slate-200 text-xs mb-4">
                  <p className="font-bold text-slate-800 mb-1">Description:</p>
                  <p className="text-slate-600">{drawerProd.desc || 'No additional description provided.'}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-2">
                <Button variant="outline" className="bg-emerald-50 text-emerald-900 border-emerald-300" onClick={() => { openQuickAction(drawerProd, 'Stock In'); setDrawerProd(null) }}>+ Stock In</Button>
                <Button variant="outline" className="bg-rose-50 text-rose-900 border-rose-300" onClick={() => { openQuickAction(drawerProd, 'Stock Out'); setDrawerProd(null) }}>- Stock Out</Button>
              </div>
            </div>
          </div>
        )}

        {/* Product & Supplier Forms */}
        {modal?.k === 'product' && <Modal title={modal.data ? 'Edit Product Details' : 'Add New Product'} onClose={() => setModal(null)}><ProductForm /></Modal>}
        {modal?.k === 'supplier' && <Modal title={modal.data ? 'Edit Supplier Contact' : 'Add New Supplier'} onClose={() => setModal(null)}><SupplierForm /></Modal>}

        {/* Quick Action Modal */}
        {quickOp.open && quickOp.prod && (
          <Modal title={`${quickOp.type}: ${quickOp.prod.name} (${quickOp.prod.sku})`} onClose={() => setQuickOp({ ...quickOp, open: false })}>
            <div className="grid gap-3">
              <div className="rounded-lg bg-slate-50 p-3 border border-slate-200 text-xs flex justify-between">
                <span>Current Stock: <b className="text-slate-900">{quickOp.prod.qty} units</b></span>
                <span>Min Threshold: <b className="text-slate-900">{quickOp.prod.min} units</b></span>
              </div>

              {quickOp.type === 'Adjustment' ? (
                <Field label="New Physical Count Quantity">
                  <input type="number" min={0} className={inp} value={quickOp.qty || ''} onChange={(e) => setQuickOp({ ...quickOp, qty: e.target.value })} autoFocus />
                  {quickOp.qty !== '' && (
                    <p className="text-xs text-slate-600 mt-1">
                      Variance: <b>{Number(quickOp.qty) - quickOp.prod.qty >= 0 ? '+' : ''}{Number(quickOp.qty) - quickOp.prod.qty} units</b> (${Math.abs((Number(quickOp.qty) - quickOp.prod.qty) * quickOp.prod.price).toFixed(2)})
                    </p>
                  )}
                </Field>
              ) : (
                <Field label={quickOp.type === 'Stock In' ? 'Quantity to Add (Receiving)' : 'Quantity to Deduct (Fulfillment)'}>
                  <input type="number" min={1} className={inp} value={quickOp.qty || ''} onChange={(e) => setQuickOp({ ...quickOp, qty: e.target.value })} autoFocus />
                  {quickOp.type === 'Stock Out' && Number(quickOp.qty) > quickOp.prod.qty && (
                    <p className="text-xs font-semibold text-red-600 mt-1 flex items-center gap-1"><AlertTriangle className="size-3.5" /> Exceeds available stock ({quickOp.prod.qty} available)</p>
                  )}
                </Field>
              )}

              <Field label={quickOp.type === 'Stock In' ? 'PO / Supplier Reference' : quickOp.type === 'Stock Out' ? 'SO / Order Reference' : 'Audit Reason'}>
                {quickOp.type === 'Adjustment' ? (
                  <select className={inp} value={quickOp.reason || 'Audit'} onChange={(e) => setQuickOp({ ...quickOp, reason: e.target.value })}>
                    {['Audit', 'Damage', 'Expired', 'Correction'].map((r) => <option key={r}>{r}</option>)}
                  </select>
                ) : (
                  <input className={inp} value={quickOp.ref || ''} onChange={(e) => setQuickOp({ ...quickOp, ref: e.target.value })} placeholder="Reference ID" />
                )}
              </Field>

              <Field label="Notes / Comments">
                <input className={inp} value={quickOp.note || ''} onChange={(e) => setQuickOp({ ...quickOp, note: e.target.value })} placeholder="Optional log note" />
              </Field>

              <Button
                disabled={(quickOp.type === 'Stock Out' && Number(quickOp.qty) > quickOp.prod.qty) || !(Number(quickOp.qty) >= 0)}
                onClick={() => {
                  record(quickOp.type, quickOp.prod.id, Number(quickOp.qty), quickOp.ref || quickOp.reason || 'Log', quickOp.note || '')
                  setQuickOp({ ...quickOp, open: false })
                }}
                className="mt-2"
              >
                Confirm {quickOp.type}
              </Button>
            </div>
          </Modal>
        )}

        {/* Multi-Item Bulk Receive Modal */}
        {bulkModal && (
          <Modal title="Bulk Receive Supplier Shipment (PO)" onClose={() => setBulkModal(false)}>
            <div className="grid gap-3">
              <Field label="Purchase Order (PO) Reference">
                <input className={inp} value={bulkRef} onChange={(e) => setBulkRef(e.target.value)} placeholder="PO-9001" />
              </Field>

              <div className="border border-slate-200 rounded-lg p-3 bg-slate-50 space-y-2">
                <p className="text-xs font-semibold text-slate-700">Received Line Items:</p>
                {bulkItems.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <select
                      className={inp + ' flex-1'}
                      value={item.pid}
                      onChange={(e) => {
                        const newP = Number(e.target.value)
                        setBulkItems(bulkItems.map((row, i) => (i === idx ? { ...row, pid: newP } : row)))
                      }}
                    >
                      {prods.map((p) => <option key={p.id} value={p.id}>{p.sku} · {p.name}</option>)}
                    </select>
                    <input
                      type="number"
                      min={1}
                      className={inp + ' w-24'}
                      value={item.qty}
                      onChange={(e) => {
                        const newQ = e.target.value
                        setBulkItems(bulkItems.map((row, i) => (i === idx ? { ...row, qty: newQ } : row)))
                      }}
                      placeholder="Qty"
                    />
                    {bulkItems.length > 1 && (
                      <button onClick={() => setBulkItems(bulkItems.filter((_, i) => i !== idx))} className="text-red-600 hover:text-red-800 p-1">
                        <X className="size-4" />
                      </button>
                    )}
                  </div>
                ))}
                <Button size="sm" variant="outline" onClick={() => setBulkItems([...bulkItems, { pid: prods[0]?.id || 1, qty: '10' }])}>+ Add Line Item</Button>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => setBulkModal(false)}>Cancel</Button>
                <Button size="sm" onClick={submitBulkReceive}>Receive All Line Items</Button>
              </div>
            </div>
          </Modal>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <Modal title={`Delete "${deleteConfirm.name}"?`} onClose={() => setDeleteConfirm(null)}>
            <div className="grid gap-3">
              <p className="text-xs text-slate-600">
                Are you sure you want to delete <b className="text-slate-900">{deleteConfirm.name} ({deleteConfirm.sku})</b> from the inventory database?
              </p>
              {deleteConfirm.qty > 0 && (
                <div className="rounded-lg bg-amber-50 p-3 border border-amber-300 text-xs text-amber-950 font-medium flex items-center gap-2">
                  <AlertTriangle className="size-4 text-amber-700 shrink-0" />
                  Warning: This item currently has <b>{deleteConfirm.qty} units</b> in stock.
                </div>
              )}
              <div className="flex gap-2 justify-end pt-2">
                <Button variant="outline" size="sm" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
                <Button size="sm" className="bg-red-700 hover:bg-red-800 text-white" onClick={() => deleteProduct(deleteConfirm)}>Delete Product</Button>
              </div>
            </div>
          </Modal>
        )}

        {/* Global Toast Notification */}
        {toast && (
          <div className="fixed bottom-4 right-4 z-50 flex items-center gap-3 rounded-lg bg-slate-900 px-4 py-3 text-xs text-white shadow-xl animate-in fade-in slide-in-from-bottom-2">
            <span>{toast.msg}</span>
            {toast.undoAction && (
              <button
                onClick={() => { toast.undoAction!(); setToast(null) }}
                className="flex items-center gap-1 rounded bg-slate-800 px-2 py-1 font-semibold text-emerald-400 hover:bg-slate-700 transition-colors"
              >
                <RotateCcw className="size-3" /> Undo / View
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
