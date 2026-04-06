-- ─────────────────────────────────────────────────────────────────────────────
-- section_argument_types
-- Maps each section (by text_id + section_number) to an argument_type that
-- drives the color coding on the public Argument Map page.
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists public.section_argument_types (
  id               uuid primary key default gen_random_uuid(),
  text_id          uuid not null references public.texts(id) on delete cascade,
  section_number   integer not null,
  section_name     text not null default '',
  argument_type    text not null default 'anumanam'
                     check (argument_type in (
                       'lakshanam', 'pramanam', 'anumanam',
                       'siddhanta', 'opening_closing'
                     )),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  unique (text_id, section_number)
);

-- ── updated_at trigger ────────────────────────────────────────────────────────

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_section_argument_types_updated_at
  before update on public.section_argument_types
  for each row execute function public.set_updated_at();

-- ── Row Level Security ────────────────────────────────────────────────────────

alter table public.section_argument_types enable row level security;

-- Anyone can read (used on the public map page)
create policy "section_argument_types_select_public"
  on public.section_argument_types for select
  using (true);

-- Only curators and admins can insert / update / delete
create policy "section_argument_types_write_curator"
  on public.section_argument_types for insert
  with check (current_user_role() in ('curator', 'admin'));

create policy "section_argument_types_update_curator"
  on public.section_argument_types for update
  using  (current_user_role() in ('curator', 'admin'))
  with check (current_user_role() in ('curator', 'admin'));

create policy "section_argument_types_delete_curator"
  on public.section_argument_types for delete
  using (current_user_role() in ('curator', 'admin'));

-- ── Seed: Vādāvalī (text_id c0219559-a8a9-4ebb-be5b-eca29b921457) ─────────────
--
-- argument_type key (→ colour on map):
--   opening_closing  → stone   §1, §6, §26, §29
--   lakshanam        → orange  §3, §4
--   pramanam         → blue    §5, §11–§14
--   siddhanta        → green   §21–§25, §30–§38
--   anumanam         → red     everything else
--
-- Section names are the Sanskrit adhikaraṇa / prakaraṇa titles as they appear
-- in the passages table.
-- ─────────────────────────────────────────────────────────────────────────────

insert into public.section_argument_types
  (text_id, section_number, section_name, argument_type)
values
  -- ── Jagatsatya (§1–§25) ──────────────────────────────────────────────────
  ('c0219559-a8a9-4ebb-be5b-eca29b921457',  1, 'उपोद्घातः',                      'opening_closing'),
  ('c0219559-a8a9-4ebb-be5b-eca29b921457',  2, 'जगत्सत्त्वानुमानम्',             'anumanam'),
  ('c0219559-a8a9-4ebb-be5b-eca29b921457',  3, 'सत्त्वलक्षणम्',                  'lakshanam'),
  ('c0219559-a8a9-4ebb-be5b-eca29b921457',  4, 'व्यावहारिकसत्त्वलक्षणम्',        'lakshanam'),
  ('c0219559-a8a9-4ebb-be5b-eca29b921457',  5, 'प्रत्यक्षप्रमाणम्',              'pramanam'),
  ('c0219559-a8a9-4ebb-be5b-eca29b921457',  6, 'मायावादखण्डनम्',                 'opening_closing'),
  ('c0219559-a8a9-4ebb-be5b-eca29b921457',  7, 'ब्रह्मानुमानखण्डनम्',            'anumanam'),
  ('c0219559-a8a9-4ebb-be5b-eca29b921457',  8, 'सत्कार्यवादखण्डनम्',             'anumanam'),
  ('c0219559-a8a9-4ebb-be5b-eca29b921457',  9, 'विवर्तवादखण्डनम्',               'anumanam'),
  ('c0219559-a8a9-4ebb-be5b-eca29b921457', 10, 'अज्ञानखण्डनम्',                  'anumanam'),
  ('c0219559-a8a9-4ebb-be5b-eca29b921457', 11, 'आगमप्रमाणम्',                    'pramanam'),
  ('c0219559-a8a9-4ebb-be5b-eca29b921457', 12, 'श्रुतिप्रामाण्यम्',              'pramanam'),
  ('c0219559-a8a9-4ebb-be5b-eca29b921457', 13, 'स्मृतिप्रामाण्यम्',              'pramanam'),
  ('c0219559-a8a9-4ebb-be5b-eca29b921457', 14, 'पुराणप्रामाण्यम्',               'pramanam'),
  ('c0219559-a8a9-4ebb-be5b-eca29b921457', 15, 'ईश्वरानुमानखण्डनम्',             'anumanam'),
  ('c0219559-a8a9-4ebb-be5b-eca29b921457', 16, 'जीवब्रह्मभेदः',                  'anumanam'),
  ('c0219559-a8a9-4ebb-be5b-eca29b921457', 17, 'जडचेतनभेदः',                     'anumanam'),
  ('c0219559-a8a9-4ebb-be5b-eca29b921457', 18, 'जीवजीवभेदः',                     'anumanam'),
  ('c0219559-a8a9-4ebb-be5b-eca29b921457', 19, 'जडजडभेदः',                       'anumanam'),
  ('c0219559-a8a9-4ebb-be5b-eca29b921457', 20, 'ईश्वरजडभेदः',                    'anumanam'),
  ('c0219559-a8a9-4ebb-be5b-eca29b921457', 21, 'पञ्चभेदसिद्धान्तः',              'siddhanta'),
  ('c0219559-a8a9-4ebb-be5b-eca29b921457', 22, 'विष्णुसर्वोत्तमत्वम्',           'siddhanta'),
  ('c0219559-a8a9-4ebb-be5b-eca29b921457', 23, 'मोक्षस्वरूपम्',                  'siddhanta'),
  ('c0219559-a8a9-4ebb-be5b-eca29b921457', 24, 'भक्तिस्वरूपम्',                  'siddhanta'),
  ('c0219559-a8a9-4ebb-be5b-eca29b921457', 25, 'प्रपत्तिस्वरूपम्',               'siddhanta'),
  -- ── Bhedasatya (§26–§40) ────────────────────────────────────────────────
  ('c0219559-a8a9-4ebb-be5b-eca29b921457', 26, 'भेदसत्यत्वोपोद्घातः',            'opening_closing'),
  ('c0219559-a8a9-4ebb-be5b-eca29b921457', 27, 'भेदानुमानम्',                    'anumanam'),
  ('c0219559-a8a9-4ebb-be5b-eca29b921457', 28, 'अभेदश्रुतिखण्डनम्',              'anumanam'),
  ('c0219559-a8a9-4ebb-be5b-eca29b921457', 29, 'भेदसिद्धान्तोपसंहारः',           'opening_closing'),
  ('c0219559-a8a9-4ebb-be5b-eca29b921457', 30, 'तत्त्वज्ञानस्वरूपम्',            'siddhanta'),
  ('c0219559-a8a9-4ebb-be5b-eca29b921457', 31, 'मुक्तिस्वरूपम्',                 'siddhanta'),
  ('c0219559-a8a9-4ebb-be5b-eca29b921457', 32, 'साधनानुष्ठानम्',                 'siddhanta'),
  ('c0219559-a8a9-4ebb-be5b-eca29b921457', 33, 'वैराग्यम्',                      'siddhanta'),
  ('c0219559-a8a9-4ebb-be5b-eca29b921457', 34, 'श्रवणम्',                        'siddhanta'),
  ('c0219559-a8a9-4ebb-be5b-eca29b921457', 35, 'मननम्',                          'siddhanta'),
  ('c0219559-a8a9-4ebb-be5b-eca29b921457', 36, 'निदिध्यासनम्',                   'siddhanta'),
  ('c0219559-a8a9-4ebb-be5b-eca29b921457', 37, 'समाधिः',                         'siddhanta'),
  ('c0219559-a8a9-4ebb-be5b-eca29b921457', 38, 'फलश्रुतिः',                      'siddhanta'),
  ('c0219559-a8a9-4ebb-be5b-eca29b921457', 39, 'पूर्वपक्षखण्डनम्',               'anumanam'),
  ('c0219559-a8a9-4ebb-be5b-eca29b921457', 40, 'उपसंहारः',                       'anumanam')
on conflict (text_id, section_number) do update
  set argument_type = excluded.argument_type,
      section_name  = excluded.section_name,
      updated_at    = now();
