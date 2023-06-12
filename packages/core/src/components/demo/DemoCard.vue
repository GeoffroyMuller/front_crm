<template>
    <div class="flex gap-2">
        <Card>
            <CardHead title="Card" subtitle="Card subtitle" />
            <CardDivider />
            <CardContent>
                <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
                    voluptatum, quibusdam, voluptate, quia voluptas quod quos
                    voluptatibus quae doloribus quidem voluptatem. Quisquam
                    voluptatum, quibusdam, voluptate, quia voluptas quod quos
                    voluptatibus quae doloribus quidem voluptatem.
                </p>
            </CardContent>
        </Card>
        <Card>
            <CardHead title="Card" />
            <CardDivider />
            <CardContent>
                <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
                    voluptatum, quibusdam, voluptate, quia voluptas quod quos
                    voluptatibus quae doloribus quidem voluptatem. Quisquam
                    voluptatum, quibusdam, voluptate, quia voluptas quod quos
                    voluptatibus quae doloribus quidem voluptatem.
                </p>
            </CardContent>
        </Card>

    </div>
</template>
  
<script setup lang="ts">

import Card from "../card/Card.vue";
import CardContent from "../card/CardContent.vue";
import CardHead from "../card/CardHead.vue";
import CardDivider from "../card/CardDivider.vue";
</script>