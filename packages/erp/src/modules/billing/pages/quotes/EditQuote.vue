<template>
    <Page :title="title" :loading="loadingPage" back padding="large">
        <Form shortcuts :initial-value="quote" @submit="save" v-model="formValue"
            class="grid xl:grid-cols-[1fr_min-content] gap-6">
            <template #default="{ hasError, hasChanged }">
                <div class="grid gap-6">
                    <div class="grid grid-cols-2 w-full gap-6">
                        <Card>
                            <Grid :gap="1">
                                <TextField name="name" :label="$t('title')" />
                                <div v-if="auth.company?.name">{{ auth.company.name }}</div>
                                <div v-if="auth.company?.address">
                                    {{ auth.company.address }}
                                </div>
                                <div v-if="auth.company?.city">
                                    {{ auth.company.city }} {{ auth.company.zip_code }}
                                </div>
                                <div v-if="auth.company?.country">
                                    {{ auth.company.country }}
                                </div>
                                <div v-if="auth.company?.phone">{{ auth.company.phone }}</div>
                            </Grid>
                        </Card>

                        <Card>
                            <MagicAutocomplete :label="$t('customer')" :store="clientsStore" :get-filters="(str) => ({
                                    $or: {
                                        $contains: { lastname: str, firstname: str },
                                    },
                                })
                                " :getOptionLabel="(opt) => `${opt.firstname} ${opt.lastname}`"
                                :get-option-value="(opt) => opt.id" optionKey="id" name="idClient"
                                :addText="$t(`pages.edit-quote.add-customer`)" can-add @add="isAddClientOpen = true"
                                v-model:options="clientOptions" v-model="idClient" />
                        </Card>
                    </div>
                    <Card>
                        <Repetable name="lines" :label="$t('products')" orderable>
                            <template #default="{ data }">
                                <QuoteLineVue :line="(data as unknown as SaleLine)" />
                            </template>
                            <template #actions="{ addSection }">
                                <Flex :gap="1.5" flex-wrap="wrap" justify-content="center" align-items="center">
                                    <Button type="button" variant="text" @click="addSection({ type: 'product' })">
                                        {{ $t("pages.edit-quote.add-line-product") }}
                                    </Button>
                                    <Button type="button" variant="text" @click="addSection({ type: 'comment' })">
                                        {{ $t("pages.edit-quote.add-line-comment") }}
                                    </Button>
                                    <Button type="button" variant="text" @click="addSection({ type: 'title' })">
                                        {{ $t("pages.edit-quote.add-line-title") }}
                                    </Button>
                                </Flex>
                            </template>
                        </Repetable>
                    </Card>

                    <Card>
                        <HtmlEditor id="modalities" name="modalities" :label="$t('pages.edit-quote.modalities')" />
                    </Card>

                    <Card>
                        <HtmlEditor id="footer" name="footer" :label="$t('pages.edit-quote.footer')" />
                    </Card>
                </div>
                <div class="sticky h-fit top-0 grid gap-6 place-items-center max-xl:hidden">
                    <Card :with-padding="false">
                        <Text typo="title7">
                            {{ $t("pages.edit-quote.total-global") }}
                        </Text>
                        <div class="grid grid-cols-[min-content_1fr] gap-2">
                            <Text typo="title7">
                                {{ $t("pages.edit-quote.without-taxes") }}
                            </Text>
                            <Text typo="title3">
                                {{ $utils.formatPrice(prices.totalPrice) }}
                            </Text>
                            <Text typo="title7">{{ $t("pages.edit-quote.with-taxes") }}</Text>
                            <Text typo="title3">
                                {{ $utils.formatPrice(prices.totalPriceWithTaxes) }}
                            </Text>
                        </div>
                       
                        <CardDivider />
                        <div class="grid grid-cols-[min-content_1fr] items-center gap-6">
                            <Text typo="title6">{{ $t("pages.edit-quote.pdf") }}</Text>
                            <Flex :gap="1" justify-content="end" class="justify-self-end">
                                <IconButton name="download" @click="downloadPdf(quote)" />
                                <IconButton name="preview" @click.stop="preview(quote)" />
                            </Flex>
                            <Text typo="title6">{{ $t("pages.edit-quote.order") }}</Text>
                            <div class="justify-self-end">
                                <Button variant="text">
                                    {{ $t("pages.edit-quote.add-order") }}
                                </Button>
                            </div>
                            <Text typo="title6">{{ $t("email") }}</Text>
                            <div class="justify-self-end">
                                <Button variant="text" color="success" @click="sendMail(quote)">
                                    {{ $t("pages.edit-quote.sendemail") }}
                                </Button>
                            </div>
                        </div>
                    </Card>
                    <Button :disabled="hasError || !hasChanged" :loading="loading" type="submit" v-tooltip="{
                            text: $t('keyboardshortcuts.ctrl+s'),
                            placement: 'bottom',
                        }" color="success" rounded>
                        {{ $t("pages.edit-quote.save") }}
                    </Button>
                </div>
            </template>
        </Form>
    </Page>
    <QuoteSendMail
    @clickDownloadPDF="() => downloadPdf(quoteToSendMail as Quote)"
    @close="quoteToSendMail = null"
    :quote="quoteToSendMail"
  />
  <QuotePreview @close="quoteToPreview = null" :quote="quoteToPreview" />
  <EditClientSidebar @add="onAddClient" v-model:open="isAddClientOpen" />
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import Form from "core/src/components/form/Form.vue";
import TextField from "core/src/components/form/TextField.vue";
import Button from "core/src/components/Button.vue";
import Page from "@/components/Page.vue";
import useQuoteStore from "../../stores/quotes";
import MagicAutocomplete from "core/src/components/magic/MagicAutocomplete.vue";
import useClientStore from "@/stores/clients";
import type { Quote } from "../../types";
import QuoteLineVue from "../../components/quotes/QuoteLine.vue";
import HtmlEditor from "core/src/components/form/HtmlEditor.vue";
import useVatStore from "@/stores/vat";
import Repetable from "core/src/components/form/repetable/Repetable.vue";
import EditClientSidebar from "@/components/clients/EditClientSidebar.vue";
import type Client from "@/types/client";
import Card from "core/src/components/Card.vue";
import { isEmpty } from "lodash";
import useEditPage from "@/components/editpage";
import type { SaleLine } from "@/modules/billing/types";
import useUserStore from "@/stores/user";
import Grid from "core/src/components/layouts/Grid.vue";
import Text from "core/src/components/Text.vue";
import IconButton from "core/src/components/IconButton.vue";
import Flex from "core/src/components/layouts/Flex.vue";
import useQuote from "../../components/quotes/quote";
import QuoteSendMail from "../../components/quotes/QuoteSendMail.vue";
import QuotePreview from "../../components/quotes/QuotePreview.vue";
import CardDivider from "core/src/components/card/CardDivider.vue";

const clientsStore = useClientStore();
const quotesStore = useQuoteStore();
const vatsStore = useVatStore();
const userStore = useUserStore();

const auth = computed(() => userStore.auth);

const isAddClientOpen = ref(false);
const idClient = ref();
const clientOptions = ref();

const formValue = ref<Quote>();

const title = computed(() => {
    if (isAddAction.value) {
        return t("new-quote");
    }
    return `${t("quote")} ${quote.value?.identifier || ""}`;
});

onMounted(() => {
    vatsStore.fetchList();
});

function onAddClient(client: Client) {
    idClient.value = client.id;
    clientOptions.value = [client];
}

const prices = computed(() => {
    let totalPrice = 0;
    let totalPriceWithTaxes = 0;
    if (!formValue.value?.lines) return { totalPrice, totalPriceWithTaxes };
    for (const line of formValue.value.lines) {
        if (!line.qty || !line.unit_price) continue;
        const price = line.qty * line.unit_price;

        const vatPrice = price * (1 + (line.vat?.rate || 0) / 100);
        totalPriceWithTaxes += vatPrice;
        totalPrice += price;
    }
    return {
        totalPrice,
        totalPriceWithTaxes,
    };
});

const {
    downloadPdf,
    preview,
    quoteToPreview,
    sendMail,
    quoteToSendMail,
    edit,
} = useQuote({});

const {
    isAddAction,
    loading,
    loadingPage,
    model: quote,
    router,
    t,
    save,
} = useEditPage<Quote>({
    store: quotesStore,
    populate: ["client.company", "responsible.company", "lines.[vat, sublines]"],
    mapBeforeSave: (data) => {
        if (data.lines) {
            data.lines = data.lines
                .map((line: any) => {
                    const newLine = { ...line };
                    delete newLine.vat;
                    return newLine;
                })
                .filter((line: any) => !isEmpty(line));
        }
        delete data.client;
        return data;
    },
    onAdd: (res) => {
        edit(res);
        quote.value = res;
    },
});
</script>