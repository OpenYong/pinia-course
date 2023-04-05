<script setup>
import { ref, reactive } from "vue";
import TheHeader from "@/components/TheHeader.vue";
import ProductCard from "@/components/ProductCard.vue";
import { useProductStore } from "./stores/ProductStore";
import { useCartStore } from "./stores/CartStore";

const productStore = useProductStore();
const cartStore = useCartStore();
const history = reactive([]); // store - state의 변화를 기록하기 위한 배열
const doingHistory = ref(false);

history.push(JSON.stringify(cartStore.$state)); // $state는 모든 state에 접근하기 위함
const undo = () => {
  if (history.length === 1) return; // 초기값이기 때문에 더이상 undo할 수 없음
  doingHistory.value = true;
  history.pop();
  cartStore.$state = JSON.parse(history.at(-1));
  doingHistory.value = false;
};
cartStore.$subscribe((mutation, state) => {
  if (!doingHistory.value) {
    history.push(JSON.stringify(state));
  }
});
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
    <div class="mb-5 flex justify-end">
      <AppButton @click="undo">취소하기</AppButton>
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
