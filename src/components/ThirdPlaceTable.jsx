import { THIRD_PLACE_QUALIFIERS, groupLabel } from '../lib/constants'

// rows: веќе рангирани третопласирани тимови (види lib/standings.js)
export default function ThirdPlaceTable({ rows }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-4 py-2 bg-amber-600 text-white font-bold">
        Третопласирани тимови
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-slate-500 border-b border-slate-200 text-xs">
              <th className="text-left px-3 py-2 font-medium">#</th>
              <th className="text-left px-3 py-2 font-medium">Тим</th>
              <th className="px-2 py-2 font-medium" title="Група">Гр</th>
              <th className="px-2 py-2 font-medium" title="Одиграни">ОД</th>
              <th className="px-2 py-2 font-medium" title="Дадени голови">ДГ</th>
              <th className="px-2 py-2 font-medium" title="Примени голови">ПГ</th>
              <th className="px-2 py-2 font-medium" title="Гол-разлика">ГР</th>
              <th className="px-2 py-2 font-semibold text-slate-700" title="Бодови">Б</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr
                key={r.team_id}
                className={`border-b border-slate-100 last:border-0 ${
                  i < THIRD_PLACE_QUALIFIERS ? 'bg-amber-50' : ''
                }`}
              >
                <td className="px-3 py-2 text-slate-400">{i + 1}</td>
                <td className="px-3 py-2 font-medium text-slate-800">{r.team_name}</td>
                <td className="px-2 py-2 text-center text-slate-600">{groupLabel(r.group_name)}</td>
                <td className="px-2 py-2 text-center text-slate-600">{r.played}</td>
                <td className="px-2 py-2 text-center text-slate-600">{r.goals_for}</td>
                <td className="px-2 py-2 text-center text-slate-600">{r.goals_against}</td>
                <td className="px-2 py-2 text-center text-slate-600">
                  {r.goal_diff > 0 ? `+${r.goal_diff}` : r.goal_diff}
                </td>
                <td className="px-2 py-2 text-center font-bold text-amber-700">{r.points}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={8} className="px-3 py-4 text-center text-slate-400">
                  Сè уште нема доволно одиграни мечеви
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="px-3 py-1.5 text-[11px] text-slate-400 bg-slate-50 border-t border-slate-100">
        Најдобрите {THIRD_PLACE_QUALIFIERS} третопласирани тима (жолто) продолжуваат во
        четвртфинале. Рангирање: бодови, потоа гол-разлика, потоа дадени голови.
      </p>
    </div>
  )
}
