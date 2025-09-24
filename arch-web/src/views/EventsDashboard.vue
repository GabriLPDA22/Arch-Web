<!-- src/views/EventsDashboard.vue -->
<template>
  <div class="page">
    <!-- Hero -->
    <header class="hero">
      <div class="hero__glow"></div>
      <div class="hero__content">
        <h1 class="hero__title">Events Dashboard</h1>
        <p class="hero__subtitle">Create, curate, and publish stunning events with a touch of gold.</p>
      </div>
    </header>

    <main class="container">
      <!-- Creator -->
      <section class="card card--outline">
        <div class="card__head">
          <h2 class="card__title">
            <span class="title__bar"></span>
            {{ editingId ? "Edit Event" : "Create Event" }}
          </h2>
          <div class="card__actions">
            <button class="btn btn--ghost" :disabled="loading" @click="fetchEvents">
              {{ loading ? "Refreshing…" : "Refresh list" }}
            </button>
          </div>
        </div>

        <form class="grid" @submit.prevent="onSubmit">
          <div class="field col-2">
            <label class="label">Title <span class="req">*</span></label>
            <input class="input" v-model.trim="form.title" type="text" required placeholder="e.g. React Workshop, Jazz Concert…" />
          </div>

          <div class="field">
            <label class="label">Start (local) <span class="req">*</span></label>
            <input class="input" v-model="form.startLocal" type="datetime-local" required />
          </div>

          <div class="field">
            <label class="label">End (local)</label>
            <input class="input" v-model="form.endLocal" type="datetime-local" />
          </div>

          <div class="field">
            <label class="label">Category</label>
            <input class="input" v-model.trim="form.category" type="text" placeholder="e.g. Workshop, Music, Networking…" />
          </div>

          <div class="field">
            <label class="label">Capacity</label>
            <input class="input" v-model.number="form.capacity" type="number" min="0" placeholder="e.g. 50" />
          </div>

          <div class="field col-2">
            <label class="label">Location</label>
            <input class="input" v-model.trim="form.location" type="text" placeholder="Address or city" />
          </div>

          <div class="field col-2">
            <label class="label">Image (URL)</label>
            <input class="input" v-model.trim="form.imageUrl" type="url" placeholder="https://…" />
          </div>

          <div class="field col-2">
            <label class="label">Description</label>
            <textarea class="input input--textarea" v-model.trim="form.description" rows="4" placeholder="Describe the event…"></textarea>
          </div>

          <div class="field switch">
            <label class="switch__label">
              <input type="checkbox" v-model="form.isPublic" />
              <span class="switch__track"></span>
              <span class="switch__text">Publicly visible</span>
            </label>
          </div>

          <div class="actions">
            <button class="btn btn--gold" type="submit" :disabled="submitting">
              <span v-if="submitting">Saving…</span>
              <span v-else>{{ editingId ? "Save changes" : "Create event" }}</span>
            </button>
            <button v-if="editingId" type="button" class="btn btn--ghost" @click="resetForm">Cancel</button>
          </div>

          <p v-if="error" class="alert alert--error">{{ error }}</p>
          <p v-if="notice" class="alert alert--ok">{{ notice }}</p>
        </form>
      </section>

      <!-- List -->
      <section class="card card--soft">
        <div class="card__head">
          <h2 class="card__title">
            <span class="title__bar"></span>
            Existing Events
          </h2>
        </div>

        <div v-if="events.length === 0" class="empty">
          <p>No events yet. Create your first one above.</p>
        </div>

        <div v-else class="table">
          <div class="table__head">
            <div>Title</div>
            <div>Start</div>
            <div>End</div>
            <div>Category</div>
            <div>Public</div>
            <div class="right">Actions</div>
          </div>

          <div class="table__row" v-for="ev in events" :key="ev.id">
            <div class="stack">
              <div class="strong">{{ ev.title }}</div>
              <div class="muted">{{ ev.location || "—" }}</div>
            </div>
            <div>{{ formatDate(ev.startDateUtc) }}</div>
            <div>{{ ev.endDateUtc ? formatDate(ev.endDateUtc) : "—" }}</div>
            <div>{{ ev.category || "—" }}</div>
            <div>
              <span :class="['pill', ev.isPublic ? 'pill--ok' : 'pill--muted']">
                {{ ev.isPublic ? "Yes" : "No" }}
              </span>
            </div>
            <div class="right">
              <div class="row-actions">
                <button class="btn btn--tiny" @click="loadForEdit(ev)">Edit</button>
                <button class="btn btn--tiny btn--danger" @click="onDelete(ev)">Delete</button>
              </div>
            </div>
          </div>
        </div>

        <p v-if="listError" class="alert alert--error">{{ listError }}</p>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { EventApi, type EventDto } from "@/services/api";

const events = ref<EventDto[]>([]);
const loading = ref(false);
const listError = ref("");
const submitting = ref(false);
const error = ref("");
const notice = ref("");
const editingId = ref<number | string | null>(null);

const form = reactive({
  title: "",
  description: "",
  startLocal: "",
  endLocal: "",
  location: "",
  capacity: null as number | null,
  category: "",
  isPublic: true,
  imageUrl: "",
});

function toIsoUtc(local: string): string {
  if (!local) return "";
  const dt = new Date(local);
  return new Date(dt.getTime() - dt.getTimezoneOffset() * 60000).toISOString();
}
function fromIsoToLocal(iso?: string): string {
  if (!iso) return "";
  const dt = new Date(iso);
  const off = dt.getTimezoneOffset();
  const local = new Date(dt.getTime() + off * 60000);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${local.getFullYear()}-${pad(local.getMonth() + 1)}-${pad(local.getDate())}T${pad(local.getHours())}:${pad(local.getMinutes())}`;
}
function formatDate(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleString();
}
function resetForm() {
  editingId.value = null;
  error.value = "";
  notice.value = "";
  form.title = "";
  form.description = "";
  form.startLocal = "";
  form.endLocal = "";
  form.location = "";
  form.capacity = null;
  form.category = "";
  form.isPublic = true;
  form.imageUrl = "";
}
async function fetchEvents() {
  loading.value = true;
  listError.value = "";
  try {
    events.value = await EventApi.list();
  } catch (e: any) {
    listError.value = e?.message ?? "Failed to load events.";
  } finally {
    loading.value = false;
  }
}
async function onSubmit() {
  error.value = "";
  notice.value = "";
  submitting.value = true;

  try {
    if (!form.title.trim()) throw new Error("Title is required.");
    if (!form.startLocal) throw new Error("Start date/time is required.");

    const payload: EventDto = {
      title: form.title.trim(),
      description: form.description?.trim() || "",
      startDateUtc: toIsoUtc(form.startLocal),
      endDateUtc: form.endLocal ? toIsoUtc(form.endLocal) : "",
      location: form.location?.trim() || "",
      capacity: form.capacity ?? null,
      category: form.category?.trim() || "",
      isPublic: !!form.isPublic,
      imageUrl: form.imageUrl?.trim() || "",
    };

    if (editingId.value != null) {
      const updated = await EventApi.update(editingId.value, payload);
      const idx = events.value.findIndex(e => e.id === editingId.value);
      if (idx >= 0) events.value[idx] = updated;
      notice.value = "Event updated successfully.";
    } else {
      const created = await EventApi.create(payload);
      events.value.unshift(created);
      notice.value = "Event created successfully.";
    }
    resetForm();
  } catch (e: any) {
    error.value = e?.message ?? "Could not save the event.";
  } finally {
    submitting.value = false;
  }
}
function loadForEdit(ev: EventDto) {
  editingId.value = ev.id ?? null;
  form.title = ev.title ?? "";
  form.description = ev.description ?? "";
  form.startLocal = fromIsoToLocal(ev.startDateUtc);
  form.endLocal = fromIsoToLocal(ev.endDateUtc);
  form.location = ev.location ?? "";
  form.capacity = ev.capacity ?? null;
  form.category = ev.category ?? "";
  form.isPublic = !!ev.isPublic;
  form.imageUrl = ev.imageUrl ?? "";
  notice.value = "";
  error.value = "";
}
async function onDelete(ev: EventDto) {
  if (!ev.id) return;
  const ok = confirm(`Delete the event "${ev.title}"?`);
  if (!ok) return;

  try {
    await EventApi.remove(ev.id);
    events.value = events.value.filter(e => e.id !== ev.id);
  } catch (e: any) {
    alert(e?.message ?? "Could not delete.");
  }
}

onMounted(fetchEvents);
</script>

<style scoped>
/* Make the app truly full-bleed black */
:global(html, body, #app) {
  height: 100%;
  background: #0b0b0d;   /* same as --bg */
}
:global(body) {
  margin: 0;             /* remove default 8px margin that creates white border */
}
:global(#app) {
  min-height: 100dvh;    /* account for mobile URL bars */
  overflow-x: hidden;    /* avoid accidental horizontal scroll */
}

/* ======= THEME (Black & Gold) ======= */
:host, .page {
  --bg: #0b0b0d;
  --bg-2: #111114;
  --surface: #141419;
  --surface-2: #1b1b22;
  --border: rgba(255,255,255,0.08);
  --text: #f1f1f4;
  --muted: #a8a8b3;

  /* Gold gradient (subtle multi-stop for "gilded" feel) */
  --gold-1: #f8d57e;
  --gold-2: #f1c256;
  --gold-3: #d9a83a;
  --gold-4: #b98a25;
  --gold-5: #8a6a1a;
  --gold: linear-gradient(135deg, var(--gold-1) 0%, var(--gold-2) 28%, var(--gold-3) 52%, var(--gold-4) 76%, var(--gold-5) 100%);

  --shadow-1: 0 6px 22px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.03);
  --ring: 0 0 0 3px rgba(240, 195, 70, 0.25);
}

.page {
  background: radial-gradient(1200px 600px at 70% -100px, rgba(255,215,128,0.08), transparent 70%),
              radial-gradient(900px 400px at -10% 10%, rgba(255,215,128,0.06), transparent 70%),
              var(--bg);
  color: var(--text);
}

/* ======= HERO ======= */
.hero {
  position: relative;
  padding: 56px 24px 36px;
  overflow: hidden;
  border-bottom: 1px solid var(--border);
}
.hero__glow {
  position: absolute;
  inset: -10%;
  background:
    radial-gradient(600px 220px at 20% 0%, rgba(255, 210, 120, .16), transparent 60%),
    radial-gradient(800px 300px at 80% 20%, rgba(255, 210, 120, .12), transparent 60%);
  filter: blur(8px);
  pointer-events: none;
}
.hero__content {
  max-width: 1100px;
  margin: 0 auto;
}
.hero__title {
  font-size: clamp(28px, 2.8vw, 44px);
  line-height: 1.1;
  letter-spacing: .3px;
  margin: 0 0 8px;
  background: var(--gold);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: 0 0 24px rgba(255, 205, 110, .12);
}
.hero__subtitle {
  color: var(--muted);
}

/* ======= LAYOUT ======= */
.container {
  max-width: 1100px;
  margin: 28px auto 80px;
  padding: 0 16px;
  display: grid;
  gap: 24px;
}

/* ======= CARDS ======= */
.card {
  background: linear-gradient(180deg, var(--surface), var(--surface-2));
  border-radius: 16px;
  padding: 18px 18px 20px;
  box-shadow: var(--shadow-1);
  position: relative;
  border: 1px solid var(--border);
}
.card--outline::before {
  content: "";
  position: absolute; inset: 0;
  padding: 1px; border-radius: 16px;
  background: var(--gold);
  -webkit-mask:
    linear-gradient(#000 0 0) content-box, 
    linear-gradient(#000 0 0);
  -webkit-mask-composite: xor; mask-composite: exclude;
  pointer-events: none; opacity: .18;
}
.card--soft { background: linear-gradient(180deg, #121218, #101015); }

.card__head {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 14px;
}
.card__title {
  display: flex; align-items: center; gap: 10px;
  font-size: 18px; margin: 0;
}
.title__bar {
  width: 18px; height: 18px; border-radius: 6px;
  background: var(--gold);
  box-shadow: 0 0 0 3px rgba(240,195,70,.15), 0 0 22px rgba(240,195,70,.35);
}

/* ======= FORM GRID ======= */
.grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px 16px;
}
.col-2 { grid-column: span 2; }

.field { display: flex; flex-direction: column; gap: 8px; }
.label {
  font-size: 13px; color: var(--muted);
}
.req { color: var(--gold-2); }

.input {
  appearance: none; outline: none;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(8,8,10,.65);
  color: var(--text);
  border-radius: 12px;
  padding: 12px 14px;
  transition: border .18s ease, box-shadow .18s ease, transform .06s ease;
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.03);
}
.input::placeholder { color: #7f7f8a; }
.input:focus { border-color: rgba(240,195,70,.6); box-shadow: var(--ring); }
.input:hover { border-color: rgba(255,255,255,0.16); }
.input--textarea { resize: vertical; min-height: 108px; }

/* Switch */
.switch { margin-top: 4px; }
.switch__label { display: inline-flex; align-items: center; gap: 10px; cursor: pointer; user-select: none; }
.switch__label input { display: none; }
.switch__track {
  width: 46px; height: 26px; border-radius: 26px; position: relative;
  background: #2a2a33; border: 1px solid rgba(255,255,255,0.08);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.04);
  transition: background .2s ease, border-color .2s ease;
}
.switch__track::after {
  content: ""; position: absolute; top: 2px; left: 2px;
  width: 22px; height: 22px; border-radius: 50%;
  background: linear-gradient(180deg, #1b1b21, #0f0f13);
  border: 1px solid rgba(255,255,255,0.08);
  box-shadow: 0 1px 0 rgba(255,255,255,.06), 0 6px 16px rgba(0,0,0,.6);
  transition: transform .22s cubic-bezier(.2,.7,.2,1.1), box-shadow .2s ease;
}
.switch__label input:checked + .switch__track {
  background: linear-gradient(180deg, #2a2312, #1b160b);
  border-color: rgba(240,195,70,.35);
}
.switch__label input:checked + .switch__track::after {
  transform: translateX(20px);
  box-shadow: 0 1px 0 rgba(255,255,255,.06), 0 6px 18px rgba(240,195,70,.35);
}
.switch__text { color: var(--text); font-size: 14px; }

/* Actions */
.actions { grid-column: span 2; display: flex; gap: 10px; align-items: center; }

/* Buttons */
.btn {
  appearance: none; border: 0; outline: none; cursor: pointer;
  padding: 10px 14px; border-radius: 12px; font-weight: 600;
  color: #0a0a0a; background: #eaeef2;
  transition: transform .04s ease, box-shadow .2s ease, opacity .2s ease, filter .2s ease;
  box-shadow: 0 6px 16px rgba(0,0,0,.35);
}
.btn:active { transform: translateY(1px); }

.btn--gold {
  color: #101015;
  background: var(--gold);
  box-shadow: 0 8px 28px rgba(240,195,70,.35), inset 0 1px 0 rgba(255,255,255,.35);
}
.btn--gold:hover { filter: brightness(1.03); }
.btn--gold:disabled { opacity: .6; cursor: not-allowed; }

.btn--ghost {
  background: linear-gradient(180deg,#16161c,#111116);
  color: var(--text);
  border: 1px solid rgba(255,255,255,0.08);
}
.btn--ghost:hover { border-color: rgba(255,255,255,0.18); }

.btn--tiny {
  padding: 6px 10px; font-weight: 600; border-radius: 10px;
  background: linear-gradient(180deg,#16161c,#101015);
  color: var(--text); border: 1px solid rgba(255,255,255,0.08);
}
.btn--tiny:hover { border-color: rgba(240,195,70,.45); }
.btn--danger { color: #fff; background: linear-gradient(180deg,#2a0f10,#190b0c); border: 1px solid rgba(255,80,80,.25); }
.btn--danger:hover { border-color: rgba(255,80,80,.4); }

/* Alerts */
.alert {
  margin-top: 10px; padding: 10px 12px; border-radius: 10px; font-size: 14px;
  border: 1px solid; background: linear-gradient(180deg,#121216,#0f0f14);
}
.alert--error { color: #ffd7d7; border-color: rgba(255,120,120,.35); }
.alert--ok { color: #fff8e0; border-color: rgba(240,195,70,.35); }

/* Empty */
.empty {
  color: var(--muted);
  padding: 18px; border-radius: 12px;
  background: linear-gradient(180deg,#131318,#111116);
  border: 1px solid var(--border);
}

/* Table */
.table { width: 100%; border: 1px solid var(--border); border-radius: 12px; overflow: hidden; }
.table__head, .table__row {
  display: grid; grid-template-columns: 2.2fr 1.1fr 1.1fr 1fr .7fr .9fr; gap: 0;
}
.table__head {
  background: linear-gradient(180deg,#15151a,#121218);
  border-bottom: 1px solid var(--border);
  font-size: 13px; color: var(--muted);
}
.table__head > div, .table__row > div { padding: 12px 14px; display: flex; align-items: center; }
.table__row { border-top: 1px solid rgba(255,255,255,.05); background: linear-gradient(180deg,#121218,#101015); }
.table__row:hover { background: linear-gradient(180deg,#15151d,#111116); }
.right { justify-content: flex-end; }
.row-actions { display: flex; gap: 8px; }

.stack .strong { font-weight: 600; }
.stack .muted { color: var(--muted); font-size: 12.5px; margin-top: 2px; }

.pill {
  font-size: 12px; line-height: 1; padding: 6px 8px; border-radius: 999px;
  border: 1px solid rgba(255,255,255,.08); background: #17171d; color: var(--muted);
}
.pill--ok {
  color: #241600; background: rgba(240,195,70,.88); border-color: rgba(240,195,70,.2);
  box-shadow: 0 0 0 2px rgba(240,195,70,.15);
}
.pill--muted { background: #141419; }

/* Responsive */
@media (max-width: 860px) {
  .grid { grid-template-columns: 1fr; }
  .col-2, .actions { grid-column: auto; }
  .table__head, .table__row { grid-template-columns: 1.7fr 1.2fr 1.2fr .9fr .7fr .9fr; }
}
@media (max-width: 640px) {
  .table__head, .table__row { grid-template-columns: 1.8fr 1.3fr .9fr .8fr; }
  .table__head > div:nth-child(3), .table__head > div:nth-child(4),
  .table__row > div:nth-child(3), .table__row > div:nth-child(4) { display: none; }
}
</style>
