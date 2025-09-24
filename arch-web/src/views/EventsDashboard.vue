<template>
  <div class="page">
    <main class="container">
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
            <label class="label">Name <span class="req">*</span></label>
            <input class="input" v-model.trim="form.name" type="text" required placeholder="e.g. React Workshop, Jazz Concert…" />
          </div>

          <div class="field">
            <label class="label">Start Date (local) <span class="req">*</span></label>
            <input class="input" v-model="form.startLocal" type="datetime-local" required />
          </div>

          <div class="field">
            <label class="label">End Date (local)</label>
            <input class="input" v-model="form.endLocal" type="datetime-local" />
          </div>

          <div class="field">
            <label class="label">Capacity</label>
            <input class="input" v-model.number="form.capacity" type="number" min="0" placeholder="e.g. 50" />
          </div>

          <div class="field">
            <label class="label">Price</label>
            <input class="input" v-model.number="form.price" type="number" step="0.01" min="0" placeholder="e.g. 19.99" />
          </div>

          <div class="field">
            <label class="label">Postcode <span class="req">*</span></label>
            <input class="input" v-model.trim="form.postcode" type="text" required placeholder="e.g. 08001" />
          </div>

          <div class="field">
            <label class="label">Category</label>
            <select class="input" v-model="form.preferenceId">
              <option value="">(None)</option>
              <option value="1288c1f9-f538-4e89-8d7d-5a6396740685">Concerts</option>
              <option value="f18c886a-6058-4503-ac8b-40b99131d053">Sporting Events</option>
            </select>
          </div>

          <div class="field col-2">
            <label class="label">Address <span class="req">*</span></label>
            <input class="input" v-model.trim="form.address" type="text" required placeholder="Street and number" />
          </div>

          <div class="field col-2">
            <label class="label">External URL</label>
            <input class="input" v-model.trim="form.externalUrl" type="url" placeholder="https://…" />
          </div>

          <div class="field col-2">
            <label class="label">Description</label>
            <textarea class="input input--textarea" v-model.trim="form.description" rows="4" placeholder="Describe the event…"></textarea>
          </div>

          <div class="field col-2">
            <label class="label">Organizer</label>
            <input class="input" v-model.trim="form.organizer" type="text" placeholder="e.g. Google" />
          </div>

          <div class="field col-2">
            <label class="label">Image</label>
            <input class="input" type="file" @change="onFileChange" accept="image/*" />
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

      <section class="card card--soft">
        <div class="card__head">
          <h2 class="card__title">
            <span class="title__bar"></span>
            Existing Events
          </h2>
        </div>

        <div class="field col-2 search-box">
          <label class="label">Search Events</label>
          <input class="input" v-model="searchQuery" type="text" placeholder="e.g. concerts, New York, 1001" />
        </div>

        <div v-if="events.length === 0" class="empty">
          <p>No events found. {{ searchQuery ? 'Try a different search term.' : 'Create your first one above.' }}</p>
        </div>

        <div v-else class="table-container">
          <div class="table">
            <div class="table__head">
              <div>Name</div>
              <div>Category</div>
              <div>Start</div>
              <div>End</div>
              <div>Address</div>
              <div>Price</div>
              <div class="right">Actions</div>
            </div>
          </div>
          <div class="table-scroll-container">
            <div class="table table-wrapper">
              <div class="table__row" v-for="ev in events" :key="ev.eventID">
                <div class="stack">
                  <div class="image-wrapper" v-if="ev.imageUrl">
                    <img :src="ev.imageUrl" :alt="`Image for ${ev.name}`" />
                  </div>
                  <div class="strong">{{ ev.name }}</div>
                  <div class="muted">{{ ev.address || "—" }}</div>
                </div>
                <div>{{ ev.preferenceName || "—" }}</div>
                <div>{{ formatDate(ev.startDate) }}</div>
                <div>{{ ev.endDate ? formatDate(ev.endDate) : "—" }}</div>
                <div>{{ ev.address || "—" }}</div>
                <div>{{ ev.price }} €</div>
                <div class="right">
                  <div class="row-actions">
                    <button class="btn btn--tiny" @click="loadForEdit(ev)">Edit</button>
                    <button class="btn btn--tiny btn--danger" @click="onDelete(ev)">Delete</button>
                  </div>
                </div>
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
import { onMounted, reactive, ref, watch } from "vue";
import { EventApi, type EventListDto, type EventDetailDto, type EventCreateDto, type EventUpdateDto, ImageApi, type EventImageCreateDto } from "@/services/api";

const events = ref<EventListDto[]>([]);
const loading = ref(false);
const listError = ref("");
const submitting = ref(false);
const error = ref("");
const notice = ref("");
const editingId = ref<string | null>(null);
const searchQuery = ref("");
const imageFile = ref<File | null>(null); // NUEVO: Ref para el archivo de imagen

// Observa los cambios en searchQuery para recargar la lista
watch(searchQuery, () => {
  fetchEvents();
});

const form = reactive({
  name: "",
  description: "",
  startLocal: "",
  endLocal: "",
  address: "",
  postcode: "",
  capacity: null as number | null,
  price: null as number | null,
  organizer: "",
  externalUrl: "",
  preferenceId: "" as string | null,
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
  form.name = "";
  form.description = "";
  form.startLocal = "";
  form.endLocal = "";
  form.address = "";
  form.postcode = "";
  form.capacity = null;
  form.price = null;
  form.organizer = "";
  form.externalUrl = "";
  form.preferenceId = null;
  imageFile.value = null; // NUEVO: Reinicia el archivo de imagen
}
function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    imageFile.value = target.files[0];
  } else {
    imageFile.value = null;
  }
}
async function fetchEvents() {
  loading.value = true;
  listError.value = "";
  try {
    const pagedResult = await EventApi.list({ q: searchQuery.value });
    events.value = pagedResult.items;
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
  let eventId = editingId.value;

  try {
    if (!form.name.trim()) throw new Error("Name is required.");
    if (!form.startLocal) throw new Error("Start date/time is required.");
    if (!form.address.trim()) throw new Error("Address is required.");
    if (!form.postcode.trim()) throw new Error("Postcode is required.");

    const payload: EventCreateDto = {
      name: form.name.trim(),
      description: form.description?.trim() || undefined,
      startDate: toIsoUtc(form.startLocal),
      endDate: form.endLocal ? toIsoUtc(form.endLocal) : undefined,
      address: form.address.trim(),
      postcode: form.postcode.trim(),
      capacity: form.capacity ?? undefined,
      price: form.price ?? 0.00,
      organizer: form.organizer?.trim() || undefined,
      externalUrl: form.externalUrl?.trim() || undefined,
      preferenceId: form.preferenceId ?? undefined,
    };

    if (editingId.value != null) {
      await EventApi.update(editingId.value, payload);
      notice.value = "Event updated successfully.";
    } else {
      const createdEvent = await EventApi.create(payload);
      notice.value = "Event created successfully.";
      eventId = createdEvent.eventID;
    }

    // NUEVO: Lógica para la subida de imágenes
    if (imageFile.value && eventId) {
      // TODO: Aquí falta la lógica para subir el archivo de imagen a S3 o un servicio similar.
      // Esta lógica te devolvería la URL de la imagen.

      // Por ahora, asumiremos una URL de prueba para la demo.
      // let imageUrl = "https://ejemplo.com/path-a-mi-imagen.jpg";
      // Cuando tengas el código de la subida, reemplaza la línea anterior
      // y asegúrate de que 'imageUrl' contenga la URL real.
      const imageUrl = "https://picsum.photos/400/300";

      const imagePayload: EventImageCreateDto = {
        EventID: eventId,
        ImageURL: imageUrl,
        IsPrimary: true,
      };

      try {
        await ImageApi.upload(imagePayload);
        notice.value += " Image uploaded successfully.";
      } catch (imageError: any) {
        error.value += ` Could not upload image: ${imageError?.message ?? "Unknown error"}`;
      }
    }


    await fetchEvents();
    resetForm();
  } catch (e: any) {
    error.value = e?.message ?? "Could not save the event.";
  } finally {
    submitting.value = false;
  }
}
function loadForEdit(ev: EventDetailDto) {
  editingId.value = ev.eventID ?? null;
  form.name = ev.name ?? "";
  form.description = ev.description ?? "";
  form.startLocal = fromIsoToLocal(ev.startDate);
  form.endLocal = fromIsoToLocal(ev.endDate);
  form.address = ev.address ?? "";
  form.postcode = ev.postcode ?? "";
  form.capacity = ev.capacity ?? null;
  form.price = ev.price ?? null;
  form.organizer = ev.organizer ?? "";
  form.externalUrl = ev.externalUrl ?? "";
  form.preferenceId = ev.preferenceId ?? null;
  imageFile.value = null; // Reiniciamos el archivo para la edición
  notice.value = "";
  error.value = "";
}
async function onDelete(ev: EventListDto) {
  if (!ev.eventID) return;
  const ok = confirm(`Delete the event "${ev.name}"?`);
  if (!ok) return;

  try {
      await EventApi.remove(ev.eventID);
      events.value = events.value.filter(e => e.eventID !== ev.eventID);
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
.table-container {
  display: flex;
  flex-direction: column;
  min-height: 400px; /* NEW: Altura mínima para evitar que colapse */
}

.table-scroll-container {
  max-height: 400px; /* Ajusta esta altura a tu gusto */
  overflow-y: auto;
  padding-bottom: 8px; /* Evita que el último elemento quede pegado */
}

/* NUEVO: Estilo de la barra de desplazamiento */
.table-scroll-container::-webkit-scrollbar {
  width: 8px;
}
.table-scroll-container::-webkit-scrollbar-track {
  background: #111;
  border-radius: 4px;
}
.table-scroll-container::-webkit-scrollbar-thumb {
  background: var(--gold-3);
  border-radius: 4px;
  border: 1px solid rgba(255,255,255,.08);
}
.table-scroll-container::-webkit-scrollbar-thumb:hover {
  background: var(--gold-2);
}

.table {
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
}

.table-wrapper {
  border-top: none;
  border-bottom: 1px solid var(--border);
}

.table__head, .table__row {
  display: grid;
  grid-template-columns: 2.2fr 1.1fr 1.1fr 1.1fr 1.5fr .7fr .9fr;
  gap: 0;
}

.table__head {
  background: linear-gradient(180deg, #15151a, #121218);
  border: 1px solid var(--border);
  font-size: 13px;
  color: var(--muted);
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  position: sticky;
  top: 0;
  z-index: 1;
}
.table__head > div, .table__row > div { padding: 12px 14px; display: flex; align-items: center; }
.table__row { border-top: 1px solid rgba(255,255,255,.05); background: linear-gradient(180deg,#121218,#101015); }
.table__row:hover { background: linear-gradient(180deg,#15151d,#111116); }
.right { justify-content: flex-end; }
.row-actions { display: flex; gap: 8px; }

.stack .strong { font-weight: 600; }
.stack .muted { color: var(--muted); font-size: 12.5px; margin-top: 2px; }

/* NUEVOS ESTILOS PARA LA IMAGEN */
.image-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.1);
  box-shadow: 0 4px 12px rgba(0,0,0,0.25);
}
.image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.stack {
  gap: 8px;
  display: flex;
  flex-direction: row;
  align-items: center;
}

/* Responsive */
@media (max-width: 860px) {
  .grid { grid-template-columns: 1fr; }
  .col-2, .actions { grid-column: auto; }
  .table__head, .table__row { grid-template-columns: 1.7fr 1.2fr 1.2fr 1.5fr .7fr .9fr; }
  .table__head > div:nth-child(5), .table__head > div:nth-child(6),
  .table__row > div:nth-child(5), .table__row > div:nth-child(6) { display: none; }
}
@media (max-width: 640px) {
  .table__head, .table__row { grid-template-columns: 1.8fr 1.3fr .9fr .8fr; }
  .table__head > div:nth-child(3), .table__head > div:nth-child(4),
  .table__row > div:nth-child(3), .table__row > div:nth-child(4) { display: none; }
}
</style>