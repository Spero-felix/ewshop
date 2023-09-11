<template>
  <div style="margin-top: 50px">
    <nav-bar>
      <template v-slot:default>{{ title }}</template>
    </nav-bar>
    <van-address-edit
      :area-list="areaList"
      :address-info="addressInfo"
      :show-delete="type == 'edit'"
      show-set-default
      show-search-result
      :search-result="searchResult"
      :area-columns-placeholder="['请选择', '请选择', '请选择']"
      @save="onSave"
      @delete="onDelete"
      @change-detail="onChangeDetail"
    />
  </div>
</template>

<script>
import NavBar from 'components/common/navbar/NavBar';
import { ref, computed, reactive, toRefs, onMounted } from 'vue';
import { showToast } from 'vant';
import { tdist } from '@/utils/address';
import {
  addAddress,
  editAddress,
  deleteAddress,
  getAddress,
  getAddressDetail,
} from '@/network/address';
import { useRouter, useRoute } from 'vue-router';
import { useStore } from 'vuex';

export default {
  name: 'AddressEdit',
  components: {
    NavBar,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const store = useStore();
    const searchResult = ref([]);
    const addressInfo = ref({});
    const state = reactive({
      areaList: {
        province_list: {},
        city_list: {},
        county_list: {},
      },
      addressInfo,
      type: 'add',
      addressId: '',
    });

    onMounted(() => {
      // 省市区列表构造出来
      let _province_list = {};
      let _city_list = {};
      let _county_list = {};

      tdist.getLev1().map((p) => {
        _province_list[p.id] = p.text;
        tdist.getLev2(p.id).map((c) => {
          _city_list[c.id] = c.text;
          tdist.getLev3(c.id).map((q) => {
            _county_list[q.id] = q.text;
          });
        });
      });
      state.areaList.province_list = _province_list;
      state.areaList.city_list = _city_list;
      state.areaList.county_list = _county_list;

      const { type, addressId } = route.query;
      let _areaCode = '';
      state.type = type;
      state.addressId = addressId;

      if (state.type == 'edit') {
        getAddressDetail(addressId).then((res) => {
          const addressDetail = res;

          Object.entries(state.areaList.county_list).forEach(([id, text]) => {
            // 先找出当前对应的区
            if (text == addressDetail.county) {
              // 找到区对应的几个省份
              const provinceIndex = tdist
                .getLev1()
                .findIndex((item) => item.id.substr(0, 2) == id.substr(0, 2));
              // 找到区对应的几个市区
              // eslint-disable-next-line no-unused-vars
              const cityItem = Object.entries(state.areaList.city_list).filter(
                ([cityId, city]) => cityId.substr(0, 4) == id.substr(0, 4)
              )[0];
              // 对比找到的省份和接口返回的省份是否相等，因为有一些区会重名
              if (
                tdist.getLev1()[provinceIndex].text == addressDetail.province &&
                cityItem[1] == addressDetail.city
              ) {
                _areaCode = id;
              }
            }
          });

          state.addressInfo = {
            name: res.name,
            tel: res.phone,
            province: res.province,
            city: res.city,
            county: res.county,
            areaCode: _areaCode,
            addressDetail: res.address,
            isDefault: !!res.is_default,
          };
        });
      }
    });

    const title = computed(() => {
      return state.type == 'add' ? '新增地址' : '编辑地址';
    });

    const onSave = (info) => {
      const params = {
        name: info.name,
        address: info.addressDetail,
        phone: info.tel,
        province: info.province,
        city: info.city,
        county: info.county,
        is_default: info.isDefault ? 1 : 0,
      };
      if (state.type == 'edit') {
        editAddress(state.addressId, params);
      } else if (state.type == 'add') {
        // 调用借口数据
        addAddress(params);
      }

      showToast('保存成功!');
      setTimeout(() => {
        router.go(-1);
      }, 1000);
    };
    const onDelete = () => {
      deleteAddress(state.addressId).then((res) => {
        showToast('删除成功!');
        setTimeout(() => {
          router.go(-1);
        }, 1000);
      });
    };
    const onChangeDetail = (val) => {
      if (val) {
        searchResult.value = [
          {
            name: '黄龙万科中心',
            address: '杭州市西湖区',
          },
        ];
      } else {
        searchResult.value = [];
      }
    };

    return {
      title,
      onSave,
      onDelete,
      searchResult,
      onChangeDetail,
      addressInfo,
      ...toRefs(state),
    };
  },
};
</script>

<style scoped></style>
