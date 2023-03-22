<template>
  <div class="pdf-viewer" v-if="src">
    <div class="pdf-viewer-actions-wrapper">
      <div class="pdf-viewer-actions">
        <div>
          <IconButton name="chevron_left" @click.stop="substractOne()" />
          <IconButton name="chevron_right" @click.stop="addOne()" />
        </div>
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
          <span v-if="!$_.isNil(totalPages)" class="total">
            {{ `/ ${totalPages}` }}
          </span>
        </div>
        <div>
          <IconButton name="add" @click.stop="zoomIn()" />
          <IconButton name="remove" @click.stop="zoomOut()" />
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
const zoom = ref(1);
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
  if (!canvas || !pdf) return;

  totalPages.value = pdf.numPages;

  const page = await pdf.getPage(currentPage.value);
  const viewport = page.getViewport({ scale: zoom.value });
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
  overflow: auto;
  position: relative;
  padding-top: spacing(7);
  .pdf-viewer-actions-wrapper {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
  }
  .pdf-viewer-actions {
    height: spacing(6);
    display: flex;
    width: fit-content;
    align-items: center;
    justify-content: center;
    gap: spacing(1);
    background-color: color("zinc", 300);
    border-radius: 0 0 map-deep-get($rounded, "sm") map-deep-get($rounded, "sm");
    .total {
      margin-left: spacing(0.5);
    }
    > * {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  canvas {
    background-color: white;
    border-radius: map-deep-get($rounded, "sm");
    margin: auto;
    max-width: 1200px;
    display: block;
    border: color("zinc", 300) 1px solid;
  }
}
</style>
