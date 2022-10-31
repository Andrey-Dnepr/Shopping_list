window.addEventListener('DOMContentLoaded', () => {
    const addForm = document.querySelector('.products__form'),
          body = document.querySelector('body'),
          headerTitle = document.querySelector('header'),
          menuWindow = document.querySelector('.menu__window'),
          refreshWindow = document.querySelector('.refresh__window'),
          shoppingWindow = document.querySelector('.list__window');

    let productsItems = [],
        addNewProductForm = [];

    body.addEventListener('click', (event) => {
        switch (event.target.dataset.btn) {
            case 'refresh-stocks': 
                openRefreshWindow();
                addNewProductForm = document.querySelector('.products__form'); 
                console.log(body.children[5].children[0].childNodes[1].childNodes);
                break;
            case 'shoping-list':
                //Вставит приветствие Hello "nickname"! What do we do?
                headerTitle.classList.add('hide');
                menuWindow.classList.add('hide');    
                shoppingWindow.classList.toggle('hide');
                refreshWindow.classList.add('hide');         
                break;
            case 'add-product':
                addForm.insertAdjacentElement('afterend', addNewProduct(
                    addNewProductForm.childNodes[0].value,
                    addNewProductForm.childNodes[2].value,
                    addNewProductForm.childNodes[4].value,
                    addNewProductForm.childNodes[6].value,
                    addNewProductForm.childNodes[8].value
                ));
                //сделать отправку новых данных на сервер
                addNewProductForm.childNodes[0].value = '';
                addNewProductForm.childNodes[2].value = '';
                addNewProductForm.childNodes[4].value = '';
                addNewProductForm.childNodes[6].value = '';
                addNewProductForm.childNodes[8].value = '';
                break;
            case 'change-product':
                productsItems = document.querySelectorAll('.products__item');
                console.log(productsItems);
                if (event.target.innerHTML === "Change") {
                    event.target.innerHTML = "Cancel";
                    event.target.style.backgroundColor = 'rgb(244, 204, 43)';
                    productsItems.forEach(item => {
                        if (event.target.dataset.btnkey === item.dataset.obj) {
                            item.childNodes[7].classList.toggle('hide'); //под 7 номером у родителя находится елемент с тегом .btn__wrap
                            item.childNodes[1].disabled = false;
                            item.childNodes[3].disabled = false;
                        }
                    });    
                } else {
                    event.target.innerHTML = "Change";
                    event.target.style.backgroundColor = 'rgb(81, 167, 242)';
                    productsItems.forEach(item => {
                        if (event.target.dataset.btnkey === item.dataset.obj) {
                            item.childNodes[1].value = item.childNodes[1].placeholder;
                            item.childNodes[3].value = item.childNodes[3].placeholder;
                            item.childNodes[7].childNodes[3].value = item.childNodes[7].childNodes[3].placeholder;
                            item.childNodes[7].childNodes[7].value = item.childNodes[7].childNodes[7].placeholder;
                            item.childNodes[7].childNodes[11].value = item.childNodes[7].childNodes[11].placeholder;
                            item.childNodes[7].classList.toggle('hide'); //под 7 номером у родителя находится елемент с тегом .btn__wrap
                            item.childNodes[1].disabled = true;
                            item.childNodes[3].disabled = true;
                        }
                    });
                }
                break;
            case 'save-product':
                productsItems.forEach(item => {
                    if (event.target.dataset.btnkey === item.dataset.obj) {
                        item.childNodes[1].placeholder = item.childNodes[1].value;
                        item.childNodes[3].placeholder = item.childNodes[3].value;
                        item.childNodes[7].childNodes[3].placeholder = item.childNodes[7].childNodes[3].value;
                        item.childNodes[7].childNodes[7].placeholder = item.childNodes[7].childNodes[7].value;
                        item.childNodes[7].childNodes[11].placeholder = item.childNodes[7].childNodes[11].value;
                        item.childNodes[5].innerHTML = "Change";
                        item.childNodes[5].style.backgroundColor = 'rgb(81, 167, 242)';
                        item.childNodes[7].classList.toggle('hide'); //под 7 номером у родителя находится елемент с тегом .btn__wrap
                        item.childNodes[1].disabled = true;
                        item.childNodes[3].disabled = true;
                        //Сделать отправку ПОСТ запроса на сервер с обновленными данными
                    }
                });
                break;
            case 'del-product':
                productsItems.forEach(item => {
                    if (event.target.dataset.btnkey === item.dataset.obj) {
                        //вставить отправку данных на сервер об удалении элемента из списка
                        item.remove();
                    }
                });
                break;    
        }
    });

    function openRefreshWindow() {
        headerTitle.classList.toggle('hide');
        menuWindow.classList.toggle('hide');
        refreshWindow.classList.toggle('hide');
        const request = new XMLHttpRequest();
        request.open('GET', 'js/data.json');
        request.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        request.send();
        request.addEventListener('load', () => {
            if (request.status === 200) {
                const data = JSON.parse(request.response);
                const newItem = document.createElement('div');
                newItem.classList.add('products__item__wrap');
                for (let key in data) {
                    newItem.innerHTML += `
                    <div data-obj="${key}" data-name="${data[key].name}" class="products__item">
                        <input required disabled placeholder="${data[key].name}" value="${data[key].name}" name="product-name" type="text" class="input input_new-product input_product">
                        <input required disabled placeholder="${data[key].quantity}" value="${data[key].quantity}" name="product-quantity" type="text" class="input input_new-quantity input_quantity">
                        <button data-btnkey="${key}" data-btn="change-product" class="btn btn_change-product">Change</button>
                        <div data-wrap="${key}" class="btn__wrap hide">
                            <div class="products__price">Price for 1 unit</div>
                            <input required placeholder="${data[key].price}" value="${data[key].price}" name="product-price" type="text" class="input input_price">
                            <div class="products__group">Product group</div>
                            <input required placeholder="${data[key].group}" value="${data[key].group}" name="product-group" type="text" class="input input_group">
                            <div class="products__stock">Stock</div>
                            <input required placeholder="${data[key].stock}" value="${data[key].stock}" name="product-stock" type="text" class="input input_stock">
                            <button data-btnkey="${key}" data-btn="save-product" class="btn btn_refresh-product">Save</button>
                            <button data-btnkey="${key}" data-btn="del-product" class="btn btn_delete-product">Del</button>
                        </div>
                    </div>
                `
                };
                addForm.insertAdjacentElement('afterend', newItem);
            } else {
            //Вставить сообщение об ошибке
            }
        });    
    }

    function addNewProduct(name, quantity, price, group, stock) {
        const newProduct = document.createElement('div');
        newProduct.classList.add('products__item__wrap');
        newProduct.innerHTML = `
            <div data-obj="${name}" data-name="${name}" class="products__item">
                <input required disabled placeholder="${name}" value="${name}" name="product-name" type="text" class="input input_new-product input_product">
                <input required disabled placeholder="${quantity}" value="${quantity}" name="product-quantity" type="text" class="input input_new-quantity input_quantity">
                <button data-btnkey="${name}" data-btn="change-product" class="btn btn_change-product">Change</button>
                <div data-wrap="${name}" class="btn__wrap hide">
                    <div class="products__price">Price for 1 unit</div>
                    <input required placeholder="${price}" value="${price}" name="product-price" type="text" class="input input_price">
                    <div class="products__group">Product group</div>
                    <input required placeholder="${group}" value="${group}" name="product-group" type="text" class="input input_group">
                    <div class="products__stock">Stock</div>
                    <input required placeholder="${stock}" value="${stock}" name="product-stock" type="text" class="input input_stock">
                    <button data-btnkey="${name}" data-btn="save-product" class="btn btn_refresh-product">Save</button>
                    <button data-btnkey="${name}" data-btn="del-product" class="btn btn_delete-product">Del</button>
                </div>
            </div>
        `;
        return newProduct;
    }

    

});