import { sortStandings } from '../lib/standings'
import { QUALIFY_PER_GROUP, groupLabel } from '../lib/constants'

// rows: редови од погледот group_standings за една група
export default function StandingsTable({ groupName, rows }) {
  const sorted = sortStandings(rows)

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-4 py-2 bg-pitch-700 text-white font-bold">
        Група {groupLabel(groupName)}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-slate-500 border-b border-slate-200 text-xs">
              <th className="text-left px-3 py-2 font-medium">#</th>
              <th className="text-left px-3 py-2 font-medium">Тим</th>
              <th className="px-2 py-2 font-medium" title="Одиграни">ОД</th>
              <th className="px-2 py-2 font-medium" title="Победи">П</th>
              <th className="px-2 py-2 font-medium" title="Нерешено">Н</th>
              <th className="px-2 py-2 font-medium" title="Порази">И</th>
              <th className="px-2 py-2 font-medium" title="Гол-разлика">ГР</th>
              <th className="px-2 py-2 font-semibold text-slate-700" title="Бодови">Б</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((r, i) => (
              <tr
                key={r.team_id}
                className={`border-b border-slate-100 last:border-0 ${
                  i < QUALIFY_PER_GROUP ? 'bg-pitch-50' : ''
                }`}
              >
                <td className="px-3 py-2 text-slate-400">{i + 1}</td>
                <td className="px-3 py-2 font-medium text-slate-800">{r.team_name}</td>
                <td className="px-2 py-2 text-center text-slate-600">{r.played}</td>
                <td className="px-2 py-2 text-center text-slate-600">{r.wins}</td>
                <td className="px-2 py-2 text-center text-slate-600">{r.draws}</td>
                <td className="px-2 py-2 text-center text-slate-600">{r.losses}</td>
                <td className="px-2 py-2 text-center text-slate-600">
                  {r.goal_diff > 0 ? `+${r.goal_diff}` : r.goal_diff}
                </td>
                <td className="px-2 py-2 text-center font-bold text-pitch-700">{r.points}</td>
              </tr>
            ))}
            {sorted.length === 0 && (
              <tr>
                <td colSpan={8} className="px-3 py-4 text-center text-slate-400">
                  Нема тимови
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="px-3 py-1.5 text-[11px] text-slate-400 bg-slate-50 border-t border-slate-100">
        Првите 2 тима (зелено) продолжуваат во елиминации.
      </p>
    </div>
  )
}
