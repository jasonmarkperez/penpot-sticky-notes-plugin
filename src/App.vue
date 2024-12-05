<script setup lang="ts">
import { onMounted, ref } from "vue";

const theme = ref<string | null>(null);
const noteContent = ref('')
const includeNoteAuthor = ref(true)

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
  parent.postMessage(
    {
      type: 'create-note',
      data: {
        content: noteContent.value ?? ' ',
        includeNoteAuthor: includeNoteAuthor.value,
      },
    },
    "*"
  );
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

.w-full {
  width: 100%;
}
</style>