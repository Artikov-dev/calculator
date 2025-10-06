"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Package, Check, X, Sparkles, ShoppingCart, Gift, CreditCard, CheckCircle2 } from "lucide-react"

const BASE_SHIPPING = 10.0
const FREE_THRESHOLD = 100.0
const VALID_COUPONS = new Set(["FREESHIP", "SHIP2025", "WELCOME"])

export default function ShippingCalculator() {
  const [registered, setRegistered] = useState(false)
  const [amount, setAmount] = useState(0)
  const [coupon, setCoupon] = useState("")
  const [couponValid, setCouponValid] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [couponChecked, setCouponChecked] = useState(false)
  const [showCheckoutModal, setShowCheckoutModal] = useState(false)

  const validateCoupon = (code: string) => {
    if (!code) return false
    return VALID_COUPONS.has(code.trim().toUpperCase())
  }

  const handleApplyCoupon = () => {
    const valid = validateCoupon(coupon)
    setCouponValid(valid)
    setCouponChecked(true)
  }

  const compute = () => {
    const parsedAmount = Math.max(0, Number(amount) || 0)
    const freeShipping = registered && (parsedAmount > FREE_THRESHOLD || couponValid)
    const shipping = freeShipping ? 0 : BASE_SHIPPING
    const total = parsedAmount + shipping

    return { amount: parsedAmount, freeShipping, shipping, total }
  }

  const handleCheck = () => {
    setShowResult(true)
  }

  const handleCheckout = () => {
    const result = compute()
    if (result.amount <= 0) {
      alert("Iltimos, xarid summasini kiriting!")
      return
    }
    setShowCheckoutModal(true)
  }

  const handleReset = () => {
    setShowCheckoutModal(false)
    setAmount(0)
    setCoupon("")
    setCouponValid(false)
    setCouponChecked(false)
    setShowResult(false)
  }

  const result = compute()
  const fmt = (v: number) => "$" + v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-6xl grid lg:grid-cols-[1fr_400px] gap-6">
        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-white/10 shadow-2xl"
        >
          {/* Header */}
          <div className="flex gap-4 items-start mb-8">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400 }}
              className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/50"
            >
              <Package className="w-8 h-8 text-white" />
            </motion.div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">Shipping fee kalkulyatori</h1>
              <p className="text-white/60 text-sm md:text-base">
                Registratsiya, summa va kupon asosida shipping bepul yoki to'lanishini tekshiring
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-6">
            {/* Registration Toggle */}
            <div>
              <label className="block text-sm text-white/70 mb-3">Foydalanuvchi holati</label>
              <motion.div whileHover={{ scale: 1.01 }} className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex items-center gap-4">
                  <motion.button
                    type="button"
                    onClick={() => setRegistered(!registered)}
                    className={`relative w-14 h-8 rounded-full transition-colors duration-300 ${
                      registered ? "bg-gradient-to-r from-cyan-400 to-blue-500" : "bg-white/10"
                    }`}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div
                      className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-lg"
                      animate={{ x: registered ? 24 : 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  </motion.button>
                  <div>
                    <motion.div
                      key={registered ? "reg" : "unreg"}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-white font-medium"
                    >
                      {registered ? "Registratsiyadan o'tgan" : "Registratsiyadan o'tmagan"}
                    </motion.div>
                    <div className="text-xs text-white/50 mt-1">Bepul ship faqat registratsiyadan o\'tganlar uchun</div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Amount Input */}
            <div>
              <label htmlFor="amount" className="block text-sm text-white/70 mb-3">
                Xarid summasi (USD)
              </label>
              <motion.div whileHover={{ scale: 1.01 }} whileFocus={{ scale: 1.01 }}>
                <input
                  id="amount"
                  type="number"
                  value={amount || ""}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </motion.div>
              <p className="text-xs text-white/50 mt-2">Misol: 120 — butun yoki kasr qiymat</p>
            </div>

            {/* Coupon Input */}
            <div>
              <label htmlFor="coupon" className="block text-sm text-white/70 mb-3">
                Kupon kodi (majburiy emas)
              </label>
              <div className="flex gap-3">
                <motion.div whileHover={{ scale: 1.01 }} className="flex-1">
                  <input
                    id="coupon"
                    type="text"
                    value={coupon}
                    onChange={(e) => {
                      setCoupon(e.target.value)
                      setCouponChecked(false)
                    }}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all"
                    placeholder="FREESHIP"
                  />
                </motion.div>
                <motion.button
                  type="button"
                  onClick={handleApplyCoupon}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-shadow"
                >
                  Tekshirish
                </motion.button>
              </div>
              <AnimatePresence>
                {couponChecked && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 flex items-center gap-2"
                  >
                    {couponValid ? (
                      <>
                        <Check className="w-4 h-4 text-green-400" />
                        <span className="text-sm text-green-400">Kupon haqiqiy!</span>
                      </>
                    ) : (
                      <>
                        <X className="w-4 h-4 text-red-400" />
                        <span className="text-sm text-red-400">Kupon noto\'g\'ri</span>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Check Button */}
            <motion.button
              type="button"
              onClick={handleCheck}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 text-white font-bold rounded-xl shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-shadow text-lg"
            >
              Shippingni tekshirish
            </motion.button>

            {/* Rules */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10"
            >
              <p className="text-sm text-white/60 leading-relaxed">
                <strong className="text-white/80">Qoidalar:</strong>
                <br />• Faqat <strong className="text-cyan-400">registratsiyadan o\'tgan</strong> mijozlar uchun tekin
                bo\'lishi mumkin
                <br />• Xarid summasi <strong className="text-cyan-400">&gt; $100</strong> yoki haqiqiy kupon bo\'lsa
                tekin
                <br />• Aks holda shipping haqqi ushlab qoladi
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Summary Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-2xl h-fit sticky top-8"
        >
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Xisob-kitob
          </h2>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-white/60">Mahsulotlar summasi</span>
              <motion.span
                key={result.amount}
                initial={{ scale: 1.2, color: "#22d3ee" }}
                animate={{ scale: 1, color: "#ffffff" }}
                className="text-xl font-bold"
              >
                {fmt(result.amount)}
              </motion.span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-white/60">Shipping (bazaviy)</span>
              <span className="px-3 py-1 bg-white/10 rounded-full text-sm">{fmt(BASE_SHIPPING)}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-white/60">Kupon holati</span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={couponValid ? "valid" : coupon ? "invalid" : "none"}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className={`px-3 py-1 rounded-full text-sm ${
                    couponValid
                      ? "bg-green-500/20 text-green-400"
                      : coupon
                        ? "bg-red-500/20 text-red-400"
                        : "bg-white/10 text-white/60"
                  }`}
                >
                  {couponValid ? "Haqiqiy" : coupon ? "Noto'g'ri" : "Yo'q"}
                </motion.span>
              </AnimatePresence>
            </div>

            <div className="h-px bg-white/10 my-4" />

            <div className="flex justify-between items-center">
              <span className="text-white/70">Shipping to\'lov</span>
              <motion.span
                key={result.shipping}
                initial={{ scale: 1.2, color: result.freeShipping ? "#22c55e" : "#ef4444" }}
                animate={{ scale: 1, color: "#ffffff" }}
                className="text-xl font-bold"
              >
                {fmt(result.shipping)}
              </motion.span>
            </div>

            <div className="flex justify-between items-center text-lg">
              <span className="text-white font-semibold">Jami</span>
              <motion.span
                key={result.total}
                initial={{ scale: 1.3, color: "#22d3ee" }}
                animate={{ scale: 1, color: "#ffffff" }}
                className="text-2xl font-bold"
              >
                {fmt(result.total)}
              </motion.span>
            </div>

            {/* Result Box */}
            <AnimatePresence mode="wait">
              {showResult && (
                <motion.div
                  key={result.freeShipping ? "free" : "paid"}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className={`p-4 rounded-xl border ${
                    result.freeShipping ? "bg-green-500/10 border-green-500/30" : "bg-red-500/10 border-red-500/30"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <motion.div
                      initial={{ rotate: -180, scale: 0 }}
                      animate={{ rotate: 0, scale: 1 }}
                      transition={{ type: "spring", stiffness: 200 }}
                    >
                      {result.freeShipping ? (
                        <Gift className="w-6 h-6 text-green-400" />
                      ) : (
                        <Package className="w-6 h-6 text-red-400" />
                      )}
                    </motion.div>
                    <div>
                      <div className={`font-bold ${result.freeShipping ? "text-green-400" : "text-red-400"}`}>
                        {result.freeShipping ? "Shipping tekin!" : "Shipping tekin emas"}
                      </div>
                      <div className="text-sm text-white/60 mt-1">
                        {result.freeShipping
                          ? "Tabriklar — shipping bekor qilindi"
                          : !registered
                            ? "Registratsiyadan o'tgan bo'ling"
                            : result.amount <= FREE_THRESHOLD && !couponValid
                              ? `Summa $${FREE_THRESHOLD} dan kichik`
                              : "Shartlar bajarilmadi"}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Checkout Button */}
            <motion.button
              onClick={handleCheckout}
              disabled={result.amount <= 0}
              whileHover={result.amount > 0 ? { scale: 1.02 } : {}}
              whileTap={result.amount > 0 ? { scale: 0.98 } : {}}
              className={`w-full py-4 font-bold rounded-xl shadow-xl transition-all mt-4 flex items-center justify-center gap-2 ${
                result.amount > 0
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-purple-500/30 hover:shadow-purple-500/50"
                  : "bg-white/5 text-white/30 cursor-not-allowed"
              }`}
            >
              <CreditCard className="w-5 h-5" />
              Checkout
            </motion.button>
          </div>

          {/* Quick Rules */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10"
          >
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Qisqacha qoidalar
            </h3>
            <ol className="text-xs text-white/60 space-y-2 pl-4 list-decimal">
              <li>Registratsiyadan o\'tganlar uchun shartlar qo\'llanadi</li>
              <li>Xarid summasi $100 dan yuqori bo\'lsa — shipping tekin</li>
              <li>Yoki haqiqiy kupon bo\'lsa — shipping tekin</li>
            </ol>
          </motion.div>
        </motion.div>
      </div>

      <AnimatePresence>
        {showCheckoutModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowCheckoutModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-gradient-to-br from-slate-900 to-blue-900 rounded-2xl p-8 max-w-md w-full border border-white/20 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/50"
              >
                <CheckCircle2 className="w-10 h-10 text-white" />
              </motion.div>

              <h2 className="text-2xl font-bold text-white text-center mb-4">Buyurtma muvaffaqiyatli!</h2>

              <div className="space-y-3 mb-6 bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Mahsulotlar:</span>
                  <span className="text-white font-semibold">{fmt(result.amount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Shipping:</span>
                  <span className={`font-semibold ${result.freeShipping ? "text-green-400" : "text-white"}`}>
                    {result.freeShipping ? "TEKIN" : fmt(result.shipping)}
                  </span>
                </div>
                <div className="h-px bg-white/10 my-2" />
                <div className="flex justify-between">
                  <span className="text-white font-semibold">Jami to'lov:</span>
                  <span className="text-xl font-bold text-cyan-400">{fmt(result.total)}</span>
                </div>
              </div>

              {result.freeShipping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mb-6 p-3 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-2"
                >
                  <Gift className="w-5 h-5 text-green-400" />
                  <span className="text-sm text-green-400">Shipping tekin qilindi!</span>
                </motion.div>
              )}

              <p className="text-white/60 text-sm text-center mb-6">
                Buyurtmangiz qabul qilindi va tez orada yetkazib beriladi.
              </p>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowCheckoutModal(false)}
                  className="flex-1 py-3 bg-white/10 text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-colors"
                >
                  Yopish
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleReset}
                  className="flex-1 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-shadow"
                >
                  Yangi buyurtma
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
