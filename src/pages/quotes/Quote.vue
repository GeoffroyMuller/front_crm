<template>
  <Page
    :title="`${$t('quote')} ${quote?.identifier || ''}`"
    back
    :loading="!quote"
  >
    <Card :withPadding="false">
      <Flex class="quote-actions" :gap="1">
        <Button
          variant="text"
          @click="$router.push(`/quotes/${id}/edit`)"
          icon="edit"
        >
          {{ $t("edit") }}
        </Button>
        <Button variant="text" @click="setArchived" icon="archive">
          {{ $t("archive") }}
        </Button>
        <Button variant="text" @click="downloadPdf" icon="download">
          {{ $t("download") }}
        </Button>
        <Button variant="text" @click="sendMail" icon="mail">
          {{ $t("send_by_mail") }}
        </Button>
        <Button variant="text" @click.stop="preview" icon="preview">
          {{ $t("preview") }}
        </Button>
      </Flex>
      <div class="quote-content">
        <Grid :gap="5" :columns="1">
          <div class="subtitle">{{ quote.name }}</div>
          <Flex justify-content="space-between">
            <Flex
              direction="column"
              justify-content="center"
              align-items="flex-start"
            >
              <div class="quote-user-title">{{ $t("responsible") }}:</div>
              <div class="text2">
                {{ quote.responsible.firstname }}
                {{ quote.responsible.lastname }}
              </div>
              <div class="text2">
                {{ quote.responsible.email }}
              </div>
            </Flex>
            <Flex
              direction="column"
              justify-content="center"
              align-items="flex-end"
            >
              <div>
                <div class="quote-user-title">{{ $t("customer") }}:</div>
                <div class="text2">
                  {{ quote.client?.firstname }}
                  {{ quote.client?.lastname }}
                </div>
                <div class="text2">
                  {{ quote.client?.address }}
                </div>
              </div>
            </Flex>
          </Flex>

          <Grid :gap="1" :columns="1">
            <div v-for="line in quote.lines" :key="line.id">
              <Card>
                <Grid :gap="1" :columns="4">
                  <Grid :gap="1" :columns="1">
                    <div class="text">{{ $t("description") }}:</div>
                    <div class="text2" v-html="line.description"></div>
                  </Grid>
                  <Grid v-if="line.qty" :gap="1" :columns="1">
                    <div class="text">{{ $t("quantity") }}:</div>
                    <div class="text2">{{ line.qty }}</div>
                  </Grid>
                  <Grid v-if="line.unit_price" :gap="1" :columns="1">
                    <div class="text">{{ $t("unit-price") }}:</div>
                    <div class="text2">
                      {{ $utils.formatPrice(line.unit_price!) }}
                    </div>
                  </Grid>
                  <Grid v-if="line.vat" :gap="1" :columns="1">
                    <div class="text">{{ $t("vat") }}:</div>
                    <div class="text2">{{ line.vat.rate }}%</div>
                  </Grid>
                </Grid>
              </Card>
            </div>
          </Grid>
          <Grid v-if="quote.modalities" :gap="1" :columns="1">
            <div class="text">{{ $t("modalities") }}:</div>
            <div class="text2" v-html="quote.modalities"></div>
          </Grid>
          <Grid v-if="quote.footer" :gap="1" :columns="1">
            <div class="text">{{ $t("footer") }}:</div>
            <div class="text2" v-html="quote.footer"></div>
          </Grid>
        </Grid>
      </div>
    </Card>
    <QuotePreview
      @close="() => (quoteToPreview = null)"
      :quote="quoteToPreview"
    />
    <QuoteSendMail
      @clickDownloadPDF="() => downloadPdf(quoteToSendMail as Quote)"
      @close="quoteToSendMail = null"
      :quote="quoteToSendMail"
    />
  </Page>
</template>

<script lang="ts" setup>
import useEditPage from "@/components/editpage";
import Page from "@/components/Page.vue";
import useQuote from "@/components/quotes/quote";
import QuotePreview from "@/components/quotes/QuotePreview.vue";
import QuoteSendMail from "@/components/quotes/QuoteSendMail.vue";
import Button from "@/core/components/Button.vue";
import Card from "@/core/components/Card.vue";
import Flex from "@/core/components/layouts/Flex.vue";
import Grid from "@/core/components/layouts/Grid.vue";
import useQuoteStore from "@/stores/quotes";
import type { Quote } from "@/types/quote";

const quoteStore = useQuoteStore();

const { model: quote, id } = useEditPage<Quote>({
  store: quoteStore,
  populate: ["client.company", "responsible.company", "lines.[vat, sublines]"],
});

const {
  downloadPdf,
  setArchived,
  quoteToSendMail,
  quoteToPreview,
  preview,
  sendMail,
} = useQuote({ quote });
</script>

<style lang="scss" scoped>
.quote-actions {
  padding: spacing(0.5) spacing(2);
  background-color: color("primary", 50);
  min-height: 37px;
}
.quote-content {
  padding: spacing(2);
  .quote-user-title {
    @include typo(text);
    margin-bottom: spacing(1);
  }
}
</style>
