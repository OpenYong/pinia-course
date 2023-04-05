<script setup>
import TheHeader from "@/components/TheHeader.vue";
import ProductCard from "@/components/ProductCard.vue";
import { useProductStore } from "./stores/ProductStore";
import { useCartStore } from "./stores/CartStore";

const productStore = useProductStore();
const cartStore = useCartStore();

cartStore.$onAction(({ name, store, args, after, onError }) => {
  if (name === "addItems") {
    after(() => {
      console.log(args[0]);
    });
  }
});
productStore.fill();
// const addToCart = (count, product) => {
//   count = parseInt(count);
//   cartStore.$patch((state) => {
//     for (let index = 0; index < count; index++) {
//       state.items.push(product);
//     }
//   });
// };
</script>

<template>
  <div class="container">
    <TheHeader />
    <div class="mb-5 flex justify-end gap-4">
      <AppButton @click="cartStore.undo">취소하기</AppButton>
      <AppButton @click="cartStore.redo">되돌리기</AppButton>
    </div>
    <ul class="sm:flex flex-wrap lg:flex-nowrap gap-5">
      <ProductCard
        v-for="product in productStore.products"
        :key="product.name"
        :product="product"
        @addToCart="cartStore.addItems($event, product)"
      />
    </ul>
  </div>
</template>
