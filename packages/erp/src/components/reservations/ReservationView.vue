<template>
  <div class="reservation-view">
    <Grid :gap="1">
      <div class="title">
        {{ $t("reservation") }}
      </div>
      <Card :withPadding="false">
        <Flex class="reservation-actions" :gap="1">
          <Button
            variant="text"
            @click.stop="$emit('click-edit', reservation)"
            icon="edit"
          >
            {{ $t("edit") }}
          </Button>
        </Flex>
        <div class="reservation-content">
          <Grid :gap="5" :columns="{ xs: 1, sm: 2 }">
            <Grid :gap="1" :columns="1">
              <div class="text2">
                {{ $t("firstname") }}: {{ reservation.client?.firstname }}
              </div>
              <div class="text2">
                {{ $t("lastname") }}: {{ reservation.client?.lastname }}
              </div>
              <div class="text2">
                {{ $t("email") }}: {{ reservation.client?.email }}
              </div>
              <div class="text2">
                {{ $t("phone") }}: {{ reservation.client?.phone }}
              </div>
              <div class="text2">
                {{ $t("address") }}: {{ reservation.client?.address }}
              </div>
            </Grid>
            <div>
              <Flex
                :gap="1"
                direction="column"
                alignItems="flex-end"
                justifyContent="flex-start"
              >
                <div class="text2">
                  {{ $t("dtstart") }}:
                  {{
                    reservation.dtstart
                      ? $utils.formatDate(reservation.dtstart)
                      : "-"
                  }}
                </div>
                <div class="text2">
                  {{ $t("dtend") }}:
                  {{
                    reservation.dtend
                      ? $utils.formatDate(reservation.dtend)
                      : "-"
                  }}
                </div>
              </Flex>
            </div>
          </Grid>
        </div>
      </Card>
      <div v-for="line in reservation.lines" :key="line.id">
        <Card>
          {{ line.product }}
        </Card>
      </div>
    </Grid>
  </div>
</template>

<script setup lang="ts">
import Button from "core/src/components/Button.vue";
import Card from "core/src/components/Card.vue";
import Flex from "core/src/components/layouts/Flex.vue";
import Grid from "core/src/components/layouts/Grid.vue";
import type { Reservation } from "@/types/reservation";

interface ReservationViewProps {
  reservation: Reservation;
}
const props = withDefaults(defineProps<ReservationViewProps>(), {});
</script>
<style lang="scss" scoped>
.reservation-view {
  padding: spacing(2);
  .title {
    margin-bottom: spacing(2);
  }
}
.reservation-actions {
  padding: spacing(0.5) spacing(2);
  background-color: color("primary", 50);
}
.reservation-content {
  padding: spacing(2);
  .text {
    color: color("primary", 500);
  }
}
</style>
