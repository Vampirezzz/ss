let $ = {
    convertStrToObj(str) {
        if (!str) {
            return {};
        }
        return JSON.parse(str);
    }
};
class goods {
    constructor() {
        // 获取购物车列表
        this.cartlist = document.querySelector('#card-good');
        this.go_index = document.querySelector('.go-index');
        this.init();
        this.addevent();
    }
    init() {
        // 获取本地存储信息
        let that = this;
        let storage = window.localStorage;
        let storage_str = storage.getItem('yougou') ? storage.getItem('yougou') : '';
        let storage_obj = $.convertStrToObj(storage_str);
        let good_id = storage_obj.key;
        if (storage_obj[good_id]) {
            // 清空空购物车页面
            this.cartlist.innerHTML = null;
            // 创建新的页面
            this.cartlist.innerHTML = `
            <div class="first">
                <table>
                    <tr class="tr1">
                        <td><input type="checkbox">全选</td>
                        <td>商品名称</td>
                        <td>颜色尺码</td>
                        <td>单价</td>
                        <td>数量</td>
                        <td>小计（元）</td>
                        <td>操作</td>
                    </tr>
                </table>
            </div>
            <div class="wrap">
                <span>
                    <input type="checkbox">全选
                </span>
                <span>移入收藏夹</span>
                <span><a href="javascript:;">删除</a></span>
            </div>
            `
            // 遍历，取出商品信息，动态添加到页面
            let ul = document.createElement('ul');
            for (let key in storage_obj) {
                let goods = storage_obj[key];
                console.log(goods)
                //动态添加到页面
                ul.setAttribute('data-good-id', key);
                ul.innerHTML = `
                <li>
                    <span><input type="checkbox"></span>
                    <span><img src=${goods.src}></span>
                </li>
                <li>${goods.name}</li>
                <li>
                    <p>颜色:${goods.color}</p>
                    <p>尺码:${goods.size}</p>
                </li>
                <li>${goods.price}</li>
                <li class="gd-num">
                    <span><a href="javascript:;" class="minus">-</a></span>
                    <input type="text" name="" id="" value="${goods.num}">
                    <a href="javascript:;" class="plus">+</a>
                </li>
                <li class="amount">${goods.price * goods.num}</li>
                <li>
                    <p>移入收藏夹</p>
                    <p><a href="javascript:;" class="del">删除</a></p>
                </li>
                `
                let wrap = document.querySelector('.wrap');
                this.cartlist.insertBefore(ul, wrap);
                // 添加总价
                let amounts = document.querySelectorAll('.amount');
                let total = 0;
                for (let i = 0, len = amounts.length; i < len; i++) {
                    total += Number(amounts[i].innerText);
                }
                let pay = document.createElement('div');
                pay.className = "pay";
                pay.innerHTML = `
                <button class="shopping">继续购物</button>
                <button class="cls">清空购物袋</button>
                <span>总计（不含运费 ）：<b class="total-price">¥${total}</b></span>
                <input type="button" class="payment" value="去结算">
            `
                this.cartlist.appendChild(pay);
            }


            // 清空购物袋
            let cls = document.querySelector('.cls');
            let uls = document.querySelectorAll('ul');
            cls.onclick = function () {
                if (confirm('您确定要清空购物袋吗？')) {
                    for (let i = 0; i < uls.length; i++) {
                        //获取后端数据
                        // 获取商品ID
                        let id = uls[i].getAttribute('data-good-id');
                        // 获取后端数据
                        let storage = window.localStorage;
                        let storage_str = storage.getItem('yougou') ? storage.getItem('yougou') : '';
                        let storage_obj = $.convertStrToObj(storage_str);
                        //删除这个商品
                        delete storage_obj[id];
                        //存入本地存储中
                        storage.setItem('yougou', JSON.stringify(storage_obj));
                        //前端
                        uls[i].remove();
                    }
                }
                location.reload();
            }
            // 跳转继续购物
            let go = document.querySelector('.shopping');
            go.onclick = function () {
                location.href = '../index.html';
            }
        };
        // 获取所有-
        let minus = document.querySelectorAll('.minus');
        for (let i = 0, len = minus.length; i < len; i++) {
            minus[i].onclick = function () {
                // 获取商品ID
                let id = this.parentNode.parentNode.parentNode.getAttribute('data-good-id');
                // 获取后端数据
                let storage = window.localStorage;
                let storage_str = storage.getItem('yougou') ? storage.getItem('yougou') : '';
                let storage_obj = $.convertStrToObj(storage_str);
                if (storage_obj[id].num > 1) {
                    storage_obj[id].num--;
                }
                // 存入本地存储中
                storage.setItem('yougou', JSON.stringify(storage_obj));
                // 前端
                this.parentNode.nextElementSibling.value = storage_obj[id].num;
                // 合计
                this.parentNode.parentNode.nextElementSibling.innerText = storage_obj[id].price * storage_obj[id].num;
                // 总价
                let amounts = document.querySelectorAll('.amount');
                let total = 0;
                for (let i = 0, len = amounts.length; i < len; i++) {
                    total += Number(amounts[i].innerText);
                }
                let total_price = document.querySelector('.total-price');
                total_price.innerText = total;
            }
        }
        // 获取所有+
        let plus = document.querySelectorAll('.plus');
        for (let i = 0, len = plus.length; i < len; i++) {
            plus[i].onclick = function () {
                // 获取商品ID
                let id = this.parentNode.parentNode.getAttribute('data-good-id');
                // 获取后端数据
                let storage = window.localStorage;
                let storage_str = storage.getItem('yougou') ? storage.getItem('yougou') : '';
                let storage_obj = $.convertStrToObj(storage_str);
                storage_obj[id].num++;
                // 存入本地存储中
                storage.setItem('yougou', JSON.stringify(storage_obj));
                // 前端
                this.previousElementSibling.value = storage_obj[id].num;
                // 合计
                this.parentNode.nextElementSibling.innerText = storage_obj[id].price * storage_obj[id].num;
                let amounts = document.querySelectorAll('.amount');
                let total = 0;
                for (let i = 0, len = amounts.length; i < len; i++) {
                    total += Number(amounts[i].innerText);
                }
                let total_price = document.querySelector('.total-price');
                total_price.innerText = total;
            }
        }
        //  获取所有数量框
        let input = document.querySelectorAll('.gd-num>input');
        for (let i = 0, len = input.length; i < len; i++) {
            input[i].onblur = function () {
                // 获取商品ID
                let id = this.parentNode.parentNode.getAttribute('data-good-id');
                // 获取后端数据
                let storage = window.localStorage;
                let storage_str = storage.getItem('yougou') ? storage.getItem('yougou') : '';
                let storage_obj = $.convertStrToObj(storage_str);
                let num = this.value;
                if (/^\d+$/.test(num) && num > 0) {
                    storage_obj[id].num = num;
                } else {
                    storage_obj[id].num = 1;
                }
                // 存入本地存储中
                storage.setItem('yougou', JSON.stringify(storage_obj));
                // 前端
                this.value = storage_obj[id].num;
                // 合计
                this.parentNode.nextElementSibling.innerText = storage_obj[id].price * storage_obj[id].num;

                let amounts = document.querySelectorAll('.amount');
                let total = 0;
                for (let i = 0, len = amounts.length; i < len; i++) {
                    total += Number(amounts[i].innerText);
                }
                let total_price = document.querySelector('.total-price');
                total_price.innerText = total;
            }
        }
        // 获取所有删除按钮
        let dels = document.querySelectorAll('.del');
        for (let i = 0, len = dels.length; i < len; i++) {
            dels[i].onclick = function () {
               if(confirm('确定要删除当前商品吗？')){
                 // 获取商品ID
                 let id = this.parentNode.parentNode.parentNode.getAttribute('data-good-id');
                 // 获取后端数据
                 let storage = window.localStorage;
                 let storage_str = storage.getItem('yougou') ? storage.getItem('yougou') : '';
                 let storage_obj = $.convertStrToObj(storage_str);
                 //删除这个商品
                 delete storage_obj[id];
                 //存入本地存储中
                 storage.setItem('yougou', JSON.stringify(storage_obj));
                 //前端
                 this.parentNode.parentNode.parentNode.remove();
               }
               location.reload();
            }
        }
    }
    addevent() {
        this.go_index.onclick = function () {
            location.href = '../index.html';
        }
    }
}
new goods();

// var key = "yougou";
// var value = {
//     2: {
//         "src": "../img/cart-good02.jpg",
//         "name": "女鞋",
//         "color": "白色",
//         "size": 36,
//         "price": 600,
//         "num": 1
//     }
// }
// window.localStorage.setItem(key, JSON.stringify(value));
