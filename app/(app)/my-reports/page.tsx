import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Badge from '@/components/ui/Badge'

// Read-only page: a logged-in user's own submitted flags (both text-error
// reports and argument-map reports), with any curator response. Relies on the
// RLS policies added in 20260808010000_flags_curator_response.sql -- users can
// only SELECT their own flags, so no extra filtering is strictly required, but
// filtering explicitly here too for clarity/defense-in-depth.

const statusVariant: Record<string, 'amber' | 'green' | 'stone'> = {
  open:      'amber',
  resolved:  'green',
  dismissed: 'stone',
}

export default async function MyReportsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: textErrors }, { data: argMapFlags }] = await Promise.all([
    supabase
      .from('flagged_errors')
      .select('*, passage:passages(mula_text, section_name, sequence_order, text_id), commentator:commentators(name)')
      .eq('flagged_by', user.id)
      .order('created_at', { ascending: false }),
    supabase
      .from('argument_map_flags')
      .select('*, passage:passages(mula_text, section_name, sequence_order), text:texts(title_transliterated)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false }),
  ])

  const hasAny = (textErrors?.length ?? 0) > 0 || (argMapFlags?.length ?? 0) > 0

  return (
    <div className="max-w-3xl mx-auto px-6 py-8 space-y-10">
      <div>
        <h1 className="text-2xl font-semibold text-stone-900">My Reports</h1>
        <p className="text-stone-500 text-sm mt-1">
          Errors and argument-map issues you've flagged, and any response from the curator.
        </p>
      </div>

      {!hasAny && (
        <p className="text-stone-400 italic text-sm">
          You haven't submitted any reports yet. Use the flag icons on a passage
          or its argument map to report something.
        </p>
      )}

      {(textErrors?.length ?? 0) > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-stone-700 mb-3">
            Text Errors ({textErrors!.length})
          </h2>
          <div className="space-y-3">
            {textErrors!.map((flag: any) => (
              <div key={flag.id} className="bg-white border border-stone-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant={statusVariant[flag.status] ?? 'stone'}>{flag.status}</Badge>
                  <span className="text-xs text-stone-400">
                    {flag.commentator ? flag.commentator.name : 'Mūla text'}
                  </span>
                </div>
                {flag.passage && (
                  <p className="text-xs text-stone-400 font-devanagari truncate mb-1">
                    {flag.passage.mula_text.slice(0, 80)}…
                  </p>
                )}
                <p className="text-sm text-stone-700">{flag.description_of_error}</p>
                <p className="text-xs text-stone-400 mt-1">
                  {new Date(flag.created_at).toLocaleDateString()}
                </p>
                {flag.curator_response && (
                  <div className="mt-3 pt-3 border-t border-stone-100 bg-saffron-50/50 -mx-4 -mb-4 px-4 pb-4 rounded-b-xl">
                    <p className="text-xs font-semibold text-saffron-700 mb-1">Curator response</p>
                    <p className="text-sm text-stone-700">{flag.curator_response}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {(argMapFlags?.length ?? 0) > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-stone-700 mb-3">
            Argument Map Issues ({argMapFlags!.length})
          </h2>
          <div className="space-y-3">
            {argMapFlags!.map((flag: any) => (
              <div key={flag.id} className="bg-white border border-stone-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <Badge variant={statusVariant[flag.status] ?? 'stone'}>{flag.status}</Badge>
                  <span className="text-xs text-stone-400">{flag.issue_type}</span>
                  {flag.text && (
                    <span className="text-xs text-stone-400 font-devanagari">{flag.text.title_transliterated}</span>
                  )}
                  {flag.passage?.section_name && (
                    <span className="text-xs text-stone-400">
                      §{flag.passage.sequence_order} {flag.passage.section_name}
                    </span>
                  )}
                </div>
                {flag.passage && (
                  <p className="text-xs text-stone-400 font-devanagari truncate mb-1">
                    {flag.passage.mula_text.slice(0, 80)}…
                  </p>
                )}
                <p className="text-sm text-stone-700">{flag.description}</p>
                <p className="text-xs text-stone-400 mt-1">
                  {new Date(flag.created_at).toLocaleDateString()}
                </p>
                {flag.curator_response && (
                  <div className="mt-3 pt-3 border-t border-stone-100 bg-saffron-50/50 -mx-4 -mb-4 px-4 pb-4 rounded-b-xl">
                    <p className="text-xs font-semibold text-saffron-700 mb-1">Curator response</p>
                    <p className="text-sm text-stone-700">{flag.curator_response}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
