import type { Media } from "@/types/media";
import type { ID } from "core/src/types";
import { defineStore } from "pinia";
import axios from "axios";

const useMediaStore = defineStore({
    id: 'media',
    actions: {
        async updateMedia(id: ID, media: Media) {
            return await axios.put(`media/${id}`, media);
        }
    }
})

export default useMediaStore;