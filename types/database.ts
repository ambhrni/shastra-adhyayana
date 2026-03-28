export type UserRole = 'learner' | 'curator' | 'admin'
export type ProgressStatus = 'not_started' | 'studied' | 'reviewed' | 'mastered'
export type NoteType = 'nyaya_concept' | 'curator_note' | 'guru_note' | 'technical_grammar'
export type FlagStatus = 'open' | 'resolved' | 'dismissed'

export interface Text {
  id: string
  title: string
  title_transliterated: string
  author: string | null
  description: string | null
  is_published: boolean
  created_at: string
}

export interface Commentator {
  id: string
  name: string
  name_transliterated: string
  period: string | null
  description: string | null
  created_at: string
}

export interface TextCommentator {
  text_id: string
  commentator_id: string
  order_index: number
  commentator?: Commentator
}

export interface LogicalArgumentType {
  id: string
  code: string
  label_english: string
  label_sanskrit: string | null
  description: string | null
  created_at: string
}

export interface Passage {
  id: string
  text_id: string
  section_number: number | null
  section_name: string | null
  subsection_number: number | null
  mula_text: string
  mula_transliterated: string | null
  sequence_order: number
  logical_argument_type_id: string | null
  is_approved: boolean
  created_at: string
  logical_argument_type?: LogicalArgumentType
}

export interface Commentary {
  id: string
  passage_id: string
  commentator_id: string
  commentary_text: string | null
  commentary_transliterated: string | null
  is_approved: boolean
  created_at: string
  commentator?: Commentator
}

export interface PassageNote {
  id: string
  passage_id: string
  note_text: string
  note_type: NoteType
  created_by: string | null
  is_visible_to_learners: boolean
  created_at: string
}

export interface NyayaConcept {
  id: string
  term_sanskrit: string
  term_transliterated: string
  definition_english: string
  definition_sanskrit: string | null
  example_text: string | null
  difficulty_level: number | null
  created_at: string
}

export interface PassageNyayaLink {
  passage_id: string
  nyaya_concept_id: string
  nyaya_concept?: NyayaConcept
}

export interface UserProfile {
  id: string
  display_name: string
  role: UserRole
  created_at: string
  last_active: string
}

export interface UserProgress {
  id: string
  user_id: string
  text_id: string
  passage_id: string
  status: ProgressStatus
  study_count: number
  last_studied_at: string | null
  notes: string | null
}

export interface TutorMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export interface TutorSession {
  id: string
  user_id: string
  passage_id: string
  messages: TutorMessage[]
  session_start: string
  session_end: string | null
}

export interface ParikshaQA {
  question: string
  answer?: string
  feedback?: string
  score_philosophy?: number
  score_sanskrit?: number | null
}

export interface ParikshaSession {
  id: string
  user_id: string
  text_id: string
  passage_id: string | null
  questions_asked: ParikshaQA[]
  answers_given: ParikshaQA[]
  score_philosophy: number | null
  score_sanskrit: number | null
  ai_feedback_text: string | null
  session_date: string
}

export interface FlaggedError {
  id: string
  passage_id: string
  commentator_id: string | null
  flagged_by: string
  description_of_error: string
  status: FlagStatus
  created_at: string
  resolved_at: string | null
  resolved_by: string | null
}

export interface Notebook {
  id: string
  title: string
  description: string | null
  topic_area: string
  notebooklm_url: string
  thumbnail_url: string | null
  display_order: number
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface StudyStreak {
  id: string
  user_id: string
  current_streak: number
  longest_streak: number
  last_study_date: string | null
}
