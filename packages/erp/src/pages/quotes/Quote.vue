<template>
  <Page
    :title="`${$t('quote')} ${quote?.identifier || ''}`"
    back
    :loading="!quote"
  >
    <Card :with-padding="false">
      <div class="quote-actions">
        <Button variant="text" @click="edit(quote)" icon="edit">
          {{ $t("edit") }}
        </Button>
        <Button
          variant="text"
          @click="setArchived(quote)"
          icon="archive"
          color="danger"
        >
          {{ $t("archive") }}
        </Button>
        <Button
          variant="text"
          @click="downloadPdf(quote)"
          icon="download"
          color="black"
        >
          {{ $t("download") }}
        </Button>
        <Button
          variant="text"
          @click="sendMail(quote)"
          icon="mail"
          color="success"
        >
          {{ $t("send_by_mail") }}
        </Button>
      </div>
      <HtmlPdfPresenter>
        <Iframe class="quote-iframe" v-bind="iframeprops" />
      </HtmlPdfPresenter>
    </Card>
    <QuoteSendMail
      @clickDownloadPDF="() => downloadPdf(quoteToSendMail as Quote)"
      @close="quoteToSendMail = null"
      :quote="quoteToSendMail"
    />
  </Page>
</template>
<script setup lang="ts">
import Button from "core/src/components/Button.vue";
import type { Quote } from "@/types/quote";
import { computed } from "vue";
import Iframe from "core/src/components/Iframe.vue";
import config from "@/const";
import { getJWT } from "core/src/helpers/utils";
import Card from "core/src/components/Card.vue";
import HtmlPdfPresenter from "@/components/HtmlPdfPresenter.vue";
import Page from "@/components/Page.vue";
import useQuote from "@/components/quotes/quote";
import useEditPage from "@/components/editpage";

const {
  quotestore,
  downloadPdf,
  setArchived,
  sendMail,
  quoteToSendMail,
  edit,
} = useQuote({
  afterAction: () => {
    fetchData();
  },
});

const {
  model: quote,
  id,
  fetchData,
} = useEditPage<Quote>({
  store: quotestore,
  populate: ["client.company", "lines.[vat, sublines]"],
});

const iframeprops = computed(() => {
  if (quote.value?.id != null || id != null) {
    return {
      src: `${config.API_URL}/quotes/${quote.value?.id || id}/preview`,
      config: {
        headers: {
          Authorization: getJWT(),
        },
      },
    };
  }
  return null;
});
</script>

<style lang="scss" scoped>
.quote-actions {
  padding: spacing(1) spacing(1.5);
  display: flex;
  align-items: center;
  gap: spacing(1);
}
</style>
