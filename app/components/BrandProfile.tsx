'use client'

import { useState, useEffect, useRef } from 'react'

type Certifications = {
  sdvosb:        boolean
  wosb:          boolean
  eightA:        boolean
  hubzone:       boolean
  smallBusiness: boolean
}

type BrandProfileData = {
  founderName:    string
  founderTitle:   string
  companyName:    string
  website:        string
  email:          string
  aboutCompany:   string
  naicsCodes:     string
  certifications: Certifications
  headshot:       string | null
  logo:           string | null
}

const STORAGE_KEY = 'zoltha_brand_profile'

const DEFAULT_DATA: BrandProfileData = {
  founderName:   '',
  founderTitle:  '',
  companyName:   '',
  website:       '',
  email:         '',
  aboutCompany:  '',
  naicsCodes:    '',
  certifications: {
    sdvosb:        false,
    wosb:          false,
    eightA:        false,
    hubzone:       false,
    smallBusiness: false,
  },
  headshot: null,
  logo:     null,
}

const CERT_LABELS: { key: keyof Certifications; label: string }[] = [
  { key: 'sdvosb',        label: 'SDVOSB' },
  { key: 'wosb',          label: 'WOSB' },
  { key: 'eightA',        label: '8(a)' },
  { key: 'hubzone',       label: 'HUBZone' },
  { key: 'smallBusiness', label: 'Small Business' },
]

export function BrandProfile() {
  const [isExpanded, setIsExpanded]   = useState(false)
  const [data, setData]               = useState<BrandProfileData>(DEFAULT_DATA)

  const headshotInputRef = useRef<HTMLInputElement>(null)
  const logoInputRef     = useRef<HTMLInputElement>(null)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<BrandProfileData>
        setData(prev => ({ ...prev, ...parsed }))
      }
    } catch {
      // corrupt storage — start fresh
    }
  }, [])

  // Save to localStorage whenever data changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch {
      // storage quota exceeded — ignore silently
    }
  }, [data])

  function handleImageUpload(
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'headshot' | 'logo',
  ) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setData(prev => ({ ...prev, [field]: reader.result as string }))
    }
    reader.readAsDataURL(file)
    e.target.value = '' // reset so same file can be re-selected
  }

  function setField<K extends keyof BrandProfileData>(key: K, value: BrandProfileData[K]) {
    setData(prev => ({ ...prev, [key]: value }))
  }

  function setCert(key: keyof Certifications, value: boolean) {
    setData(prev => ({
      ...prev,
      certifications: { ...prev.certifications, [key]: value },
    }))
  }

  const activeCerts      = CERT_LABELS.filter(c => data.certifications[c.key])
  const hasPreviewContent = !!(data.founderName || data.companyName || data.headshot || data.logo)

  return (
    <div className="rounded-2xl border border-white/[0.09] bg-white/[0.02] backdrop-blur-2xl shadow-2xl shadow-black/40 overflow-hidden mt-4">
      {/* Top accent line */}
      <div className="h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />

      {/* Collapsible header */}
      <button
        type="button"
        onClick={() => setIsExpanded(prev => !prev)}
        className="w-full flex items-center justify-between px-6 py-4 text-left"
      >
        <div className="flex items-center gap-2.5">
          <span className="text-sm">🏛️</span>
          <span className="text-[10px] font-bold text-white/25 uppercase tracking-widest">My Zoltha Brand</span>
          {hasPreviewContent && !isExpanded && (
            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/25 text-emerald-400/70">
              saved
            </span>
          )}
        </div>
        <span className="text-white/20 text-xs">{isExpanded ? '▲' : '▼'}</span>
      </button>

      {isExpanded && (
        <div className="px-6 pb-6 space-y-5">

          {/* Image uploads + name row */}
          <div className="flex gap-4">
            {/* Headshot */}
            <div className="flex flex-col items-center gap-1.5">
              <button
                type="button"
                onClick={() => headshotInputRef.current?.click()}
                className="w-16 h-16 rounded-full border-2 border-dashed border-white/15 hover:border-emerald-500/40 transition-all overflow-hidden flex items-center justify-center bg-white/[0.03] shrink-0"
                title="Upload headshot"
              >
                {data.headshot ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={data.headshot} alt="Headshot" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white/20 text-xl">👤</span>
                )}
              </button>
              <span className="text-[9px] text-white/20">Headshot</span>
              <input
                ref={headshotInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => handleImageUpload(e, 'headshot')}
              />
            </div>

            {/* Logo */}
            <div className="flex flex-col items-center gap-1.5">
              <button
                type="button"
                onClick={() => logoInputRef.current?.click()}
                className="w-16 h-16 rounded-xl border-2 border-dashed border-white/15 hover:border-emerald-500/40 transition-all overflow-hidden flex items-center justify-center bg-white/[0.03] shrink-0"
                title="Upload logo"
              >
                {data.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={data.logo} alt="Logo" className="w-full h-full object-contain p-1" />
                ) : (
                  <span className="text-white/20 text-xl">🏢</span>
                )}
              </button>
              <span className="text-[9px] text-white/20">Logo</span>
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => handleImageUpload(e, 'logo')}
              />
            </div>

            {/* Founder name + title alongside images */}
            <div className="flex-1 space-y-2 min-w-0">
              <input
                type="text"
                value={data.founderName}
                onChange={e => setField('founderName', e.target.value)}
                placeholder="Founder Name"
                className="w-full px-3 py-2 text-xs bg-white/[0.04] border border-white/[0.08] rounded-lg text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-emerald-500/40 transition-all"
              />
              <input
                type="text"
                value={data.founderTitle}
                onChange={e => setField('founderTitle', e.target.value)}
                placeholder="Title / Role"
                className="w-full px-3 py-2 text-xs bg-white/[0.04] border border-white/[0.08] rounded-lg text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-emerald-500/40 transition-all"
              />
            </div>
          </div>

          {/* Company + contact fields */}
          <div className="space-y-2">
            <input
              type="text"
              value={data.companyName}
              onChange={e => setField('companyName', e.target.value)}
              placeholder="Company Name"
              className="w-full px-3.5 py-2.5 text-xs bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-emerald-500/40 transition-all"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={data.website}
                onChange={e => setField('website', e.target.value)}
                placeholder="Website"
                className="w-full px-3 py-2 text-xs bg-white/[0.04] border border-white/[0.08] rounded-lg text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-emerald-500/40 transition-all"
              />
              <input
                type="text"
                value={data.email}
                onChange={e => setField('email', e.target.value)}
                placeholder="Email"
                className="w-full px-3 py-2 text-xs bg-white/[0.04] border border-white/[0.08] rounded-lg text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-emerald-500/40 transition-all"
              />
            </div>
            <textarea
              value={data.aboutCompany}
              onChange={e => setField('aboutCompany', e.target.value)}
              placeholder="About Company — core capabilities, past performance, mission…"
              rows={3}
              className="w-full px-3.5 py-2.5 text-xs bg-white/[0.04] border border-white/[0.08] rounded-xl resize-none text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-emerald-500/40 transition-all leading-relaxed"
            />
            <input
              type="text"
              value={data.naicsCodes}
              onChange={e => setField('naicsCodes', e.target.value)}
              placeholder="Primary NAICS Codes (e.g. 541512, 541330)"
              className="w-full px-3.5 py-2.5 text-xs bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-emerald-500/40 transition-all"
            />
          </div>

          {/* Certifications */}
          <div className="space-y-2">
            <p className="text-[9px] font-bold text-white/25 uppercase tracking-widest">Certifications</p>
            <div className="flex flex-wrap gap-2">
              {CERT_LABELS.map(({ key, label }) => (
                <label
                  key={key}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border cursor-pointer text-[10px] font-medium transition-all select-none ${
                    data.certifications[key]
                      ? 'bg-emerald-500/15 border-emerald-500/35 text-emerald-300'
                      : 'bg-white/[0.03] border-white/[0.08] text-white/30 hover:border-white/20 hover:text-white/50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={data.certifications[key]}
                    onChange={e => setCert(key, e.target.checked)}
                    className="hidden"
                  />
                  {data.certifications[key] ? '✓ ' : ''}{label}
                </label>
              ))}
            </div>
          </div>

          {/* Profile Preview Card */}
          {hasPreviewContent && (
            <div className="rounded-xl border border-white/[0.09] bg-white/[0.03] p-4 space-y-3">
              <p className="text-[9px] font-bold text-white/25 uppercase tracking-widest">Profile Preview</p>

              <div className="flex items-center gap-3">
                {/* Headshot */}
                <div className="w-12 h-12 rounded-full border border-white/10 overflow-hidden bg-white/[0.03] shrink-0 flex items-center justify-center">
                  {data.headshot ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={data.headshot} alt="Headshot" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white/15 text-lg">👤</span>
                  )}
                </div>

                {/* Name + title + company */}
                <div className="min-w-0 flex-1">
                  {data.founderName && (
                    <p className="text-sm font-semibold text-white/80 truncate">{data.founderName}</p>
                  )}
                  {data.founderTitle && (
                    <p className="text-[10px] text-white/40 truncate">{data.founderTitle}</p>
                  )}
                  {data.companyName && (
                    <p className="text-[10px] text-white/30 truncate">{data.companyName}</p>
                  )}
                </div>

                {/* Logo */}
                {data.logo && (
                  <div className="w-10 h-10 rounded-lg border border-white/10 overflow-hidden bg-white/[0.03] shrink-0 flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={data.logo} alt="Logo" className="w-full h-full object-contain p-0.5" />
                  </div>
                )}
              </div>

              {/* Cert badges */}
              {activeCerts.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {activeCerts.map(c => (
                    <span
                      key={c.key}
                      className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400"
                    >
                      {c.label}
                    </span>
                  ))}
                </div>
              )}

              {/* NAICS */}
              {data.naicsCodes.trim() && (
                <p className="text-[9px] text-white/30">
                  <span className="font-bold text-white/20 uppercase tracking-wider mr-1">NAICS</span>
                  {data.naicsCodes}
                </p>
              )}
            </div>
          )}

          {/* Clear profile */}
          {hasPreviewContent && (
            <button
              type="button"
              onClick={() => setData(DEFAULT_DATA)}
              className="text-[9px] text-white/15 hover:text-red-400/50 transition-colors"
            >
              Clear profile
            </button>
          )}

        </div>
      )}
    </div>
  )
}
