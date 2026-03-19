const Pricing = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#fffaf5] via-[#fffdf8] to-[#f7ede2] px-6 py-24 text-gray-900">
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#5D3A1A]/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-amber-200/40 blur-3xl" />
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-[#5D3A1A]/5 blur-3xl" />
      <div className="pointer-events-none absolute inset-3 rounded-[34px] border border-[#5D3A1A]/20 shadow-[0_0_0_2px_rgba(93,58,26,0.05),0_18px_45px_rgba(93,58,26,0.12)]" />
      <div className="pointer-events-none absolute inset-5 rounded-[30px] border border-amber-300/30 animate-pulse" />

      <div className="relative mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <p className="mb-4 inline-flex rounded-full border border-[#5D3A1A]/20 bg-white/70 px-4 py-1 text-sm font-medium tracking-wide text-[#5D3A1A] shadow-sm backdrop-blur-sm">
            Simple pricing for fast growth
          </p>
          <div className="mb-5 flex items-center justify-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#5D3A1A]/10 bg-white/80 text-lg text-[#5D3A1A] shadow-sm animate-bounce">
              ☕
            </span>
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#5D3A1A]/10 bg-white/80 text-lg text-[#5D3A1A] shadow-sm animate-bounce [animation-delay:120ms]">
              🧋
            </span>
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#5D3A1A]/10 bg-white/80 text-lg text-[#5D3A1A] shadow-sm animate-bounce [animation-delay:240ms]">
              🥐
            </span>
          </div>
          <h1 className="bg-gradient-to-r from-[#4a2f16] via-[#6b4521] to-[#5D3A1A] bg-clip-text text-4xl font-extrabold tracking-tight text-transparent md:text-5xl">
            Choose the plan that fits your business
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-relaxed text-[#5D3A1A]/85 md:text-lg">
            Start, upgrade when you are ready, and scale with tools built for modern teams.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3 lg:gap-10">
          <div className="rounded-[28px] border-2 border-[#5D3A1A]/45 bg-white/90 p-8 shadow-2xl shadow-[#5D3A1A]/15 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01] hover:shadow-2xl hover:shadow-[#5D3A1A]/25 hover:ring-2 hover:ring-[#5D3A1A]/15">
            <h2 className="text-xl font-semibold text-[#5D3A1A]">☕ Starter</h2>
            <div className="mt-5 text-4xl font-bold text-[#5D3A1A]">₹0</div>
            <p className="mt-1 text-sm text-gray-500">INR / month</p>
           

            <button className="mt-6 w-full rounded-xl border border-[#5D3A1A]/30 bg-white py-2.5 text-sm font-semibold tracking-wide text-[#5D3A1A] shadow-md shadow-[#5D3A1A]/10 transition duration-300 hover:-translate-y-0.5 hover:bg-[#fff6ee] hover:shadow-lg hover:shadow-[#5D3A1A]/20">
              Your current plan
            </button>

            <ul className="mt-6 space-y-3 text-sm text-gray-700">
              <li>✓ Digital Menu</li>
              <li>✓ QR Generation</li>
              <li>✓ Basic Orders</li>
            </ul>
          </div>

          <div className="relative rounded-[28px] border-2 border-[#5D3A1A] bg-gradient-to-br from-[#5D3A1A] via-[#6b4521] to-[#4a2f16] p-8 text-white shadow-2xl shadow-[#5D3A1A]/40 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01] hover:shadow-2xl hover:shadow-[#5D3A1A]/55">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-amber-300 px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#5D3A1A] shadow-md shadow-amber-900/20">
              Most Popular
            </span>

            <h2 className="text-xl font-semibold">🧋 Pro</h2>
            <div className="mt-5 text-4xl font-bold">₹1,999</div>
            <p className="mt-1 text-sm text-white/70">INR / month</p>
            {/* <p className="mt-6 text-sm text-white/80">Access to pro</p> */}

            <button className="mt-6 w-full rounded-xl bg-white py-2.5 text-sm font-semibold tracking-wide text-[#5D3A1A] shadow-md shadow-black/15 transition duration-300 hover:-translate-y-0.5 hover:bg-amber-50 hover:shadow-lg hover:shadow-black/25">
              Upgrade to Pro
            </button>

            <ul className="mt-6 space-y-3 text-sm text-white/90">
              <li>✓ Everything in Starter</li>
              <li>✓ Gamification Engine</li>
              <li>✓ CRM Automations</li>
            </ul>

            
          </div>

          <div className="rounded-[28px] border-2 border-[#5D3A1A]/45 bg-white/90 p-8 shadow-2xl shadow-[#5D3A1A]/15 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01] hover:shadow-2xl hover:shadow-[#5D3A1A]/25 hover:ring-2 hover:ring-[#5D3A1A]/15">
            <div className="mb-4 flex items-center gap-2">
              <h2 className="text-xl font-semibold text-[#5D3A1A]">🥐 Elite</h2>
              <span className="rounded-full bg-[#5D3A1A]/10 px-2.5 py-1 text-xs font-semibold text-[#5D3A1A]">
                SPECIAL OFFER
              </span>
            </div>

            <div className="text-4xl font-bold text-[#5D3A1A]">₹0*</div>
            <p className="mt-1 text-sm text-gray-500">₹2,599 for first month</p>

            <button className="mt-6 w-full rounded-xl bg-[#5D3A1A] py-2.5 text-sm font-semibold tracking-wide text-white shadow-md shadow-[#5D3A1A]/25 transition duration-300 hover:-translate-y-0.5 hover:bg-[#4a2f16] hover:shadow-lg hover:shadow-[#5D3A1A]/35">
              Claim free Elite
            </button>

            <ul className="mt-6 space-y-3 text-sm text-gray-700">
              <li>✓ Everything in Pro</li>
              <li>✓ AI Review System</li>
              <li>✓ Custom Branding</li>
             
            </ul>

            {/* <p className="mt-6 text-xs text-gray-500">
              * Maximum 5 seats. Billed ₹2,599 seat/mo after 1 month.
            </p> */}
          </div>
        </div>

      </div>
    </div>
  );
};


export default Pricing;