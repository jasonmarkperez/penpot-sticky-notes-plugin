<script setup lang="ts">
import { onMounted, ref } from "vue";

const theme = ref<string | null>(null);
const noteContent = ref('')
const includeNoteAuthor = ref(true)
const noteThemeSelection = ref(0)

const themes = [
  { name: 'Theme 1', backgroundColor: '#f0ff22', foregroundColor: '#000000' },
  { name: 'Theme 2', backgroundColor: '#dff7ff', foregroundColor: '#000000' },
  { name: 'Theme 3', backgroundColor: '#0c2c38', foregroundColor: '#e5e5e5' },
  { name: 'Theme 4', backgroundColor: '#eacae8', foregroundColor: '#000000' },
  { name: 'Theme 5', backgroundColor: '#276f3c', foregroundColor: '#e5e5e5' },
]

onMounted(() => {
  const url = new URL(window.location.href);

  const initialTheme = url.searchParams.get("theme");

  if (initialTheme) {
    theme.value = initialTheme as string;
  }

  window.addEventListener("message", (event) => {
    if (event.data.type === "theme") {
      theme.value = event.data.content;
    }
  });
});

const addNote = async () => {
  if (noteContent.value.trim().length == 0) {
    noteContent.value = '  '
  }
  parent.postMessage(
    {
      type: 'create-note',
      data: {
        content: noteContent.value ?? ' ',
        includeNoteAuthor: includeNoteAuthor.value,
        noteTheme: themes[noteThemeSelection.value]
      },
    },
    "*"
  );
}

const setTheme = (index: number) => {
  noteThemeSelection.value = index
}
</script>

<template>
  <main :data-theme="theme">
    <p class="mb mt">
      📝 Sticky Notes
    </p>

    <div class="form-group mb">
      <label class="input-label-hidden" for="content">
        Sticky note content
      </label>

      <textarea
        id="content"
        v-model="noteContent"
        class="input w-full mb"
        name="textarea"
        placeholder="Add note content here"
        rows="10"></textarea>

      <div class="checkbox-container mb">
        <input
          class="checkbox-input"
          type="checkbox"
          id="include-note-author"
          v-model="includeNoteAuthor"
        >
        <label for="include-note-author" class="body-small">
          Include author data
        </label>
      </div>
    </div>

    <div class="mb">
      <button
        v-for="(theme, index) of themes"
        class="text-black theme-option mr"
        :class="{'current-option': index == noteThemeSelection}"
        :style="'background-color: ' + theme.backgroundColor + ';'"
        @click="setTheme(index)"
      >
        <span :style="'color: ' + theme.foregroundColor + ';'">
          A
        </span>
      </button>
    </div>

    <button class="w-full mt" type="button" data-appearance="primary" @click="addNote">
      Add sticky note
    </button>
  </main>
</template>

<style scoped>
.mb {
  margin-bottom: 8px;
}
.mt {
  margin-top: 8px;
}
.mr {
  margin-right: 8px;
}
.ml {
  margin-left: 8px;
}

.w-full {
  width: 100%;
}

.text-black {
  color: black;
}

.theme-option {
  width: 24px;
  height: 24px;
}
.current-option {
  border: 2px solid var(--da-primary);
}
</style>