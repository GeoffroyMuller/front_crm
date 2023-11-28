<template>
  <div class="pdf-viewer pb-4 border border-slate-200 border-solid" v-if="src">
    <div class="pdf-viewer-actions-wrapper pb-4 text-white">
      <div class="pdf-viewer-actions">
        <div>
          <IconButton
            color="white"
            name="chevron_left"
            @click.stop="substractOne()"
          />
          <IconButton
            color="white"
            name="chevron_right"
            @click.stop="addOne()"
          />
        </div>
        <div class="flex w-fit items-center gap-1">
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
          <div>/</div>
          <span v-if="!$_.isNil(totalPages)" class="total">
            {{ `${totalPages}` }}
          </span>
        </div>
        <div>
          <IconButton color="white" name="add" @click.stop="zoomIn()" />
          <IconButton color="white" name="remove" @click.stop="zoomOut()" />
        </div>
      </div>
    </div>

    <canvas ref="canvasRef" />
    <div ref="textRef" class="text-layer"></div>
  </div>
</template>

<script setup lang="ts">
import * as pdfjs from "pdfjs-dist/build/pdf";
import { ref, onMounted, watch } from "vue";
import TextField from "./form/TextField.vue";
import IconButton from "./IconButton.vue";

interface PdfViewerProps {
  src?: string;
  initialZoom?: number;
}

const props = defineProps<PdfViewerProps>();

pdfjs.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js";

const canvasRef = ref<HTMLCanvasElement | null>(null);
const textRef = ref<HTMLDivElement | null>(null);
const currentPage = ref(1);
const totalPages = ref(1);
const zoom = ref(props.initialZoom || 1);
let pdf: any = null;

async function fetchPdf() {
  if (!props.src) return;
  pdf = await pdfjs.getDocument(props.src).promise;
  displayPdf();
}

onMounted(fetchPdf);

watch(
  () => currentPage.value,
  () => {
    displayPdf();
  }
);

watch(() => props.src, fetchPdf);

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

function zoomIn() {
  zoom.value += 0.1;
  displayPdf();
}

function zoomOut() {
  zoom.value -= 0.1;
  displayPdf();
}

async function displayPdf() {
  const canvas = canvasRef.value;
  if (!canvas || !pdf || !textRef.value) return;

  totalPages.value = pdf.numPages;

  const page = await pdf.getPage(currentPage.value);
  const viewport = page.getViewport({ scale: zoom.value });
  const context = canvas.getContext("2d");
  canvas.height = viewport.height;
  canvas.width = viewport.width;

  await page.render({
    canvasContext: context,
    viewport,
  }).promise;
  const textContent = await page.getTextContent();
  pdfjs.renderTextLayer({
    textContent: textContent,
    container: textRef.value,
    viewport,
    textDivs: [],
  });
}
</script>

<style lang="scss">
.pdf-viewer {
  @apply px-12;
  background-color: color("zinc", 200);
  overflow: auto;
  position: relative;
  @apply rounded-sm;
  .pdf-viewer-actions-wrapper {
    @apply -mx-12;
    position: sticky;
    top: 0;
    display: grid;
    place-items: center;
  }
  .pdf-viewer-actions {
    @apply h-12 gap-4 py-0 px-2;
    display: flex;
    width: fit-content;
    align-items: center;
    justify-content: center;
    background-color: color("zinc", 500);
    width: 100%;
    .total {
      @apply ml-1;
    }
    > * {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  canvas {
    background-color: white;
    @apply rounded-sm;
    margin: auto;
    max-width: 1200px;
    display: block;
    border: color("zinc", 300) 1px solid;
  }
  .text-layer {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
    pointer-events: none;
    opacity: hidden;
    z-index: -1;
  }
}
</style>
