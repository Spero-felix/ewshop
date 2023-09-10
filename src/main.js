import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'vant/lib/index.css';
import {List,PullRefresh,Popup,AddressList,Grid,GridItem,AddressEdit,Icon,Swipe,Toast,SwipeCell,SubmitBar,Stepper,Image as VanImage,Checkbox, CheckboxGroup,Form, Field, CellGroup,Button ,Collapse,Tag ,Card,Tab,Tabs,CollapseItem,SwipeItem,Lazyload,Badge,Sidebar,SidebarItem} from "vant";

createApp(App)
  .use(Swipe).use(SwipeItem).use(Lazyload,{loading:require('./assets/images/default.png')})
  .use(Badge).use(Sidebar).use(SidebarItem).use(Collapse).use(CollapseItem)
  .use(Tab).use(Tabs).use(Card).use(VanImage).use(Button).use(Tag)
  .use(Form).use(Field).use(CellGroup).use(Checkbox).use(CheckboxGroup)
  .use(SwipeCell).use(Stepper).use(SubmitBar).use(Toast).use(Icon)
  .use(AddressEdit).use(AddressList).use(Popup).use(Grid).use(GridItem)
  .use(List).use(PullRefresh)
  .use(store).use(router).mount('#app')
