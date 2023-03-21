<template>
  <div class="pdf-viewer" v-if="src">
    <div class="pdf-viewer-actions">
      <div>
        <div>
          <TextField
            class="input-number-page"
            type="number"
            :appearance-none="true"
            :min="1"
            :max="totalPages"
            v-model="currentPage"
          />
        </div>
        <span v-if="!$_.isNil(totalPages)">{{ `/ ${totalPages}` }}</span>

        <div>
          <IconButton name="chevron_left" @click.stop="substractOne()" />
          <IconButton name="chevron_right" @click.stop="addOne()" />
        </div>
      </div>
    </div>
    <canvas ref="canvasRef" />
  </div>
</template>

<script setup lang="ts">
import * as pdfjs from "pdfjs-dist/build/pdf";
import { ref, onMounted, watch } from "vue";
import TextField from "./form/TextField.vue";
import IconButton from "./IconButton.vue";

interface PdfViewerProps {
  src?: string;
}

const props = defineProps<PdfViewerProps>();

pdfjs.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js";

const canvasRef = ref<HTMLCanvasElement | null>(null);
const currentPage = ref(1);
const totalPages = ref(1);

onMounted(() => {
  displayPdf();
});

watch(
  () => currentPage.value,
  () => {
    displayPdf();
  }
);

watch(
  () => props.src,
  () => {
    displayPdf();
  }
);

function substractOne() {
  if (currentPage.value - 1 >= 1) {
    currentPage.value--;
  }
}

function addOne() {
  if (currentPage.value + 1 <= totalPages.value) {
    currentPage.value++;
  }
}

async function displayPdf() {
  const canvas = canvasRef.value;
  if (!canvas) return;

  const pdf = await pdfjs.getDocument(props.src).promise;

  totalPages.value = pdf.numPages;

  const page = await pdf.getPage(currentPage.value);
  const viewport = page.getViewport({ scale: 1.0 });
  const context = canvas.getContext("2d");
  canvas.height = viewport.height;
  canvas.width = viewport.width;

  page.render({
    canvasContext: context,
    viewport: viewport,
  });
}
</script>

<style lang="scss">
.pdf-viewer {
  padding: spacing(2) spacing(8);
  background-color: color("zinc", 200);
  .pdf-viewer-actions {
    > * {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: spacing(1);
      margin-bottom: spacing(1);
    }
  }
  canvas {
    background-color: white;
    border-radius: map-deep-get($rounded, "sm");
    margin: auto;
    max-width: 1200px;
    display: block;
  }
}
</style>
