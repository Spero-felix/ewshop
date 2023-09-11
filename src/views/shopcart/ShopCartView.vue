<template>
  <div>
    <nav-bar>
      <template v-slot:default
        >购物车(<span style="color: red">{{ $store.state.cartCount }}</span
        >)</template
      >
    </nav-bar>
    <div class="cart-box">
      <div class="cart-body">
        <van-checkbox-group v-model="result" @change="groupChange">
          <van-swipe-cell
            :right-width="80"
            v-for="(item, index) in list"
            :key="index"
          >
            <div class="good-item">
              <van-checkbox :name="item.id" />
              <div class="good-img">
                <img src="~assets/images/1.png" alt="" />
              </div>
              <div class="good-desc">
                <div class="goods-title">
                  <span>{{ item.goods.title }}</span>
                  <span>x{{ item.goods.stock }}</span>
                </div>
                <div class="good-btn">
                  <div class="price">
                    <small>￥</small>{{ item.goods.price + '.00' }}
                  </div>
                  <van-stepper
                    :modelValue="item.num"
                    integer
                    :min="1"
                    :max="item.goods.stock"
                    :name="item.id"
                    :step="1"
                    @change="onchange"
                  />
                </div>
              </div>
            </div>
            <template #right>
              <van-button
                @click="deleteGood(item.id)"
                style="height: 100%"
                square
                icon="delete"
                text="删除"
                type="danger"
                class="delete-button"
              />
            </template>
          </van-swipe-cell>
        </van-checkbox-group>
      </div>
      <van-submit-bar :price="total" button-text="提交订单" @submit="onSubmit">
        <van-checkbox @click="allCheck" v-model:checked="checked"
          >全选</van-checkbox
        >
      </van-submit-bar>
      <div class="empty" v-if="!list.length">
        <img
          src="~assets/images/empty-car.png"
          alt="空购物车"
          class="empty-cart"
        />
        <div class="title">购物车空空如也~</div>
        <van-button round color="#1baeae" type="primary" block @click="goTo"
          >前往选购</van-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from 'components/common/navbar/NavBar';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { ref, reactive, toRefs, onMounted, computed } from 'vue';
import {
  getCart,
  deleteCartItem,
  checkedCart,
  modifyCart,
} from '@/network/cart';
import { showToast, showLoadingToast, closeToast } from 'vant';

export default {
  components: {
    NavBar,
  },
  setup() {
    const router = useRouter();
    const store = useStore();

    // 数据模型
    const state = reactive({
      list: [],
      result: [], // id数组
      checked: true,
    });

    const init = () => {
      showLoadingToast({ message: '加载中...', forbidClick: true });
      getCart('include=goods').then((res) => {
        if (res) {
          state.list = res.data;
          state.result = res.data
            .filter((n) => n.is_checked == 1)
            .map((item) => item.id);
          closeToast();
        }
      });
    };

    const allCheck = () => {
      if (state.checked == false) {
        state.result = state.list.map((item) => item.id);
        state.checked = true;
      } else {
        state.result = [];
        state.checked = false;
      }
    };

    const groupChange = (result) => {
      if (result.length != state.list.length || state.list.length == 0) {
        state.checked = false;
      } else {
        state.checked = true;
      }

      checkedCart({ cart_ids: result });
    };

    const deleteGood = (id) => {
      deleteCartItem(id).then((res) => {
        init(); // 重新初始化
        store.dispatch('updateCart');
      });
    };

    const total = computed(() => {
      let sum = 0;
      state.result.map((item) => {
        state.list.map((pro) => {
          if (pro.id == item) {
            sum += pro.num * pro.goods.price;
          }
        });
      });

      return sum * 100;
    });
    // 创建订单
    const onSubmit = () => {
      if (state.result.length == 0) {
        showToast('请选择商品进行结算');
        return;
      } else {
        router.push({ path: '/createorder' });
      }
    };

    const onchange = (value, detail) => {
      showLoadingToast({ message: '修改中...', forbidClick: true });
      modifyCart(detail.name, { num: value }).then((res) => {
        // 将客户端数据改变
        state.list.forEach((item) => {
          if (item.id == detail.name) {
            item.num = value;
          }
        });
        closeToast();
      });
    };

    onMounted(() => {
      init();
    });

    const goTo = () => {
      router.push({ path: '/' });
    };

    return {
      ...toRefs(state),
      goTo,
      onchange,
      groupChange,
      allCheck,
      onSubmit,
      deleteGood,
      total,
    };
  },
};
</script>

<style lang="scss" scoped>
.cart-box {
  .cart-body {
    /*display: flex;*/
    margin: 60px 0 100px 0;
    .good-item {
      display: flex;
      padding-left: 8px;
      .good-img {
        margin: auto 10px;
        img {
          width: 100px;
          height: auto;
        }
      }
      .good-desc {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        flex: 1;
        padding: 20px;
        .goods-title {
          display: flex;
          justify-content: space-between;
        }
        .good-btn {
          display: flex;
          justify-content: space-between;
        }
        .price {
          font-size: 16px;
          color: red;
          line-height: 28px;
        }
      }
    }
  }
  .van-submit-bar {
    bottom: 50px;
  }
  .empty {
    width: 50%;
    margin: 0 auto;
    text-align: center;
    margin-top: 200px;
    .empty-cart {
      width: 150px;
      margin-bottom: 20px;
    }
    .van-icon-smile-o {
      font-size: 50px;
    }
    .title {
      font-size: 16px;
      margin-bottom: 20px;
    }
  }
}
</style>
