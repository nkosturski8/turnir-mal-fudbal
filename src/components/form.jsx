// Мали преоформени полиња за админ панелот

const base =
  'w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-pitch-500 disabled:bg-slate-100'

export function Input(props) {
  return <input {...props} className={`${base} ${props.className ?? ''}`} />
}

export function Select({ children, ...props }) {
  return (
    <select {...props} className={`${base} ${props.className ?? ''}`}>
      {children}
    </select>
  )
}

export function Field({ label, children }) {
  return (
    <label className="block">
      {label && <span className="block text-xs font-medium text-slate-500 mb-1">{label}</span>}
      {children}
    </label>
  )
}

export function Button({ variant = 'primary', className = '', ...props }) {
  const variants = {
    primary: 'bg-pitch-600 hover:bg-pitch-700 text-white',
    ghost: 'bg-slate-100 hover:bg-slate-200 text-slate-700',
    danger: 'bg-red-50 hover:bg-red-100 text-red-600 border border-red-200',
  }
  return (
    <button
      {...props}
      className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 ${variants[variant]} ${className}`}
    />
  )
}

export function Card({ title, children, right }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
      {title && (
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-semibold text-slate-800">{title}</h3>
          {right}
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  )
}
