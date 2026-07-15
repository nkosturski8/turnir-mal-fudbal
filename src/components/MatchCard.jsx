import { STAGE_LABELS, STATUS_LABELS, formatDate } from '../lib/constants'

// match: { ...matchRow, home_team, away_team }  (home_team/away_team = {name})
// homeScorers / awayScorers: [{ name, minute }]
export default function MatchCard({ match, homeScorers = [], awayScorers = [] }) {
  const finished = match.status === 'finished'
  const live = match.status === 'live'

  const homeName = match.home_team?.name ?? 'ТБД'
  const awayName = match.away_team?.name ?? 'ТБД'

  const homeWin = finished && match.home_score > match.away_score
  const awayWin = finished && match.away_score > match.home_score

  const label =
    match.stage === 'group'
      ? `Група ${match.group_name ?? ''}${match.round_label ? ' · ' + match.round_label : ''}`
      : STAGE_LABELS[match.stage] ?? ''

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Горна лента */}
      <div className="flex items-center justify-between px-4 py-1.5 bg-slate-50 border-b border-slate-100 text-xs text-slate-500">
        <span className="font-medium text-pitch-700">{label}</span>
        <span className="flex items-center gap-2">
          {match.match_date && <span>{formatDate(match.match_date)}</span>}
          {live && (
            <span className="inline-flex items-center gap-1 text-red-600 font-semibold">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              {STATUS_LABELS[match.status]}
            </span>
          )}
          {!live && <span>{STATUS_LABELS[match.status]}</span>}
        </span>
      </div>

      {/* Резултат */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 px-4 py-3">
        <div className={`text-right font-semibold ${homeWin ? 'text-pitch-700' : 'text-slate-700'}`}>
          {homeName}
        </div>
        <div className="px-3 py-1 rounded-lg bg-slate-900 text-white font-bold tabular-nums text-center min-w-14">
          {finished || live ? `${match.home_score} : ${match.away_score}` : 'vs'}
        </div>
        <div className={`text-left font-semibold ${awayWin ? 'text-pitch-700' : 'text-slate-700'}`}>
          {awayName}
        </div>
      </div>

      {/* Стрелци */}
      {(homeScorers.length > 0 || awayScorers.length > 0) && (
        <div className="grid grid-cols-2 gap-2 px-4 pb-3 text-xs text-slate-500">
          <ul className="text-right space-y-0.5">
            {homeScorers.map((s, i) => (
              <li key={i}>
                ⚽ {s.name}
                {s.minute ? ` ${s.minute}'` : ''}
              </li>
            ))}
          </ul>
          <ul className="text-left space-y-0.5">
            {awayScorers.map((s, i) => (
              <li key={i}>
                {s.minute ? `${s.minute}' ` : ''}
                {s.name} ⚽
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
